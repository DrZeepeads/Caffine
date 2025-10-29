import { useState } from 'react';
import { Plus, MessageSquare, Pin, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useChatStore } from '../lib/store';
import { useGetAllChats, useGetPinnedChats, useCreateChat, useDeleteChat } from '../hooks/useQueries';
import { toast } from 'sonner';

interface SidebarNavProps {
    onClose?: () => void;
}

export default function SidebarNav({ onClose }: SidebarNavProps) {
    const { setCurrentChatId } = useChatStore();
    const { data: allChats = [] } = useGetAllChats();
    const { data: pinnedChats = [] } = useGetPinnedChats();
    const createChat = useCreateChat();
    const deleteChat = useDeleteChat();

    const handleNewChat = async () => {
        try {
            const chatId = await createChat.mutateAsync('New Chat');
            setCurrentChatId(chatId);
            onClose?.();
        } catch (error) {
            toast.error('Failed to create new chat');
        }
    };

    const handleChatClick = (chatId: bigint) => {
        setCurrentChatId(chatId);
        onClose?.();
    };

    const handleDeleteChat = async (chatId: bigint, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteChat.mutateAsync(chatId);
            toast.success('Chat deleted');
        } catch (error) {
            toast.error('Failed to delete chat');
        }
    };

    return (
        <div className="flex flex-col h-full bg-sidebar">
            <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/assets/generated/user-avatar.dim_64x64.png" alt="User" />
                        <AvatarFallback>
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-semibold">User</p>
                        <p className="text-xs text-muted-foreground">Pediatric AI Assistant</p>
                    </div>
                </div>

                <Button onClick={handleNewChat} className="w-full justify-start gap-2" variant="default">
                    <Plus className="h-4 w-4" />
                    New Chat
                </Button>
            </div>

            <Separator />

            <ScrollArea className="flex-1 px-4">
                {pinnedChats.length > 0 && (
                    <div className="py-4">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
                            <Pin className="h-3 w-3" />
                            Pinned
                        </div>
                        <div className="space-y-1">
                            {pinnedChats.map((chat) => (
                                <DropdownMenu key={chat.id.toString()}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-left h-auto py-2"
                                            onClick={() => handleChatClick(chat.id)}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="truncate text-sm">{chat.title}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={(e) => handleDeleteChat(chat.id, e)}
                                            className="text-destructive"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ))}
                        </div>
                    </div>
                )}

                <div className="py-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        Recent Chats
                    </div>
                    <div className="space-y-1">
                        {allChats
                            .filter((chat) => !chat.pinned)
                            .slice(0, 10)
                            .map((chat) => (
                                <DropdownMenu key={chat.id.toString()}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-left h-auto py-2"
                                            onClick={() => handleChatClick(chat.id)}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="truncate text-sm">{chat.title}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={(e) => handleDeleteChat(chat.id, e)}
                                            className="text-destructive"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ))}
                    </div>
                </div>
            </ScrollArea>

            <Separator />

            <div className="p-4 space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Log Out
                </Button>
            </div>

            <div className="p-4 text-center text-xs text-muted-foreground border-t">
                © 2025. Built with ❤️ using{' '}
                <a
                    href="https://caffeine.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                >
                    caffeine.ai
                </a>
            </div>
        </div>
    );
}

