import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CitationList from './CitationList';
import FollowUpChips from './FollowUpChips';
import type { Message } from '../backend';

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const [expandedCitations, setExpandedCitations] = useState<Set<bigint>>(new Set());

    const isUser = message.role === 'user';

    const toggleCitation = (citationId: bigint) => {
        setExpandedCitations((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(citationId)) {
                newSet.delete(citationId);
            } else {
                newSet.add(citationId);
            }
            return newSet;
        });
    };

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar className="h-8 w-8 flex-shrink-0">
                {isUser ? (
                    <>
                        <AvatarImage src="/assets/generated/user-avatar.dim_64x64.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </>
                ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        N
                    </AvatarFallback>
                )}
            </Avatar>

            <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
                <div
                    className={`rounded-[18px] px-4 py-3 max-w-[85%] ${
                        isUser
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-card shadow-soft border border-border'
                    }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>

                    {!isUser && message.citations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {message.citations.map((citation) => (
                                <Badge
                                    key={citation.id.toString()}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-accent"
                                    onClick={() => toggleCitation(citation.id)}
                                >
                                    [{citation.id.toString()}]
                                </Badge>
                            ))}
                        </div>
                    )}

                    {!isUser && message.citations.length > 0 && (
                        <CitationList
                            citations={message.citations}
                            expandedCitations={expandedCitations}
                        />
                    )}
                </div>

                {!isUser && message.followUps.length > 0 && (
                    <div className="mt-3">
                        <FollowUpChips followUps={message.followUps} />
                    </div>
                )}
            </div>
        </div>
    );
}

