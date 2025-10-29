import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import ChatScreen from './pages/ChatScreen';
import { useChatStore } from './lib/store';

function App() {
    const { currentChatId } = useChatStore();
    const [hasStarted, setHasStarted] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleStart = () => {
        setHasStarted(true);
    };

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="min-h-screen bg-background flex flex-col">
                <div className="flex-1">
                    {!hasStarted || !currentChatId ? (
                        <WelcomeScreen onStart={handleStart} />
                    ) : (
                        <ChatScreen />
                    )}
                </div>
                <footer className="py-3 text-center text-xs text-muted-foreground border-t bg-card/30 backdrop-blur-sm">
                    Powered by Nelson Textbook of Pediatrics
                </footer>
                <Toaster />
            </div>
        </ThemeProvider>
    );
}

export default App;
