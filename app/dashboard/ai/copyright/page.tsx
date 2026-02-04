'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Sparkles,
    Copy,
    History,
    Wand2,
    Loader2,
    Check,
    Trash2,
    Type,
    Layout,
    Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { id } from '@instantdb/react';
import { cn } from '@/lib/utils';

interface AIContent {
    id: string;
    ownerId: string;
    type: string;
    prompt: string;
    result: string;
    category?: string;
    createdAt: string;
}

export default function CopyrightAIPage() {
    const { user: authUser, isLoading: authLoading } = db.useAuth();
    const [mounted, setMounted] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [category, setCategory] = useState<'landing' | 'locker'>('landing');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState('');
    const [savedResults, setSavedResults] = useState<AIContent[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: aiData, isLoading: aiLoading } = db.useQuery(
        authUser?.id ? {
            ai_contents: {
                $: {
                    where: { ownerId: authUser.id, type: 'copy' },
                    order: { serverCreatedAt: 'desc' }
                }
            }
        } : null
    );

    useEffect(() => {
        if (aiData?.ai_contents) {
            setSavedResults(aiData.ai_contents);
        }
    }, [aiData]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error('Please enter a topic or keywords');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate-copy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, category })
            });

            if (!response.ok) throw new Error('Failed to generate copy');

            const data = await response.json();
            setResult(data.result);

            // Save to DB
            await db.transact([
                db.tx.ai_contents[id()].update({
                    ownerId: authUser!.id,
                    type: 'copy',
                    prompt,
                    result: data.result,
                    category,
                    createdAt: new Date().toISOString()
                })
            ]);

            toast.success('Copy generated successfully!');
        } catch (error) {
            console.error('Generation error:', error);
            toast.error('Failed to generate copy. Make sure GEMINI_API_KEY is set.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const handleDelete = async (itemId: string) => {
        try {
            await db.transact([db.tx.ai_contents[itemId].delete()]);
            toast.success('Deleted successfully');
        } catch {
            toast.error('Failed to delete');
        }
    };

    if (!mounted || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Copyright AI</h1>
                <p className="text-muted-foreground">Generate high-converting copy for your landing pages and lockers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generator Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Wand2 className="h-4 w-4 text-primary" />
                                Generate New Copy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
                                    What are you promoting?
                                </label>
                                <Textarea
                                    placeholder="e.g. A free ebook on passive income, a gaming skin generator, etc."
                                    className="min-h-[120px] bg-background/50 border-border/40 focus:border-primary/50 transition-colors"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setCategory('landing')}
                                    className={cn(
                                        "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all h-20",
                                        category === 'landing'
                                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                                            : "bg-background/20 border-border/40 text-muted-foreground hover:border-border/80"
                                    )}
                                >
                                    <Layout className="h-5 w-5" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Landing Page</p>
                                        <p className="text-[10px] opacity-60">Headers & content</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setCategory('locker')}
                                    className={cn(
                                        "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all h-20",
                                        category === 'locker'
                                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                                            : "bg-background/20 border-border/40 text-muted-foreground hover:border-border/80"
                                    )}
                                >
                                    <Lock className="h-5 w-5" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Locker Page</p>
                                        <p className="text-[10px] opacity-60">Instructions & CTA</p>
                                    </div>
                                </button>
                            </div>

                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 group relative overflow-hidden"
                                disabled={isGenerating}
                                onClick={handleGenerate}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                                        Generate Magic Copy
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]" />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {result && (
                        <Card className="border-primary/20 bg-primary/5 border animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    Generated Result
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-primary/10"
                                    onClick={() => copyToClipboard(result)}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-background/50 rounded-lg border border-border/40 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                                    {result}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* History Section */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-card/30 h-[calc(100vh-250px)]">
                        <CardHeader className="sticky top-0 bg-card/30 backdrop-blur-md z-10 border-b border-border/40">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                Recent Creations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto h-full">
                            {aiLoading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/50" />
                                </div>
                            ) : savedResults.length === 0 ? (
                                <div className="p-8 text-center space-y-2">
                                    <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/20" />
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">No history yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/30">
                                    {savedResults.map((item) => (
                                        <div key={item.id} className="p-4 space-y-3 group hover:bg-primary/5 transition-colors">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1 overflow-hidden">
                                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60 truncate">
                                                        {item.category === 'landing' ? 'Landing Page' : 'Locker Page'} • {item.prompt}
                                                    </p>
                                                    <p className="text-xs line-clamp-2 text-foreground/80 font-medium italic">
                                                        "{item.result}"
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0"
                                                        onClick={() => {
                                                            setResult(item.result);
                                                            setPrompt(item.prompt);
                                                            if (item.category === 'landing' || item.category === 'locker') {
                                                                setCategory(item.category as 'landing' | 'locker');
                                                            }
                                                        }}
                                                    >
                                                        <Wand2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 hover:text-destructive"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

