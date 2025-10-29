import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useChatStore } from '../lib/store';
import { useGetChat } from '../hooks/useQueries';

export default function ChatContainer() {
    const { currentChatId, isTyping } = useChatStore();
    const { data: chat } = useGetChat(currentChatId);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat?.messages, isTyping]);

    return (
        <ScrollArea className="flex-1 px-4 py-6">
            <div ref={scrollRef} className="max-w-3xl mx-auto space-y-6">
                {chat?.messages.map((message, index) => (
                    <div
                        key={message.id.toString()}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <MessageBubble message={message} />
                    </div>
                ))}

                {isTyping && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-200">
                        <TypingIndicator />
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}

