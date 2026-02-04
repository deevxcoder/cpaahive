import { Sidebar } from '@/components/dashboard/Sidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="h-full relative min-h-screen bg-background">
                <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
                    <Sidebar />
                </div>
                <main className="md:pl-72">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
