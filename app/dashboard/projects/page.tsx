'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, MoreVertical, Edit, Globe, Loader2, Trash2, Layout, Lock, Copy } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { id } from "@instantdb/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function ProjectsPage() {
    const { user } = db.useAuth();
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [projectType, setProjectType] = useState<'landing' | 'locker'>('landing');
    const [isCreating, setIsCreating] = useState(false);

    const { data, isLoading, error } = db.useQuery(
        user ? {
            pages: {
                $: {
                    where: { 'owner.id': user.id },
                    order: { createdAt: 'desc' }
                }
            }
        } : null
    );

    const handleCreateProject = async () => {
        if (!user) return;
        if (!newProjectTitle.trim()) {
            toast.error("Please enter a project name");
            return;
        }

        setIsCreating(true);
        const newPageId = id();
        const slug = `p-${newPageId.slice(0, 8)}`; // Temporary slug

        try {
            await db.transact(
                db.tx.pages[newPageId]
                    .update({
                        title: newProjectTitle,
                        slug,
                        type: projectType,
                        elements: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        published: false,
                    })
                    .link({ owner: user.id })
            );

            toast.success("Project created!");
            setIsCreateOpen(false);
            setNewProjectTitle("");
            router.push(`/builder/${newPageId}`);
        } catch (err) {
            console.error("Failed to create project:", err);
            toast.error("Failed to create project");
        } finally {
            setIsCreating(false);
        }
    };

    const handleCloneProject = async (project: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newPageId = id();
        const slug = `p-${newPageId.slice(0, 8)}`;

        try {
            await db.transact(
                db.tx.pages[newPageId]
                    .update({
                        ...project,
                        id: newPageId,
                        title: `${project.title} (Copy)`,
                        slug,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        published: false,
                    })
                    .link({ owner: user?.id })
            );
            toast.success("Project cloned!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to clone project");
        }
    };

    const handleDeleteProject = async (pageId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await db.transact(db.tx.pages[pageId].delete());
            toast.success("Project deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete project");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const projects = data?.pages || [];

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">Manage your landing pages and offer walls</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                            <DialogDescription>
                                Choose the type of project you want to build.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Roblox Generator V2"
                                    value={newProjectTitle}
                                    onChange={(e) => setNewProjectTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={`cursor-pointer rounded-xl border-2 p-4 hover:border-primary/50 transition-all ${projectType === 'landing' ? 'border-primary bg-primary/5' : 'border-muted bg-card'}`}
                                    onClick={() => setProjectType('landing')}
                                >
                                    <div className="mb-2 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold">Landing Page</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Full-page promotional content with CTAs and rich media.
                                    </p>
                                </div>

                                <div
                                    className={`cursor-pointer rounded-xl border-2 p-4 hover:border-primary/50 transition-all ${projectType === 'locker' ? 'border-primary bg-primary/5' : 'border-muted bg-card'}`}
                                    onClick={() => setProjectType('locker')}
                                >
                                    <div className="mb-2 h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                                        <Lock className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold">CPA Locker</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Content locker overlay or offer wall to monetize traffic.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateProject} disabled={isCreating || !newProjectTitle}>
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Project
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border rounded-lg bg-card/20">
                    <h3 className="text-lg font-medium">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first landing page to get started.</p>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline">Create Project</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project: any) => (
                        <Card key={project.id} className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                            <div className="aspect-video w-full bg-muted relative">
                                {project.thumbnail ? (
                                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                        {project.type === 'locker' ? <Lock className="h-12 w-12" /> : <Globe className="h-12 w-12" />}
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/50 backdrop-blur text-xs font-medium border border-white/10">
                                    {project.type === 'locker' ? 'Locker' : 'Landing Page'}
                                </div>
                            </div>
                            <CardHeader className="p-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg truncate pr-2">{project.title}</CardTitle>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {project.published && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/p/${project.slug}`} target="_blank">View Live Page</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={(e) => handleCloneProject(project, e)}>
                                                <Copy className="mr-2 h-4 w-4" /> Clone Project
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={(e) => handleDeleteProject(project.id, e)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                                </p>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0">
                                <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                                    <Link href={`/builder/${project.id}`}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit Builder
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
