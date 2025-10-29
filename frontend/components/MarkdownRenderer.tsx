import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderedContent = useMemo(() => {
    let html = content;

    // Escape HTML to prevent XSS
    const escapeHtml = (text: string) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Process code blocks first (before other processing)
    const codeBlocks: { id: string; code: string; language: string }[] = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const id = `code-${codeBlocks.length}`;
      codeBlocks.push({ id, code: code.trim(), language: lang || 'text' });
      return `__CODE_BLOCK_${id}__`;
    });

    // Process inline code
    html = html.replace(/`([^`]+)`/g, (match, code) => {
      return `<code class="inline-code">${escapeHtml(code)}</code>`;
    });

    // Process tables (GitHub Flavored Markdown style)
    html = html.replace(/\n(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)+)/g, (match, header, separator, rows) => {
      const headerCells = header.split('|').filter((cell: string) => cell.trim()).map((cell: string) => 
        `<th class="table-header">${escapeHtml(cell.trim())}</th>`
      ).join('');
      
      const rowsHtml = rows.trim().split('\n').map((row: string) => {
        const cells = row.split('|').filter((cell: string) => cell.trim()).map((cell: string) => 
          `<td class="table-cell">${escapeHtml(cell.trim())}</td>`
        ).join('');
        return `<tr class="table-row">${cells}</tr>`;
      }).join('');

      return `<div class="table-wrapper"><table class="markdown-table"><thead><tr>${headerCells}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
    });

    // Process headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="markdown-h3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="markdown-h2">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="markdown-h1">$1</h1>');

    // Process bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="markdown-bold">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="markdown-bold">$1</strong>');

    // Process italic
    html = html.replace(/\*(.+?)\*/g, '<em class="markdown-italic">$1</em>');
    html = html.replace(/_(.+?)_/g, '<em class="markdown-italic">$1</em>');

    // Process lists
    html = html.replace(/^\* (.+)$/gm, '<li class="markdown-li">$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li class="markdown-li">$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="markdown-li-ordered">$2</li>');

    // Wrap consecutive list items
    html = html.replace(/(<li class="markdown-li">.*<\/li>\n?)+/g, '<ul class="markdown-ul">$&</ul>');
    html = html.replace(/(<li class="markdown-li-ordered">.*<\/li>\n?)+/g, '<ol class="markdown-ol">$&</ol>');

    // Process blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="markdown-blockquote">$1</blockquote>');

    // Process horizontal rules
    html = html.replace(/^---$/gm, '<hr class="markdown-hr" />');
    html = html.replace(/^\*\*\*$/gm, '<hr class="markdown-hr" />');

    // Process links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="markdown-link" target="_blank" rel="noopener noreferrer">$1</a>');

    // Process line breaks
    html = html.replace(/\n\n/g, '<br class="markdown-br" /><br class="markdown-br" />');
    html = html.replace(/\n/g, '<br class="markdown-br" />');

    // Restore code blocks with syntax highlighting
    codeBlocks.forEach(({ id, code, language }) => {
      const escapedCode = escapeHtml(code);
      const codeBlockHtml = `
        <div class="code-block-wrapper" data-code-id="${id}">
          <div class="code-block-header">
            <span class="code-block-language">${language}</span>
            <button class="code-block-copy" data-code="${escapeHtml(code)}" data-id="${id}">
              <span class="copy-icon" data-id="${id}">Copy</span>
            </button>
          </div>
          <pre class="code-block"><code class="language-${language}">${escapedCode}</code></pre>
        </div>
      `;
      html = html.replace(`__CODE_BLOCK_${id}__`, codeBlockHtml);
    });

    return { __html: html, codeBlocks };
  }, [content]);

  // Handle copy button clicks
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const button = target.closest('.code-block-copy') as HTMLButtonElement;
    if (button) {
      const code = button.getAttribute('data-code');
      const id = button.getAttribute('data-id');
      if (code && id) {
        handleCopyCode(code, id);
      }
    }
  };

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={renderedContent}
      onClick={handleClick}
    />
  );
}
