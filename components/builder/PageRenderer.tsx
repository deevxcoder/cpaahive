'use client';

import { ElementRenderer } from './ElementRenderer';
import { BuilderElement } from '@/store/useBuilderStore';

export function PageRenderer({ elements }: { elements: BuilderElement[] }) {
    if (!elements || elements.length === 0) {
        return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Empty Page</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            {elements.map((element) => (
                <div key={element.id}>
                    <ElementRenderer element={element} />
                </div>
            ))}
        </div>
    );
}
