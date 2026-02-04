'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import {
    Loader2,
    TrendingUp,
    Users,
    MousePointer2,
    DollarSign,
    ArrowUpRight,
    Eye,
    Filter,
    HelpCircle,
    Activity,
    ChevronDown
} from 'lucide-react';
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

export default function AnalyticsPage() {
    const { user: authUser, isLoading: authLoading } = db.useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: eventsData, isLoading: eventsLoading } = db.useQuery(
        authUser?.id ? {
            analytics_events: {
                $: { where: { ownerId: authUser.id } }
            }
        } : null
    );

    const { data: leadsData, isLoading: leadsLoading } = db.useQuery(
        authUser?.id ? {
            leads: {
                $: { where: { ownerId: authUser.id }, limit: 1000 },
                page: {}
            }
        } : null
    );

    const stats = useMemo(() => {
        if (!eventsData || !leadsData) return null;

        const allEvents = eventsData.analytics_events || [];
        const allLeads = leadsData.leads || [];
        const now = new Date();

        const getEarnings = (items: any[]) => items.reduce((sum: number, item: any) => sum + (item.payout || 0), 0);

        const filterByRange = (items: any[], start: Date, end?: Date) => {
            return items.filter(item => {
                const date = new Date(item.timestamp);
                return isAfter(date, start) && (end ? isBefore(date, end) : true);
            });
        };

        const sevenDaysAgo = subDays(now, 7);
        const recentEvents = allEvents.filter(e => isAfter(new Date(e.timestamp), sevenDaysAgo));
        const recentLeads = allLeads.filter(l => isAfter(new Date(l.timestamp), sevenDaysAgo));

        const totalViews = recentEvents.filter(e => e.type === 'view').length;
        const totalClicks = recentEvents.filter(e => e.type === 'click').length;
        const totalConversions = recentLeads.length;
        const totalPayout = recentLeads.reduce((sum: number, lead: any) => sum + (lead.payout || 0), 0);

        const epc = totalClicks > 0 ? totalPayout / totalClicks : 0;
        const epu = totalViews > 0 ? totalPayout / totalViews : 0;
        const cvr = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

        // Time Ranges for Earnings comparison
        const todayStart = startOfDay(now);
        const yesterdayStart = startOfDay(subDays(now, 1));
        const weekStart = startOfWeek(now);
        const lastWeekStart = startOfWeek(subDays(now, 7));
        const monthStart = startOfMonth(now);
        const lastMonthStart = startOfMonth(subDays(now, 30));
        const yearStart = startOfYear(now);
        const lastYearStart = startOfYear(subDays(now, 365));

        return {
            views: totalViews,
            clicks: totalClicks,
            conversions: totalConversions,
            payout: totalPayout.toFixed(2),
            cvr: cvr.toFixed(1),
            epc: epc.toFixed(2),
            epu: epu.toFixed(2),
            earnings: {
                today: getEarnings(filterByRange(allLeads, todayStart)).toFixed(2),
                yesterday: getEarnings(filterByRange(allLeads, yesterdayStart, todayStart)).toFixed(2),
                thisWeek: getEarnings(filterByRange(allLeads, weekStart)).toFixed(2),
                lastWeek: getEarnings(filterByRange(allLeads, lastWeekStart, weekStart)).toFixed(2),
                thisMonth: getEarnings(filterByRange(allLeads, monthStart)).toFixed(2),
                lastMonth: getEarnings(filterByRange(allLeads, lastMonthStart, monthStart)).toFixed(2),
                thisYear: getEarnings(filterByRange(allLeads, yearStart)).toFixed(2),
                lastYear: getEarnings(filterByRange(allLeads, lastYearStart, yearStart)).toFixed(2)
            }
        };
    }, [eventsData, leadsData]);

    const chartData = useMemo(() => {
        if (!eventsData || !leadsData) return [];

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const views = eventsData.analytics_events.filter((e: any) => e.timestamp.startsWith(date)).length;
            const leads = leadsData.leads.filter((l: any) => l.timestamp.startsWith(date)).length;
            return {
                name: format(new Date(date), 'MM/dd'),
                views,
                leads
            };
        });
    }, [eventsData, leadsData]);

    if (!mounted || authLoading || eventsLoading || leadsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const recentLeads = [...(leadsData?.leads || [])]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

    return (
        <TooltipProvider>
            <div className="max-w-7xl mx-auto space-y-8 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">Detailed insights into your page performance and earnings.</p>
                    </div>
                </div>

                {/* Your Overview Grid - Migrated from Dashboard */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-widest text-[10px]">
                            Your Overview
                        </h3>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                            Last 7 Days
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-xl overflow-hidden border border-border/50 bg-card/30">
                        {/* Row 1 */}
                        <div className="p-6 border-b border-r border-border/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Views</span>
                                <Tooltip>
                                    <TooltipTrigger><HelpCircle className="h-3 w-3 text-muted-foreground/50" /></TooltipTrigger>
                                    <TooltipContent>Total landing page views</TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5 text-sky-400" />
                                <span className="text-2xl font-bold">{stats?.views}</span>
                            </div>
                        </div>
                        <div className="p-6 border-b border-r border-border/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Clicks</span>
                                <Tooltip>
                                    <TooltipTrigger><HelpCircle className="h-3 w-3 text-muted-foreground/50" /></TooltipTrigger>
                                    <TooltipContent>Total offer wall clicks</TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-3">
                                <MousePointer2 className="h-5 w-5 text-indigo-400" />
                                <span className="text-2xl font-bold">{stats?.clicks}</span>
                            </div>
                        </div>
                        <div className="p-6 border-b border-r border-border/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Conversions</span>
                                <Tooltip>
                                    <TooltipTrigger><HelpCircle className="h-3 w-3 text-muted-foreground/50" /></TooltipTrigger>
                                    <TooltipContent>Successful offer completions</TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-3">
                                <Filter className="h-5 w-5 text-emerald-400" />
                                <span className="text-2xl font-bold">{stats?.conversions}</span>
                            </div>
                        </div>
                        <div className="p-6 border-b border-border/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payout</span>
                                <Tooltip>
                                    <TooltipTrigger><HelpCircle className="h-3 w-3 text-muted-foreground/50" /></TooltipTrigger>
                                    <TooltipContent>Total earnings to date</TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-5 w-5 text-amber-400" />
                                <span className="text-2xl font-bold">${stats?.payout}</span>
                            </div>
                        </div>
                        {/* Row 2 */}
                        <div className="p-6 border-r border-border/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CVR</span>
                                <Tooltip>
                                    <TooltipTrigger><HelpCircle className="h-3 w-3 text-muted-foreground/50" /></TooltipTrigger>
                                    <TooltipContent>Conversion Rate (Conversions / Clicks)</TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-rose-400" />
                                <span className="text-2xl font-bold">{stats?.cvr}%</span>
                            </div>
                        </div>
                        <div className="p-6 border-r border-border/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">EPC</span>
                                <Tooltip>
                                    <TooltipTrigger><HelpCircle className="h-3 w-3 text-muted-foreground/50" /></TooltipTrigger>
                                    <TooltipContent>Earnings Per Click</TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-violet-400" />
                                <span className="text-2xl font-bold">${stats?.epc}</span>
                            </div>
                        </div>
                        <div className="p-6 border-r border-border/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">EPU</span>
                                <Tooltip>
                                    <TooltipTrigger><HelpCircle className="h-3 w-3 text-muted-foreground/50" /></TooltipTrigger>
                                    <TooltipContent>Earnings Per Unit (Visitor)</TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-orange-400" />
                                <span className="text-2xl font-bold">${stats?.epu}</span>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                            <span className="text-xs font-semibold text-primary group-hover:underline uppercase tracking-widest">Live Export</span>
                        </div>
                    </div>
                </div>

                {/* Your Earnings Row */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-widest text-[10px]">
                        Your Earnings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-card/20 border-border/50 p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Yesterday</p>
                                    <p className="text-lg font-bold opacity-80">${stats?.earnings?.yesterday || '0.00'}</p>
                                </div>
                                <div className="space-y-1 text-right border-l-2 border-emerald-500 pl-4">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Today</p>
                                    <p className="text-lg font-bold text-emerald-400">${stats?.earnings?.today || '0.00'}</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-border/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (Number(stats?.earnings?.today) / (Number(stats?.earnings?.yesterday) || 1)) * 50)}%` }}
                                />
                            </div>
                        </Card>

                        <Card className="bg-card/20 border-border/50 p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Last Week</p>
                                    <p className="text-lg font-bold opacity-80">${stats?.earnings?.lastWeek || '0.00'}</p>
                                </div>
                                <div className="space-y-1 text-right border-l-2 border-indigo-500 pl-4">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">This Week</p>
                                    <p className="text-lg font-bold text-indigo-400">${stats?.earnings?.thisWeek || '0.00'}</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-border/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${Math.min(100, (Number(stats?.earnings?.thisWeek) / (Number(stats?.earnings?.lastWeek) || 1)) * 50)}%` }}
                                />
                            </div>
                        </Card>

                        <Card className="bg-card/20 border-border/50 p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Last Month</p>
                                    <p className="text-lg font-bold opacity-80">${stats?.earnings?.lastMonth || '0.00'}</p>
                                </div>
                                <div className="space-y-1 text-right border-l-2 border-sky-500 pl-4">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">This Month</p>
                                    <p className="text-lg font-bold text-sky-400">${stats?.earnings?.thisMonth || '0.00'}</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-border/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-sky-500 rounded-full"
                                    style={{ width: `${Math.min(100, (Number(stats?.earnings?.thisMonth) / (Number(stats?.earnings?.lastMonth) || 1)) * 50)}%` }}
                                />
                            </div>
                        </Card>

                        <Card className="bg-card/20 border-border/50 p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Last Year</p>
                                    <p className="text-lg font-bold opacity-80">${stats?.earnings?.lastYear || '0.00'}</p>
                                </div>
                                <div className="space-y-1 text-right border-l-2 border-amber-500 pl-4">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">This Year</p>
                                    <p className="text-lg font-bold text-amber-400">${stats?.earnings?.thisYear || '0.00'}</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-border/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-amber-500 rounded-full"
                                    style={{ width: `${Math.min(100, (Number(stats?.earnings?.thisYear) / (Number(stats?.earnings?.lastYear) || 1)) * 50)}%` }}
                                />
                            </div>
                        </Card>
                    </div>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>Views and leads over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                />
                                <ChartTooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="hsl(var(--primary))"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="leads"
                                    stroke="#22c55e"
                                    fillOpacity={1}
                                    fill="url(#colorLeads)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <RecentLeadsTable leads={recentLeads} title="Conversion History" />
            </div>
        </TooltipProvider>
    );
}
