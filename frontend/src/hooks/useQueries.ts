import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Chat, UserSettings } from '../backend';

export function useGetAllChats() {
    const { actor, isFetching } = useActor();

    return useQuery<Chat[]>({
        queryKey: ['chats'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllChats();
        },
        enabled: !!actor && !isFetching
    });
}

export function useGetChat(chatId: bigint | null) {
    const { actor, isFetching } = useActor();

    return useQuery<Chat | null>({
        queryKey: ['chat', chatId?.toString()],
        queryFn: async () => {
            if (!actor || !chatId) return null;
            return actor.getChat(chatId);
        },
        enabled: !!actor && !isFetching && chatId !== null
    });
}

export function useGetPinnedChats() {
    const { actor, isFetching } = useActor();

    return useQuery<Chat[]>({
        queryKey: ['pinnedChats'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getPinnedChats();
        },
        enabled: !!actor && !isFetching
    });
}

export function useGetUserSettings(userId: string) {
    const { actor, isFetching } = useActor();

    return useQuery<UserSettings | null>({
        queryKey: ['userSettings', userId],
        queryFn: async () => {
            if (!actor) return null;
            return actor.getUserSettings(userId);
        },
        enabled: !!actor && !isFetching && !!userId
    });
}

export function useCreateChat() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (title: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.createChat(title);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        }
    });
}

export function useAddMessage() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            chatId,
            role,
            content
        }: {
            chatId: bigint;
            role: string;
            content: string;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addMessage(chatId, role, content);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId.toString()] });
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        }
    });
}

export function useAddCitation() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            chatId,
            messageId,
            reference,
            details
        }: {
            chatId: bigint;
            messageId: bigint;
            reference: string;
            details: string;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addCitation(chatId, messageId, reference, details);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId.toString()] });
        }
    });
}

export function useAddFollowUp() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            chatId,
            messageId,
            question
        }: {
            chatId: bigint;
            messageId: bigint;
            question: string;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addFollowUp(chatId, messageId, question);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId.toString()] });
        }
    });
}

export function usePinChat() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (chatId: bigint) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.pinChat(chatId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            queryClient.invalidateQueries({ queryKey: ['pinnedChats'] });
        }
    });
}

export function useUnpinChat() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (chatId: bigint) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.unpinChat(chatId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            queryClient.invalidateQueries({ queryKey: ['pinnedChats'] });
        }
    });
}

export function useRenameChat() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ chatId, newTitle }: { chatId: bigint; newTitle: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.renameChat(chatId, newTitle);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        }
    });
}

export function useDeleteChat() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (chatId: bigint) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.deleteChat(chatId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        }
    });
}

export function useSaveUserSettings() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, settings }: { userId: string; settings: UserSettings }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.saveUserSettings(userId, settings);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userSettings', variables.userId] });
        }
    });
}

export function useUpdateUserMode() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, mode }: { userId: string; mode: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateUserMode(userId, mode);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userSettings', variables.userId] });
        }
    });
}

