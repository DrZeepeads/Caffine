import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TypingIndicator() {
    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    N
                </AvatarFallback>
            </Avatar>

            <div className="bg-card shadow-soft border border-border rounded-[18px] px-4 py-3">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                </div>
            </div>
        </div>
    );
}

