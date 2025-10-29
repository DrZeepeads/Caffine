import { create } from 'zustand';
import type { Chat, Message, UserSettings } from '../backend';

interface ChatState {
    currentChatId: bigint | null;
    currentMode: 'academic' | 'clinical';
    isTyping: boolean;
    setCurrentChatId: (id: bigint | null) => void;
    setCurrentMode: (mode: 'academic' | 'clinical') => void;
    setIsTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    currentChatId: null,
    currentMode: 'academic',
    isTyping: false,
    setCurrentChatId: (id) => set({ currentChatId: id }),
    setCurrentMode: (mode) => set({ currentMode: mode }),
    setIsTyping: (typing) => set({ isTyping: typing })
}));

