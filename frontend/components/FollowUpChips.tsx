import { Button } from '@/components/ui/button';
import { useChatStore } from '../lib/store';
import { useAddMessage } from '../hooks/useQueries';
import type { FollowUp } from '../backend';
import { toast } from 'sonner';

interface FollowUpChipsProps {
    followUps: FollowUp[];
}

export default function FollowUpChips({ followUps }: FollowUpChipsProps) {
    const { currentChatId, setIsTyping } = useChatStore();
    const addMessage = useAddMessage();

    const handleFollowUpClick = async (question: string) => {
        if (!currentChatId) return;

        try {
            await addMessage.mutateAsync({
                chatId: currentChatId,
                role: 'user',
                content: question
            });

            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
            }, 2000);
        } catch (error) {
            toast.error('Failed to send follow-up question');
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {followUps.map((followUp) => (
                <Button
                    key={followUp.id.toString()}
                    variant="outline"
                    size="sm"
                    onClick={() => handleFollowUpClick(followUp.question)}
                    className="rounded-full text-xs hover:bg-accent"
                >
                    {followUp.question}
                </Button>
            ))}
        </div>
    );
}

