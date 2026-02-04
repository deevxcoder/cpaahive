'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableElement } from './SortableElement';
import { useState, useRef } from 'react';

export function Canvas() {
    const { elements, selectElement, viewMode } = useBuilderStore();
    const [isDragging, setIsDragging] = useState(false);
    const [dropPosition, setDropPosition] = useState<{ index: number; position: 'above' | 'below' } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas',
    });

    // Monitor drag events
    useDndMonitor({
        onDragStart: (event) => {
            if (event.active.data.current?.isSidebar) {
                setIsDragging(true);
            }
        },
        onDragOver: (event) => {
            if (!event.active.data.current?.isSidebar) return;

            const overId = event.over?.id;
            if (!overId || overId === 'canvas') {
                // Dropping on empty canvas or at the end
                setDropPosition({ index: elements.length, position: 'below' });
                return;
            }

            // Find which element is being hovered
            const elementIndex = elements.findIndex(e => e.id === overId);
            if (elementIndex !== -1) {
                // Get mouse position relative to the element
                const elementRect = document.querySelector(`[data-element-id="${overId}"]`)?.getBoundingClientRect();
                const pointerY = (event.activatorEvent as MouseEvent)?.clientY || 0;

                if (elementRect) {
                    const middleY = elementRect.top + elementRect.height / 2;
                    // Determine if dropping above or below based on cursor position
                    if (pointerY < middleY) {
                        setDropPosition({ index: elementIndex, position: 'above' });
                    } else {
                        setDropPosition({ index: elementIndex, position: 'below' });
                    }
                } else {
                    setDropPosition({ index: elementIndex, position: 'below' });
                }
            }
        },
        onDragEnd: () => {
            setIsDragging(false);
            setDropPosition(null);
        },
        onDragCancel: () => {
            setIsDragging(false);
            setDropPosition(null);
        },
    });

    const getWidthClass = () => {
        switch (viewMode) {
            case 'mobile': return 'max-w-[375px]';
            case 'tablet': return 'max-w-[768px]';
            default: return 'max-w-full';
        }
    };

    // Drop indicator component
    const DropIndicator = () => (
        <div className="h-1 bg-primary rounded-full mx-2 my-1 animate-pulse shadow-lg shadow-primary/30" />
    );

    return (
        <div className={`h-full w-full flex justify-center transition-all duration-300 ease-in-out`}>
            <div
                ref={setNodeRef}
                onClick={() => selectElement(null)}
                className={cn(
                    "h-full w-full bg-background border-2 border-dashed border-border rounded-xl p-8 shadow-sm transition-all duration-300 cursor-default mx-auto",
                    getWidthClass(),
                    isOver && isDragging ? "border-primary/50 bg-primary/5" : "hover:border-primary/20",
                    elements.length > 0 ? "border-transparent bg-muted/10" : ""
                )}
            >
                {elements.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 pt-32 pointer-events-none">
                        {isDragging ? (
                            <div className="p-8 border-2 border-dashed border-primary rounded-xl bg-primary/5">
                                <p className="text-primary font-medium">Drop here to add element</p>
                            </div>
                        ) : (
                            <p>Drag and drop elements here to start building</p>
                        )}
                    </div>
                ) : (
                    <SortableContext items={elements.map(e => e.id)} strategy={verticalListSortingStrategy}>
                        <div ref={containerRef} className="space-y-2 pb-32">
                            {elements.map((element, index) => (
                                <div key={element.id} data-element-id={element.id}>
                                    {/* Drop indicator above this element */}
                                    {isDragging && dropPosition?.index === index && dropPosition.position === 'above' && (
                                        <DropIndicator />
                                    )}

                                    <SortableElement element={element} />

                                    {/* Drop indicator below this element (only for last element) */}
                                    {isDragging && dropPosition?.index === index && dropPosition.position === 'below' && (
                                        <DropIndicator />
                                    )}
                                </div>
                            ))}

                            {/* Drop indicator at the very end */}
                            {isDragging && dropPosition?.index === elements.length && (
                                <DropIndicator />
                            )}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    );
}
