'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Key, User, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user: authUser, isLoading: authLoading } = db.useAuth();
    const { data: userData, isLoading: queryLoading } = db.useQuery(
        authUser?.id ? {
            $users: {
                $: { where: { id: authUser.id } }
            }
        } : null
    );

    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const [apiKey, setApiKey] = useState('');
    const [userId, setUserId] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [initialized, setInitialized] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initial mount check
    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync state with user data when loaded
    useEffect(() => {
        const user = userData?.$users?.[0];
        if (user && !initialized) {
            setApiKey(user.ogadsApiKey || '');
            setUserId(user.ogadsUserId || '');
            setEndpoint(user.ogadsEndpoint || '');
            setInitialized(true);
        }
    }, [userData, initialized]);

    // Show skeleton or loader while initial auth is happening
    if (!mounted || ((authLoading || queryLoading) && !initialized)) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await db.transact(
                db.tx.$users[authUser!.id].update({
                    ogadsApiKey: apiKey,
                    ogadsUserId: userId,
                    ogadsEndpoint: endpoint,
                })
            );
            toast.success('Monetization settings updated!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const postbackUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/postback?user_id=${authUser?.id}&payout={payout}&offer_id={offer_id}`
        : '';

    const copyPostback = () => {
        navigator.clipboard.writeText(postbackUrl);
        setCopied(true);
        toast.info('Postback URL copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your monetization and platform preferences.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            OGAds API Configuration
                        </CardTitle>
                        <CardDescription>
                            Connect your OGAds account to pull live offers into your landing pages.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="api_key">API Key</Label>
                                <Input
                                    id="api_key"
                                    placeholder="Enter your OGAds API Key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_id">Account ID (UID)</Label>
                                <Input
                                    id="user_id"
                                    placeholder="Enter your OGAds User ID"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endpoint">API Endpoint</Label>
                                <Input
                                    id="endpoint"
                                    placeholder="e.g., https://ipostback.com/api.php"
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                    className="bg-background/50"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Default: https://ipostback.com/api.php
                                </p>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save API Settings
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ExternalLink className="h-5 w-5 text-primary" />
                            Global Postback URL
                        </CardTitle>
                        <CardDescription>
                            Use this URL in your OGAds dashboard to track conversions automatically.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-black/40 border border-border overflow-x-auto text-xs text-primary font-mono select-all">
                                {postbackUrl}
                            </pre>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-2 h-8 w-8 hover:bg-primary/20"
                                onClick={copyPostback}
                            >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                            <p className="text-sm text-primary-foreground/80 leading-relaxed">
                                <strong>Instructions:</strong> Paste this URL into the "Postback" section of your OGAds account settings.
                                Ensure you include the placeholders exactly as shown so we can attribute payouts correctly.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
