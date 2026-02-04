'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Camera, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, isLoading: authLoading } = db.useAuth();
    const [loading, setLoading] = useState(false);

    // Fetch user profile data from $users entity
    const { data: userData, isLoading: profileLoading } = db.useQuery(
        user ? { $users: { $: { where: { id: user.id } } } } : null
    );

    const userProfile = userData?.$users?.[0];

    // Using local state for form fields
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');

    // Sync form state when profile data loads
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name || '');
            setAvatar(userProfile.avatar || '');
        }
    }, [userProfile]);

    if (authLoading || profileLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center py-12 text-muted-foreground">
                Please log in to view your profile.
            </div>
        );
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await db.transact(
                db.tx.$users[user.id].update({
                    name,
                    avatar
                })
            );
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your public identity and account security.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1 space-y-4">
                    <div className="relative group w-32 h-32 mx-auto md:mx-0">
                        <div className="w-full h-full rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-12 w-12 text-primary/40" />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="font-semibold text-lg">{userProfile?.name || 'Set your name'}</h2>
                        <p className="text-sm text-muted-foreground">Member since {new Date().getFullYear()}</p>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>This information will be visible to your team members.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="avatar">Avatar URL</Label>
                                    <Input
                                        id="avatar"
                                        placeholder="https://example.com/avatar.jpg"
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        className="bg-background/50"
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Profile
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Account Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Email Address</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" disabled>Change Email</Button>
                            </div>
                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                                <p className="text-xs text-primary-foreground/70 italic text-center">
                                    Your account uses Magic Code authentication. Password settings are not required.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
