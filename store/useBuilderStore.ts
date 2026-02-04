import { create } from 'zustand';

export type BuilderElement = {
    id: string;
    type: string;
    content: any;
    styles?: any;
    children?: BuilderElement[]; // Recursive nesting
};

interface PageMetadata {
    title: string;
    slug: string;
    published: boolean;
    type: string;
    description?: string;
    ogImage?: string;
    customDomain?: string;
    headScripts?: string;
    bodyScripts?: string;
}

interface BuilderState {
    pageId: string | null;
    elements: BuilderElement[];
    past: BuilderElement[][];
    future: BuilderElement[][];
    selectedElementId: string | null;
    metadata: PageMetadata | null;
    viewMode: 'desktop' | 'tablet' | 'mobile';
    setPageId: (id: string) => void;
    setElements: (elements: BuilderElement[]) => void;
    setMetadata: (metadata: PageMetadata) => void;
    setViewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
    addElement: (element: BuilderElement, parentId?: string) => void;
    insertElementAt: (element: BuilderElement, index: number) => void;
    updateElement: (id: string, updates: Partial<BuilderElement>) => void;
    removeElement: (id: string) => void;
    selectElement: (id: string | null) => void;
    undo: () => void;
    redo: () => void;
}

// Helper to find and update a node in the tree
const updateNode = (nodes: BuilderElement[], id: string, updates: Partial<BuilderElement>): BuilderElement[] => {
    return nodes.map(node => {
        if (node.id === id) {
            return { ...node, ...updates };
        }
        if (node.children) {
            return { ...node, children: updateNode(node.children, id, updates) };
        }
        return node;
    });
};

// Helper to find and remove a node
const removeNode = (nodes: BuilderElement[], id: string): BuilderElement[] => {
    return nodes
        .filter(node => node.id !== id)
        .map(node => ({
            ...node,
            children: node.children ? removeNode(node.children, id) : undefined
        }));
};

// Helper to add a node to a specific parent
const addNode = (nodes: BuilderElement[], parentId: string | null | undefined, newElement: BuilderElement): BuilderElement[] => {
    if (!parentId) {
        return [...nodes, newElement];
    }
    return nodes.map(node => {
        if (node.id === parentId) {
            return { ...node, children: [...(node.children || []), newElement] };
        }
        if (node.children) {
            return { ...node, children: addNode(node.children, parentId, newElement) };
        }
        return node;
    });
};

export const useBuilderStore = create<BuilderState>((set) => ({
    pageId: null,
    elements: [],
    past: [],
    future: [],
    selectedElementId: null,
    metadata: null,
    viewMode: 'desktop',
    setPageId: (pageId) => set({ pageId }),
    setElements: (elements) => set({ elements }), // Initial load, don't push to history
    setMetadata: (metadata) => set({ metadata }),
    setViewMode: (viewMode) => set({ viewMode }),
    addElement: (element, parentId) => set((state) => {
        const newElements = addNode(state.elements, parentId, element);
        return {
            past: [...state.past, state.elements],
            elements: newElements,
            future: []
        };
    }),
    insertElementAt: (element, index) => set((state) => {
        const newElements = [...state.elements];
        newElements.splice(index, 0, element);
        return {
            past: [...state.past, state.elements],
            elements: newElements,
            future: []
        };
    }),
    updateElement: (id, updates) =>
        set((state) => {
            const newElements = updateNode(state.elements, id, updates);
            return {
                past: [...state.past, state.elements],
                elements: newElements,
                future: []
            };
        }),
    removeElement: (id) =>
        set((state) => {
            const newElements = removeNode(state.elements, id);
            return {
                past: [...state.past, state.elements],
                selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
                elements: newElements,
                future: []
            };
        }),
    selectElement: (id) => set({ selectedElementId: id }),
    undo: () => set((state) => {
        if (state.past.length === 0) return state;
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, state.past.length - 1);
        return {
            past: newPast,
            elements: previous,
            future: [state.elements, ...state.future]
        };
    }),
    redo: () => set((state) => {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        return {
            past: [...state.past, state.elements],
            elements: next,
            future: newFuture
        };
    }),
}));
