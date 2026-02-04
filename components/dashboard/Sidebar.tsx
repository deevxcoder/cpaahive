'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FolderOpen, BarChart3, Settings, Hexagon, User, LogOut, Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react';
import { db } from '@/lib/db';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';


const routes = [
    { label: 'Overview', icon: LayoutDashboard, href: '/dashboard', color: 'text-sky-500' },
    { label: 'Projects', icon: FolderOpen, href: '/dashboard/projects', color: 'text-violet-500' },
    { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', color: 'text-pink-700' },
];

const aiRoutes = [
    { label: 'Copyright AI', icon: Sparkles, href: '/dashboard/ai/copyright', color: 'text-amber-500' },
    { label: 'Image Generator', icon: ImageIcon, href: '/dashboard/ai/image', color: 'text-emerald-500' },
];

const bottomRoutes = [
    { label: 'Profile', icon: User, href: '/dashboard/profile', color: 'text-orange-500' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings', color: 'text-gray-500' },
];

export function Sidebar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { user: authUser } = db.useAuth();
    const { data: userData } = db.useQuery(
        authUser?.id ? {
            $users: {
                $: { where: { id: authUser.id } }
            }
        } : null
    );

    const user = userData?.$users?.[0];
    const userEmail = authUser?.email || '';
    const userName = user?.name || userEmail.split('@')[0];
    const userAvatar = user?.avatar;
    const initials = userName.substring(0, 2).toUpperCase();

    const handleSignOut = async () => {
        try {
            await db.auth.signOut();
            window.location.href = '/login';
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    if (!mounted) return null;

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card/60 backdrop-blur-md border-r border-border">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-10">
                    <Hexagon className="h-8 w-8 text-primary mr-2 fill-primary/20" />
                    <h1 className="text-2xl font-bold tracking-tighter text-foreground">CPAHive</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-primary" : route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}

                    <div className="pt-4 pb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-3">
                            AI Tools
                        </p>
                    </div>

                    {aiRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-primary" : route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}

                    <div className="pt-4 pb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-3">
                            Account
                        </p>
                    </div>

                    {bottomRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-primary" : route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-4 mt-auto border-t border-border/50">
                <div className="flex items-center justify-between gap-x-3 px-3 mb-4">
                    <div className="flex items-center gap-x-3">
                        <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage src={userAvatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">
                                {userName}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                                {userEmail}
                            </p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
                <button
                    onClick={handleSignOut}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-destructive hover:bg-destructive/10 rounded-lg transition text-muted-foreground"
                >

                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-destructive" />
                        Sign Out
                    </div>
                </button>
            </div>
        </div>
    );
}
