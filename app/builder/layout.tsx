import { AuthGuard } from '@/components/auth/AuthGuard';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="h-full min-h-screen bg-background">
                {children}
            </div>
        </AuthGuard>
    );
}
