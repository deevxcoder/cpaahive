'use client';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Save, Eye, ChevronLeft, Loader2, Globe, Lock, Smartphone, Tablet, Monitor, Settings, Undo2, Redo2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BuilderHeader() {
    const { elements, pageId, metadata, setMetadata, viewMode, setViewMode, undo, redo, past, future } = useBuilderStore();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // Local state for settings form
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        ogImage: '',
        customDomain: '',
        headScripts: '',
        bodyScripts: ''
    });

    const handleOpenSettings = () => {
        if (metadata) {
            setFormData({
                title: metadata.title || '',
                slug: metadata.slug || '',
                description: metadata.description || '',
                ogImage: metadata.ogImage || '',
                customDomain: metadata.customDomain || '',
                headScripts: metadata.headScripts || '',
                bodyScripts: metadata.bodyScripts || ''
            });
            setSettingsOpen(true);
        }
    };

    const handleSaveSettings = async () => {
        if (!pageId) return;
        try {
            await db.transact(
                db.tx.pages[pageId].update({
                    ...formData,
                    updatedAt: new Date().toISOString(),
                })
            );
            // Non-null assertion is safe here as metadata exists if we opened settings
            setMetadata({ ...metadata!, ...formData });
            toast.success('Page settings updated');
            setSettingsOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        }
    };

    const handleSave = async () => {
        if (!pageId) return;
        setSaving(true);
        try {
            await db.transact(
                db.tx.pages[pageId].update({
                    elements,
                    updatedAt: new Date().toISOString(),
                })
            );
            toast.success('Page saved successfully');
        } catch (error) {
            console.error('Failed to save:', error);
            toast.error('Failed to save page');
        } finally {
            setSaving(false);
        }
    };

    const handlePublishToggle = async () => {
        if (!pageId || !metadata) return;
        setPublishing(true);
        // Toggle the current status
        const newStatus = !metadata.published;

        try {
            await db.transact(
                db.tx.pages[pageId].update({
                    published: newStatus,
                    updatedAt: new Date().toISOString(),
                })
            );
            // Optimistically update store
            setMetadata({ ...metadata, published: newStatus });

            if (newStatus) {
                toast.success('Project lives! Page is now public.');
            } else {
                toast.info('Project unpublished. Page is now offline.');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update publishing status');
        } finally {
            setPublishing(false);
        }
    }

    const handlePreview = () => {
        const slug = metadata?.slug;
        if (slug) {
            window.open(`/p/${slug}`, '_blank');
        } else {
            toast.error('Page slug not found. Try saving first.');
        }
    };

    return (
        <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center space-x-4 w-1/3">
                <Link href="/dashboard/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-semibold text-sm">{metadata?.title || 'Editing Page'}</h1>
                        {metadata?.type === 'locker' && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                        {metadata?.published ? (
                            <span className="text-green-500 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Live
                            </span>
                        ) : 'Draft'}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center w-1/3">
                <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && setViewMode(val as any)}>
                    <ToggleGroupItem value="mobile" aria-label="Mobile View">
                        <Smartphone className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="tablet" aria-label="Tablet View">
                        <Tablet className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="desktop" aria-label="Desktop View">
                        <Monitor className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>

                <div className="h-4 w-px bg-border mx-2"></div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={past.length === 0}
                        onClick={undo}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={future.length === 0}
                        onClick={redo}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-2 w-1/3">
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleOpenSettings}>
                            <Settings className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Page Settings</DialogTitle>
                            <DialogDescription>
                                Configure SEO and general page settings.
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="scripts">Scripts</TabsTrigger>
                            </TabsList>
                            <TabsContent value="general" className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Page Title</Label>
                                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL Slug</Label>
                                    <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Custom Domain</Label>
                                    <Input
                                        placeholder="e.g. yourdomain.com"
                                        value={formData.customDomain}
                                        onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        Point your domain's CNAME record to <code className="bg-muted px-1 py-0.5 rounded">cpahive.com</code>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>SEO Description</Label>
                                    <Textarea value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Social Image URL</Label>
                                    <Input value={formData.ogImage} onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })} placeholder="https://..." />
                                </div>
                            </TabsContent>
                            <TabsContent value="scripts" className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Head Scripts / HTML</Label>
                                    <Textarea
                                        placeholder="<script>... analytics ...</script>"
                                        className="font-mono text-xs min-h-[120px]"
                                        value={formData.headScripts}
                                        onChange={(e: any) => setFormData({ ...formData, headScripts: e.target.value })}
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Injected before the closing &lt;/head&gt; tag.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Body Scripts / HTML</Label>
                                    <Textarea
                                        placeholder="<script>... tracking ...</script>"
                                        className="font-mono text-xs min-h-[120px]"
                                        value={formData.bodyScripts}
                                        onChange={(e: any) => setFormData({ ...formData, bodyScripts: e.target.value })}
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Injected before the closing &lt;/body&gt; tag.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                        <DialogFooter>
                            <Button onClick={handleSaveSettings}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                </Button>

                <Button
                    variant={metadata?.published ? "secondary" : "default"}
                    size="sm"
                    onClick={handlePublishToggle}
                    disabled={publishing}
                    className={metadata?.published ? "" : "bg-green-600 hover:bg-green-700"}
                >
                    {publishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
                    {metadata?.published ? 'Unpublish' : 'Publish Live'}
                </Button>

                <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                </Button>
            </div>
        </div>
    );
}
