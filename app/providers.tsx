'use client';

import { ReactNode } from 'react';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="top-center" richColors />
        </ThemeProvider>
    );
}
