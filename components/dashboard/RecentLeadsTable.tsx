'use client';

import { formatDistanceToNow } from 'date-fns';
import { DollarSign, Globe, Smartphone, Monitor, Laptop } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Lead {
    id: string;
    pageId: string;
    offerId?: string;
    payout?: number;
    country?: string;
    device?: string;
    timestamp: string;
    page?: {
        title: string;
    };
}

interface RecentLeadsTableProps {
    leads: Lead[];
    title?: string;
}

export function RecentLeadsTable({ leads, title = "Recent Leads" }: RecentLeadsTableProps) {
    const getDeviceIcon = (device?: string) => {
        const d = device?.toLowerCase();
        if (d?.includes('mobile') || d?.includes('iphone') || d?.includes('android')) return <Smartphone className="h-4 w-4" />;
        if (d?.includes('tablet') || d?.includes('ipad')) return <Laptop className="h-4 w-4" />;
        return <Monitor className="h-4 w-4" />;
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase border-b border-border/50">
                            <tr>
                                <th className="px-4 py-3 font-medium">Page</th>
                                <th className="px-4 py-3 font-medium">Offer</th>
                                <th className="px-4 py-3 font-medium">Payout</th>
                                <th className="px-4 py-3 font-medium">Location</th>
                                <th className="px-4 py-3 font-medium">Device</th>
                                <th className="px-4 py-3 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No leads recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-foreground truncate max-w-[150px]">
                                                {lead.page?.title || 'Unknown Page'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs bg-secondary/50 px-2 py-1 rounded text-muted-foreground">
                                                ID: {lead.offerId || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center text-green-500 font-bold">
                                                <DollarSign className="h-3 w-3 mr-0.5" />
                                                {(lead.payout || 0).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-3 w-3 text-muted-foreground" />
                                                <span className="uppercase">{lead.country || '??'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-muted-foreground" title={lead.device}>
                                                {getDeviceIcon(lead.device)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right text-muted-foreground text-xs whitespace-nowrap">
                                            {formatDistanceToNow(new Date(lead.timestamp), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
