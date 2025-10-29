import type { Citation } from '../backend';

interface CitationListProps {
    citations: Citation[];
    expandedCitations: Set<bigint>;
}

export default function CitationList({ citations, expandedCitations }: CitationListProps) {
    return (
        <>
            {citations.map((citation) => {
                const isExpanded = expandedCitations.has(citation.id);
                return (
                    <div
                        key={citation.id.toString()}
                        className={`overflow-hidden transition-all duration-200 ${
                            isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="p-3 bg-muted rounded-lg border border-border">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                                [{citation.id.toString()}] {citation.reference}
                            </p>
                            <p className="text-xs text-foreground">{citation.details}</p>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

