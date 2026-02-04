'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Activity,
    DollarSign,
    Users,
    Eye,
    Loader2,
    TrendingUp,
    MousePointer2,
    Filter,
    HelpCircle,
    ArrowUpRight,
    ChevronDown,
    ExternalLink,
    Layout
} from "lucide-react";
import {
    subDays,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfYear,
    isAfter,
    isBefore,
    format
} from 'date-fns';
import { RecentLeadsTable } from '@/components/dashboard/RecentLeadsTable';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';

export default function DashboardPage() {
    const { user: authUser, isLoading: authLoading } = db.useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data, isLoading: queryLoading } = db.useQuery(
        authUser?.id ? {
            pages: {
                $: { where: { ownerId: authUser.id } }
            },
            leads: {
                $: { where: { ownerId: authUser.id }, limit: 1000, order: { timestamp: 'desc' } },
                page: {}
            },
            analytics_events: {
                $: { where: { ownerId: authUser.id } }
            }
        } : null
    );

    const stats = useMemo(() => {
        if (!data) return null;

        const allLeads = data.leads || [];
        const allEvents = data.analytics_events || [];
        const allPages = data.pages || [];
        const now = new Date();

        const getEarnings = (items: any[]) => items.reduce((sum: number, item: any) => sum + (item.payout || 0), 0);

        const filterByRange = (items: any[], start: Date, end?: Date) => {
            return items.filter(item => {
                const date = new Date(item.timestamp);
                return isAfter(date, start) && (end ? isBefore(date, end) : true);
            });
        };

        // Time Ranges
        const todayStart = startOfDay(now);
        const yesterdayStart = startOfDay(subDays(now, 1));
        const weekStart = startOfWeek(now);
        const lastWeekStart = startOfWeek(subDays(now, 7));
        const monthStart = startOfMonth(now);
        const lastMonthStart = startOfMonth(subDays(now, 30));
        const yearStart = startOfYear(now);
        const lastYearStart = startOfYear(subDays(now, 365));

        // Payout Calculations
        const earningsToday = getEarnings(filterByRange(allLeads, todayStart));
        const earningsYesterday = getEarnings(filterByRange(allLeads, yesterdayStart, todayStart));
        const earningsThisWeek = getEarnings(filterByRange(allLeads, weekStart));
        const earningsLastWeek = getEarnings(filterByRange(allLeads, lastWeekStart, weekStart));
        const earningsThisMonth = getEarnings(filterByRange(allLeads, monthStart));
        const earningsLastMonth = getEarnings(filterByRange(allLeads, lastMonthStart, monthStart));
        const earningsThisYear = getEarnings(filterByRange(allLeads, yearStart));
        const earningsLastYear = getEarnings(filterByRange(allLeads, lastYearStart, yearStart));

        // Per Page Stats
        const pageStats = allPages.map(page => {
            const pageLeads = allLeads.filter(l => l.pageId === page.id);
            const pageViews = allEvents.filter(e => e.pageId === page.id && e.type === 'view').length;
            const pageClicks = allEvents.filter(e => e.pageId === page.id && e.type === 'click').length;
            const pageEarnings = getEarnings(pageLeads);
            const cvr = pageClicks > 0 ? (pageLeads.length / pageClicks) * 100 : 0;
            const epc = pageClicks > 0 ? pageEarnings / pageClicks : 0;

            return {
                ...page,
                views: pageViews,
                leads: pageLeads.length,
                earnings: pageEarnings.toFixed(2),
                cvr: cvr.toFixed(1),
                epc: epc.toFixed(2)
            };
        });

        return {
            earnings: {
                today: earningsToday.toFixed(2),
                yesterday: earningsYesterday.toFixed(2),
                thisWeek: earningsThisWeek.toFixed(2),
                lastWeek: earningsLastWeek.toFixed(2),
                thisMonth: earningsThisMonth.toFixed(2),
                lastMonth: earningsLastMonth.toFixed(2),
                thisYear: earningsThisYear.toFixed(2),
                lastYear: earningsLastYear.toFixed(2)
            },
            pageStats
        };
    }, [data]);

    if (!mounted || authLoading || (queryLoading && !data)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const recentLeads = (data?.leads || []).slice(0, 10);

    return (
        <TooltipProvider>
            <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto bg-background min-h-screen text-foreground">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                        <p className="text-muted-foreground text-sm">Welcome back! Here's your performance snapshot.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Pages and Conversions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Your Pages Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <Layout className="h-5 w-5 text-primary" />
                                    Your Pages
                                </h3>
                                <Link href="/dashboard/projects" className="text-xs font-semibold text-primary hover:underline uppercase tracking-widest">
                                    View All
                                </Link>
                            </div>
                            <div className="grid gap-4">
                                {stats?.pageStats.length === 0 ? (
                                    <Card className="bg-card/30 border-dashed border-border/50 py-12">
                                        <CardContent className="flex flex-col items-center justify-center text-center space-y-2">
                                            <p className="text-muted-foreground">You haven&apos;t created any pages yet.</p>
                                            <Link href="/dashboard/projects" className="text-primary hover:underline text-sm font-medium">Create your first page</Link>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    stats?.pageStats.slice(0, 3).map((page) => (
                                        <Card key={page.id} className="bg-card/20 border-border/50 hover:bg-card/30 transition-all group">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Activity className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{page.title}</h4>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{page.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8 pr-4">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Earnings</p>
                                                        <p className="text-sm font-bold text-emerald-400 font-mono">${page.earnings}</p>
                                                    </div>
                                                    <div className="text-right hidden md:block">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Views</p>
                                                        <p className="text-sm font-bold font-mono">{page.views}</p>
                                                    </div>
                                                    <div className="text-right hidden md:block">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">CVR</p>
                                                        <p className="text-sm font-bold font-mono text-primary">{page.cvr}%</p>
                                                    </div>
                                                    <Link href={`/dashboard/builder/${page.id}`} className="p-2 hover:bg-primary/20 rounded-md transition-colors">
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Real-time Conversions Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold tracking-tight">Real-time Conversions</h3>
                                <div className="flex items-center gap-2 text-xs font-medium bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Live Updates Active
                                </div>
                            </div>
                            <RecentLeadsTable leads={recentLeads} title="" />
                        </div>
                    </div>

                    {/* Right Column: Your Earnings Feed */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Your Earnings</h3>
                        <Card className="bg-card/30 border-border/50 shadow-none h-fit overflow-hidden sticky top-8">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Yesterday</p>
                                            <p className="text-xl font-bold opacity-80">${stats?.earnings?.yesterday || '0.00'}</p>
                                        </div>
                                        <div className="space-y-1 text-right border-l-2 border-primary pl-4">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Today</p>
                                            <p className="text-xl font-bold text-emerald-400">${stats?.earnings?.today || '0.00'}</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (Number(stats?.earnings?.today) / (Number(stats?.earnings?.yesterday) || 1)) * 50)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Last Week</p>
                                            <p className="text-xl font-bold opacity-80">${stats?.earnings?.lastWeek || '0.00'}</p>
                                        </div>
                                        <div className="space-y-1 text-right border-l-2 border-indigo-500 pl-4">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">This Week</p>
                                            <p className="text-xl font-bold">${stats?.earnings?.thisWeek || '0.00'}</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${Math.min(100, (Number(stats?.earnings?.thisWeek) / (Number(stats?.earnings?.lastWeek) || 1)) * 50)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Last Month</p>
                                            <p className="text-xl font-bold opacity-80">${stats?.earnings?.lastMonth || '0.00'}</p>
                                        </div>
                                        <div className="space-y-1 text-right border-l-2 border-sky-500 pl-4">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">This Month</p>
                                            <p className="text-xl font-bold">${stats?.earnings?.thisMonth || '0.00'}</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-sky-500 rounded-full"
                                            style={{ width: `${Math.min(100, (Number(stats?.earnings?.thisMonth) / (Number(stats?.earnings?.lastMonth) || 1)) * 50)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Last Year</p>
                                            <p className="text-xl font-bold opacity-80">${stats?.earnings?.lastYear || '0.00'}</p>
                                        </div>
                                        <div className="space-y-1 text-right border-l-2 border-amber-500 pl-4">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">This Year</p>
                                            <p className="text-xl font-bold">${stats?.earnings?.thisYear || '0.00'}</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${Math.min(100, (Number(stats?.earnings?.thisYear) / (Number(stats?.earnings?.lastYear) || 1)) * 50)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border/50">
                                    <Link href="/dashboard/analytics">
                                        <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                                            View Detailed Analytics
                                        </button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
