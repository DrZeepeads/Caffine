import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '../lib/store';
import { useAddMessage } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function InputDock() {
    const [input, setInput] = useState('');
    const { currentChatId, currentMode, setCurrentMode, setIsTyping } = useChatStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const addMessage = useAddMessage();

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || !currentChatId) return;

        const messageContent = input.trim();
        setInput('');

        try {
            await addMessage.mutateAsync({
                chatId: currentChatId,
                role: 'user',
                content: messageContent
            });

            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
            }, 2000);
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t bg-card/50 backdrop-blur-sm p-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex gap-2 mb-2 justify-center">
                    <Button
                        variant={currentMode === 'academic' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentMode('academic')}
                        className={
                            currentMode === 'academic'
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground h-7 text-xs'
                                : 'h-7 text-xs'
                        }
                    >
                        Academic
                    </Button>
                    <Button
                        variant={currentMode === 'clinical' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentMode('clinical')}
                        className={
                            currentMode === 'clinical'
                                ? 'bg-clinical hover:bg-clinical/90 text-clinical-foreground h-7 text-xs'
                                : 'h-7 text-xs'
                        }
                    >
                        Clinical
                    </Button>
                </div>

                <div className="flex items-end gap-2 bg-card rounded-full px-4 py-2 shadow-soft border border-border">
                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                        <Mic className="h-5 w-5" />
                    </Button>

                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message…"
                        className="flex-1 min-h-[36px] max-h-[120px] resize-none border-0 focus-visible:ring-0 bg-transparent p-0 text-sm"
                        rows={1}
                    />

                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

