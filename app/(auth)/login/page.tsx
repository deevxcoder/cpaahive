'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { user, isLoading } = db.useAuth();

    useEffect(() => {
        if (!isLoading && user) {
            router.push('/dashboard');
        }
    }, [isLoading, user, router]);

    if (isLoading || user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await db.auth.sendMagicCode({ email });
            setStep('code');
        } catch (err: any) {
            setError(err.body?.message || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await db.auth.signInWithMagicCode({ email, code });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.body?.message || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        {step === 'email' ? 'Welcome back' : 'Check your email'}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {step === 'email'
                            ? 'Enter your email to sign in to your account'
                            : `We sent a temporary login code to ${email}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={step === 'email' ? handleSendCode : handleVerifyCode} className="space-y-4">
                        {step === 'email' ? (
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-9 bg-background/50 border-input focus:border-primary/50"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="code">Verification Code</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="123456"
                                        className="pl-9 bg-background/50 border-input focus:border-primary/50 tracking-widest"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        disabled={loading}
                                        autoComplete="one-time-code"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {step === 'email' ? 'Sign In with Email' : 'Verify Code'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    {step === 'code' && (
                        <Button
                            variant="link"
                            className="text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setStep('email');
                                setError('');
                                setCode('');
                            }}
                            disabled={loading}
                        >
                            Use a different email
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
