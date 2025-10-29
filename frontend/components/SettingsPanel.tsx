import { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Type, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { useGetUserSettings, useSaveUserSettings } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { UserSettings } from '../backend';

interface SettingsPanelProps {
    onBack: () => void;
    onClose?: () => void;
}

export default function SettingsPanel({ onBack, onClose }: SettingsPanelProps) {
    const { theme, setTheme } = useTheme();
    const userId = 'default-user';
    const { data: userSettings } = useGetUserSettings(userId);
    const saveSettings = useSaveUserSettings();

    const [fontSize, setFontSize] = useState<string>('medium');
    const [notifications, setNotifications] = useState<boolean>(true);

    useEffect(() => {
        if (userSettings) {
            setFontSize(userSettings.font || 'medium');
            setNotifications(userSettings.notifications);
            if (userSettings.theme) {
                setTheme(userSettings.theme);
            }
        }
    }, [userSettings, setTheme]);

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        await saveSettingsToBackend({ theme: newTheme });
    };

    const handleFontSizeChange = async (newSize: string) => {
        setFontSize(newSize);
        await saveSettingsToBackend({ font: newSize });
        
        const root = document.documentElement;
        if (newSize === 'small') {
            root.style.fontSize = '14px';
        } else if (newSize === 'large') {
            root.style.fontSize = '18px';
        } else {
            root.style.fontSize = '16px';
        }
    };

    const handleNotificationsChange = async (enabled: boolean) => {
        setNotifications(enabled);
        await saveSettingsToBackend({ notifications: enabled });
    };

    const saveSettingsToBackend = async (updates: Partial<UserSettings>) => {
        try {
            const currentSettings: UserSettings = userSettings || {
                theme: theme || 'light',
                font: 'medium',
                notifications: true,
                aiTone: 'professional',
                aiDepth: 'detailed',
                privacy: 'standard',
                mode: 'academic'
            };

            const updatedSettings: UserSettings = {
                ...currentSettings,
                ...updates
            };

            await saveSettings.mutateAsync({
                userId,
                settings: updatedSettings
            });

            toast.success('Settings saved');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    return (
        <div className="flex flex-col h-full bg-sidebar animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-lg font-semibold">Settings</h2>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                Theme
                            </h3>
                            <RadioGroup value={theme} onValueChange={handleThemeChange}>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="light" id="light" />
                                    <Label htmlFor="light" className="cursor-pointer flex-1">
                                        Light
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="dark" id="dark" />
                                    <Label htmlFor="dark" className="cursor-pointer flex-1">
                                        Dark
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="system" id="system" />
                                    <Label htmlFor="system" className="cursor-pointer flex-1">
                                        System
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                Font Size
                            </h3>
                            <RadioGroup value={fontSize} onValueChange={handleFontSizeChange}>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="small" id="small" />
                                    <Label htmlFor="small" className="cursor-pointer flex-1">
                                        Small
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium" className="cursor-pointer flex-1">
                                        Medium
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="large" id="large" />
                                    <Label htmlFor="large" className="cursor-pointer flex-1">
                                        Large
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                                Notifications
                            </h3>
                            <div className="flex items-center justify-between py-2">
                                <Label htmlFor="notifications" className="cursor-pointer">
                                    Enable notifications
                                </Label>
                                <Switch
                                    id="notifications"
                                    checked={notifications}
                                    onCheckedChange={handleNotificationsChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>

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
