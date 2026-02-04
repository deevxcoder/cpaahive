'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Image as ImageIcon,
    Sparkles,
    Download,
    History,
    Loader2,
    Trash2,
    Maximize2,
    Palette,
    Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { id } from '@instantdb/react';
import Image from 'next/image';

interface AIContent {
    id: string;
    ownerId: string;
    type: string;
    prompt: string;
    result: string;
    category?: string;
    createdAt: string;
}

export default function ImageGenPage() {
    const { user: authUser, isLoading: authLoading } = db.useAuth();
    const [mounted, setMounted] = useState(false);
    const [prompt, setPrompt] = useState('');
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
                    where: { ownerId: authUser.id, type: 'image' },
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
            toast.error('Please enter a description for the image');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error('Failed to generate image');

            const data = await response.json();
            setResult(data.imageUrl);

            // Save to DB
            await db.transact([
                db.tx.ai_contents[id()].update({
                    ownerId: authUser!.id,
                    type: 'image',
                    prompt,
                    result: data.imageUrl,
                    createdAt: new Date().toISOString()
                })
            ]);

            toast.success('Image generated and saved!');
        } catch (error) {
            console.error('Generation error:', error);
            toast.error('Failed to generate image. Hub AI key might be missing.');
        } finally {
            setIsGenerating(false);
        }
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
                <h1 className="text-3xl font-bold tracking-tight">Image Generator</h1>
                <p className="text-muted-foreground">Create premium visual assets for your landing pages using AI.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generator Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden border-t-4 border-t-emerald-500/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Palette className="h-4 w-4 text-emerald-400" />
                                Create Asset
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">
                                    Describe your vision
                                </label>
                                <div className="relative group">
                                    <Input
                                        placeholder="e.g. Futuristic gaming background, blue and neon purple, high detail..."
                                        className="bg-background/50 border-border/40 focus:border-emerald-500/50 h-14 pr-12 transition-all"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                    />
                                    <Zap className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                            </div>

                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-7 group relative overflow-hidden"
                                disabled={isGenerating}
                                onClick={handleGenerate}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Painting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5 group-hover:scale-125 transition-transform" />
                                        Generate Visual
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {result && (
                        <div className="relative group animate-in zoom-in-95 duration-500 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={result}
                                alt="Generated result"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Generated Result</p>
                                    <p className="text-white font-medium line-clamp-1">{prompt}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="secondary" className="bg-emerald-500 hover:bg-emerald-400 text-white h-10 w-10">
                                        <Download className="h-5 w-5" />
                                    </Button>
                                    <Button size="icon" variant="secondary" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white h-10 w-10 border border-white/20">
                                        <Maximize2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* History Section */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-card/30 h-[calc(100vh-250px)]">
                        <CardHeader className="sticky top-0 bg-card/30 backdrop-blur-md z-10 border-b border-border/40">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                Image Vault
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 overflow-y-auto h-full">
                            {aiLoading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/50" />
                                </div>
                            ) : savedResults.length === 0 ? (
                                <div className="p-8 text-center space-y-4">
                                    <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/10" />
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-30">Your vault is empty</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {savedResults.map((item) => (
                                        <div key={item.id} className="relative group rounded-xl overflow-hidden border border-border/40 hover:border-emerald-500/40 transition-all shadow-lg hover:shadow-emerald-500/5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.result}
                                                alt={item.prompt}
                                                className="w-full aspect-square object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                                <p className="text-[9px] text-white font-medium line-clamp-2 mb-2">
                                                    {item.prompt}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-[10px] bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 hover:text-emerald-300"
                                                        onClick={() => setResult(item.result)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-[10px] bg-red-500/20 hover:bg-red-500/40 text-red-500 hover:text-red-400"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        Delete
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

