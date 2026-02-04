'use client';

import { ElementRenderer } from '@/components/builder/ElementRenderer';
import { BuilderElement } from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

interface PageViewerProps {
    page: {
        id: string;
        title: string;
        elements: BuilderElement[];
        headScripts?: string;
        bodyScripts?: string;
    };
}

export function PageViewer({ page }: PageViewerProps) {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden">
            {/* Inject Head Scripts (simplified for client-rendering) */}
            {page.headScripts && (
                <div
                    style={{ display: 'none' }}
                    dangerouslySetInnerHTML={{ __html: page.headScripts }}
                />
            )}

            <AnalyticsTracker pageId={page.id} />
            <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    {page.elements.map((element) => (
                        <div key={element.id} className="relative">
                            <ElementRenderer element={element} pageId={page.id} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Branding Footer */}
            <div className="mt-12 py-6 text-center text-sm text-muted-foreground border-t border-border/40">
                Powered by <span className="font-semibold text-primary">CPAHive</span>
            </div>

            {/* Inject Body Scripts */}
            {page.bodyScripts && (
                <div
                    style={{ display: 'none' }}
                    dangerouslySetInnerHTML={{ __html: page.bodyScripts }}
                />
            )}
        </div>
    );
}
