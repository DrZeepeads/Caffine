import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '../lib/store';
import { useCreateChat, useAddMessage } from '../hooks/useQueries';
import { toast } from 'sonner';

interface WelcomeScreenProps {
    onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    const [input, setInput] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const { currentMode, setCurrentMode, setCurrentChatId } = useChatStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const createChat = useCreateChat();
    const addMessage = useAddMessage();

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isAnimating) return;

        setIsAnimating(true);

        try {
            const chatId = await createChat.mutateAsync('New Chat');
            await addMessage.mutateAsync({
                chatId,
                role: 'user',
                content: input.trim()
            });

            setCurrentChatId(chatId);

            setTimeout(() => {
                onStart();
            }, 600);
        } catch (error) {
            toast.error('Failed to start chat');
            setIsAnimating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center p-4">
            <div
                className={`w-full max-w-[480px] transition-all duration-400 ${
                    isAnimating ? 'opacity-0 translate-y-[280px]' : 'opacity-100 translate-y-0'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
                <div className="mb-8 text-center animate-in fade-in duration-300">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Nelson-GPT
                    </h1>
                    <p className="text-muted-foreground">Your pediatric AI assistant</p>
                </div>

                <div
                    className="bg-card rounded-[20px] shadow-soft-lg p-4 w-full animate-in fade-in slide-in-from-bottom-5 duration-300"
                    style={{ minHeight: '240px', animationDelay: '100ms' }}
                >
                    <div className="flex gap-2 mb-4">
                        <Button
                            variant={currentMode === 'academic' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentMode('academic')}
                            className={
                                currentMode === 'academic'
                                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                            }
                        >
                            Academic
                        </Button>
                        <Button
                            variant={currentMode === 'clinical' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentMode('clinical')}
                            className={
                                currentMode === 'clinical'
                                    ? 'bg-clinical hover:bg-clinical/90 text-clinical-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                            }
                        >
                            Clinical
                        </Button>
                    </div>

                    <div className="relative">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Nelson-GPT anything…"
                            className="min-h-[120px] max-h-[180px] resize-none border-0 focus-visible:ring-0 text-base p-0 bg-transparent"
                            disabled={isAnimating}
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!input.trim() || isAnimating}
                            className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md disabled:opacity-50"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
