import { useEffect, useState } from 'react';

export default function SplashScreen() {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = 'Nelson-GPT';
    const typingSpeed = 150;

    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, typingSpeed);

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
            <div className="text-center animate-in fade-in duration-500">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent min-h-[4rem] flex items-center justify-center">
                    {displayedText}
                    <span className="inline-block w-1 h-12 bg-primary ml-1 animate-pulse" />
                </h1>
                <p className="text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: '1.5s', animationFillMode: 'backwards' }}>
                    Pediatric Knowledge at Your Finger Tips
                </p>
            </div>
        </div>
    );
}
