'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { Loader2 } from 'lucide-react';

import { arrayMove } from '@dnd-kit/sortable';

export default function BuilderPage() {
    const params = useParams();
    const pageId = params.pageId as string;
    const { elements, setPageId, setElements, setMetadata, addElement, insertElementAt } = useBuilderStore();

    const [activeSidebarItem, setActiveSidebarItem] = useState<any>(null);

    // Fetch Page Data
    const { data, isLoading } = db.useQuery({
        pages: {
            $: {
                where: { id: pageId }
            }
        }
    });

    useEffect(() => {
        if (pageId) {
            setPageId(pageId);
        }
    }, [pageId, setPageId]);

    // Populate Store on Data Load
    useEffect(() => {
        if (data?.pages && data.pages.length > 0) {
            const page = data.pages[0];
            // Ensure elements is an array
            const loadedElements = Array.isArray(page.elements) ? page.elements : [];
            setElements(loadedElements as any); // Cast if needed, or validate

            setMetadata({
                title: page.title,
                slug: page.slug,
                published: page.published,
                type: page.type || 'landing',
            });
        }
    }, [data, setElements, setMetadata]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.isSidebar) {
            setActiveSidebarItem(event.active.data.current);
        }
    };

    // Recursive helper to find node and its parent
    const findNodePath = (nodes: any[], id: string, parent: any = null): { node: any, parent: any } | null => {
        for (const node of nodes) {
            if (node.id === id) return { node, parent };
            if (node.children) {
                const childResult = findNodePath(node.children, id, node);
                if (childResult) return childResult;
            }
        }
        return null;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveSidebarItem(null);

        if (!over) return;

        // Handle Drop from Sidebar to Canvas
        if (active.data.current?.isSidebar) {
            const type = active.data.current.type;
            const newElement: any = {
                id: uuidv4(),
                type,
                content: {},
                styles: {},
                children: [],
            };

            // Check if dropping on canvas (empty area)
            if (over.id === 'canvas') {
                // Add to end
                addElement(newElement);
                return;
            }

            // Find which element is being hovered
            const elementIndex = elements.findIndex(e => e.id === over.id);
            if (elementIndex !== -1) {
                // Get element position and cursor position
                const elementRect = document.querySelector(`[data-element-id="${over.id}"]`)?.getBoundingClientRect();
                const pointerY = (event.activatorEvent as MouseEvent)?.clientY || 0;

                if (elementRect) {
                    const middleY = elementRect.top + elementRect.height / 2;
                    // Insert above or below based on cursor position
                    const insertIndex = pointerY < middleY ? elementIndex : elementIndex + 1;
                    insertElementAt(newElement, insertIndex);
                } else {
                    // Fallback: insert after hovered element
                    insertElementAt(newElement, elementIndex + 1);
                }
                return;
            }

            // Handle Row drops
            let parentId = undefined;
            const found = findNodePath(elements, String(over.id));
            if (found) {
                if (found.node.type === 'Row') {
                    parentId = found.node.id;
                } else if (found.parent) {
                    parentId = found.parent.id;
                }
            }
            addElement(newElement, parentId);

        } else {

            // Handle Reordering (Root Level Only for V1)
            // TODO: Implement nested reordering using dnd-kit SortableContext strategies
            if (active.id !== over.id) {
                const oldIndex = elements.findIndex((e) => e.id === active.id);
                const newIndex = elements.findIndex((e) => e.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    setElements(arrayMove(elements, oldIndex, newIndex));
                }
            }
        }
    };

    if (isLoading) {

        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen">
                <BuilderHeader />
                <div className="flex flex-1 overflow-hidden">
                    <BuilderSidebar />
                    <div className="flex-1 bg-muted/30 p-8 overflow-y-auto w-full relative">
                        <div className="max-w-4xl mx-auto h-full pb-20">
                            <Canvas />
                        </div>
                    </div>
                    <PropertiesPanel />
                </div>

                <DragOverlay>
                    {activeSidebarItem ? (
                        <div className="flex items-center justify-center p-4 border border-border bg-card rounded-lg shadow-xl opacity-80 w-[150px]">
                            <span className="font-medium">{activeSidebarItem.type}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}
