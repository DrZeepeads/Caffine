import { useState } from 'react';
import { ArrowLeft, MoreVertical, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ChatContainer from '../components/ChatContainer';
import InputDock from '../components/InputDock';
import SidebarNav from '../components/SidebarNav';
import { useChatStore } from '../lib/store';

export default function ChatScreen() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { setCurrentChatId } = useChatStore();

    const handleBack = () => {
        setCurrentChatId(null);
    };

    return (
        <div className="flex h-[calc(100vh-3rem)] overflow-hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-[280px] p-0">
                    <SidebarNav onClose={() => setSidebarOpen(false)} />
                </SheetContent>
            </Sheet>

            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between px-4 py-3 border-b bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-5 duration-200">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                    </div>

                    <h1 className="text-lg font-semibold">Nelson-GPT</h1>

                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </header>

                <ChatContainer />

                <InputDock />
            </div>
        </div>
    );
}
