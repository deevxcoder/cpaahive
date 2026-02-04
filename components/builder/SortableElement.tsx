'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { BuilderElement, useBuilderStore } from '@/store/useBuilderStore';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ElementRenderer } from './ElementRenderer';

interface SortableElementProps {
    element: BuilderElement;
}

export function SortableElement({ element }: SortableElementProps) {
    const { removeElement, selectElement, selectedElementId, pageId } = useBuilderStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: element.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const isSelected = selectedElementId === element.id;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group mb-2 rounded-md border bg-card p-4 transition-all",
                isSelected ? "border-primary ring-1 ring-primary" : "border-transparent hover:border-border",
                isDragging && "opacity-50 z-50",
            )}
            onClick={(e) => {
                e.stopPropagation();
                selectElement(element.id);
            }}
        >
            <div className={cn(
                "absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 z-10",
                isSelected && "opacity-100"
            )}>
                <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-muted rounded">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeElement(element.id);
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="min-h-[20px]">
                <ElementRenderer element={element} pageId={pageId || undefined} />
            </div>
        </div>
    );
}
