'use client';

import { useBuilderStore, BuilderElement } from '@/store/useBuilderStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Link as LinkIcon, Settings2, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StyleEditor } from './editors/StyleEditor';

// Recursive helper to find element by ID
const findElement = (elements: BuilderElement[], id: string): BuilderElement | undefined => {
    for (const el of elements) {
        if (el.id === id) return el;
        if (el.children) {
            const found = findElement(el.children, id);
            if (found) return found;
        }
    }
    return undefined;
};

export function PropertiesPanel() {
    const { elements, selectedElementId, updateElement, selectElement } = useBuilderStore();
    const selectedElement = selectedElementId ? findElement(elements, selectedElementId) : undefined;

    if (!selectedElement) {
        return (
            <div className="w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Settings2 className="h-12 w-12 mb-4 opacity-20" />
                <p>Select an element on the canvas to edit its properties.</p>
            </div>
        );
    }

    const handleContentChange = (key: string, value: any) => {
        updateElement(selectedElement.id, {
            content: { ...selectedElement.content, [key]: value }
        });
    };

    return (
        <div className="w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <div>
                    <h2 className="font-semibold text-sm">Properties</h2>
                    <p className="text-xs text-muted-foreground">{selectedElement.type} Element</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => selectElement(null)}>

                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto">
                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b border-border p-0 h-10 bg-transparent">
                        <TabsTrigger
                            value="content"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-xs"
                        >
                            Content
                        </TabsTrigger>
                        <TabsTrigger
                            value="style"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-xs"
                        >
                            Style
                        </TabsTrigger>
                    </TabsList>

                    <div className="p-4 space-y-6">
                        <TabsContent value="content" className="space-y-4 data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-left-2 mt-0">
                            {/* Dynamic Content Forms based on Type */}
                            {['Header', 'Text', 'Link', 'Button'].includes(selectedElement.type) && (
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Text Content</Label>
                                        <Input
                                            value={selectedElement.content.text || selectedElement.content.label || ''}
                                            onChange={(e) => handleContentChange(selectedElement.type === 'Button' ? 'label' : 'text', e.target.value)}
                                            placeholder="Enter text..."
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedElement.type === 'Header' && (
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Heading Level</Label>
                                        <div className="flex bg-muted rounded-md p-1">
                                            {['h1', 'h2', 'h3', 'h4'].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => handleContentChange('level', level)}
                                                    className={`flex-1 text-xs py-1 rounded-sm transition-colors ${selectedElement.content.level === level ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                >
                                                    {level.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {['Button', 'Link', 'StickyCTA'].includes(selectedElement.type) && (
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">URL / Action</Label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                value={selectedElement.content.href || ''}
                                                onChange={(e) => handleContentChange('href', e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content: Paragraph with Header */}
                            {selectedElement.type === 'ParagraphHeader' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Content</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Heading</Label>
                                            <Input
                                                value={selectedElement.content.heading || ''}
                                                onChange={(e) => handleContentChange('heading', e.target.value)}
                                                placeholder="Your heading..."
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Heading Level</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['h1', 'h2', 'h3', 'h4'].map(level => (
                                                    <button
                                                        key={level}
                                                        onClick={() => handleContentChange('headingLevel', level)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors uppercase ${(selectedElement.content.headingLevel || 'h2') === level ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Paragraph</Label>
                                            <textarea
                                                value={selectedElement.content.paragraph || ''}
                                                onChange={(e) => handleContentChange('paragraph', e.target.value)}
                                                placeholder="Your paragraph text..."
                                                className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md bg-background resize-y"
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Style</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Alignment</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['left', 'center', 'right'].map(align => (
                                                    <button
                                                        key={align}
                                                        onClick={() => handleContentChange('alignment', align)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.alignment || 'left') === align ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {align}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Spacing</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['tight', 'normal', 'relaxed'].map(sp => (
                                                    <button
                                                        key={sp}
                                                        onClick={() => handleContentChange('spacing', sp)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.spacing || 'normal') === sp ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {sp}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Heading Color</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.headingColor || '#ffffff'} onChange={(e) => handleContentChange('headingColor', e.target.value)} />
                                                    <Input value={selectedElement.content.headingColor || ''} onChange={(e) => handleContentChange('headingColor', e.target.value)} placeholder="auto" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Paragraph Color</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.paragraphColor || '#888888'} onChange={(e) => handleContentChange('paragraphColor', e.target.value)} />
                                                    <Input value={selectedElement.content.paragraphColor || ''} onChange={(e) => handleContentChange('paragraphColor', e.target.value)} placeholder="auto" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content: Icon Box */}
                            {selectedElement.type === 'IconBox' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Content</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Icon</Label>
                                            <div className="grid grid-cols-5 gap-1 p-2 border rounded-md max-h-[100px] overflow-y-auto">
                                                {['Star', 'Heart', 'Check', 'Zap', 'Shield', 'Gift', 'Trophy', 'Crown', 'Rocket', 'Target', 'Award', 'Flame', 'Clock', 'Users', 'Eye', 'Lock', 'Sparkles', 'ThumbsUp', 'Info', 'AlertCircle'].map(iconName => (
                                                    <button
                                                        key={iconName}
                                                        onClick={() => handleContentChange('icon', iconName)}
                                                        className={`p-1.5 rounded text-[10px] ${(selectedElement.content.icon || 'Star') === iconName ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                                        title={iconName}
                                                    >
                                                        {iconName.slice(0, 2)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Heading</Label>
                                            <Input value={selectedElement.content.heading || ''} onChange={(e) => handleContentChange('heading', e.target.value)} placeholder="Feature title..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Paragraph</Label>
                                            <textarea value={selectedElement.content.paragraph || ''} onChange={(e) => handleContentChange('paragraph', e.target.value)} placeholder="Description..." className="w-full min-h-[60px] px-3 py-2 text-sm border rounded-md bg-background resize-y" />
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Layout</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Direction</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['vertical', 'horizontal'].map(lay => (
                                                    <button
                                                        key={lay}
                                                        onClick={() => handleContentChange('layout', lay)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.layout || 'vertical') === lay ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {lay}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Alignment</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['left', 'center', 'right'].map(align => (
                                                    <button
                                                        key={align}
                                                        onClick={() => handleContentChange('alignment', align)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.alignment || 'center') === align ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {align}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Icon Size</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['small', 'medium', 'large'].map(sz => (
                                                    <button
                                                        key={sz}
                                                        onClick={() => handleContentChange('iconSize', sz)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.iconSize || 'medium') === sz ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {sz}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={selectedElement.content.showIconBg !== false} onChange={(e) => handleContentChange('showIconBg', e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                                            Show Icon Background
                                        </label>
                                    </div>

                                    <div className="h-px bg-border" />

                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Colors</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Icon</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.iconColor || '#3b82f6'} onChange={(e) => handleContentChange('iconColor', e.target.value)} />
                                                    <Input value={selectedElement.content.iconColor || ''} onChange={(e) => handleContentChange('iconColor', e.target.value)} placeholder="#3b82f6" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Icon BG</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.iconBgColor || '#3b82f6'} onChange={(e) => handleContentChange('iconBgColor', e.target.value)} />
                                                    <Input value={selectedElement.content.iconBgColor || ''} onChange={(e) => handleContentChange('iconBgColor', e.target.value)} placeholder="#3b82f6" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Heading</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.headingColor || '#ffffff'} onChange={(e) => handleContentChange('headingColor', e.target.value)} />
                                                    <Input value={selectedElement.content.headingColor || ''} onChange={(e) => handleContentChange('headingColor', e.target.value)} placeholder="auto" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Paragraph</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.paragraphColor || '#888888'} onChange={(e) => handleContentChange('paragraphColor', e.target.value)} />
                                                    <Input value={selectedElement.content.paragraphColor || ''} onChange={(e) => handleContentChange('paragraphColor', e.target.value)} placeholder="auto" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Conversion: Testimonials Carousel */}
                            {selectedElement.type === 'TestimonialsCarousel' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Settings</Label>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={selectedElement.content.autoPlay !== false} onChange={(e) => handleContentChange('autoPlay', e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                                            Auto-Play Carousel
                                        </label>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={selectedElement.content.showArrows !== false} onChange={(e) => handleContentChange('showArrows', e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                                            Show Navigation Arrows
                                        </label>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={selectedElement.content.showDots !== false} onChange={(e) => handleContentChange('showDots', e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                                            Show Dots Indicator
                                        </label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Auto-Play Interval (ms)</Label>
                                            <Input type="number" value={selectedElement.content.autoPlayInterval || 5000} onChange={(e) => handleContentChange('autoPlayInterval', parseInt(e.target.value))} min={2000} max={15000} step={1000} />
                                        </div>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Style</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Card Style</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['default', 'minimal', 'gradient'].map(s => (
                                                    <button key={s} onClick={() => handleContentChange('cardStyle', s)} className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.cardStyle || 'default') === s ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{s}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Text Color</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.textColor || '#ffffff'} onChange={(e) => handleContentChange('textColor', e.target.value)} />
                                                    <Input value={selectedElement.content.textColor || ''} onChange={(e) => handleContentChange('textColor', e.target.value)} placeholder="#fff" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Star Color</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.accentColor || '#fbbf24'} onChange={(e) => handleContentChange('accentColor', e.target.value)} />
                                                    <Input value={selectedElement.content.accentColor || ''} onChange={(e) => handleContentChange('accentColor', e.target.value)} placeholder="#fbbf24" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Conversion: FAQ Accordion */}
                            {selectedElement.type === 'FAQAccordion' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Content</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Section Title</Label>
                                            <Input value={selectedElement.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} placeholder="Frequently Asked Questions" />
                                        </div>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Settings</Label>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={selectedElement.content.allowMultiple !== false} onChange={(e) => handleContentChange('allowMultiple', e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                                            Allow Multiple Open
                                        </label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Icon Position</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['left', 'right'].map(pos => (
                                                    <button key={pos} onClick={() => handleContentChange('iconPosition', pos)} className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.iconPosition || 'right') === pos ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{pos}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Style</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['default', 'bordered', 'separated'].map(s => (
                                                    <button key={s} onClick={() => handleContentChange('style', s)} className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.style || 'default') === s ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{s}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Colors</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Question</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.questionColor || '#ffffff'} onChange={(e) => handleContentChange('questionColor', e.target.value)} />
                                                    <Input value={selectedElement.content.questionColor || ''} onChange={(e) => handleContentChange('questionColor', e.target.value)} placeholder="#fff" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Answer</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.answerColor || '#9ca3af'} onChange={(e) => handleContentChange('answerColor', e.target.value)} />
                                                    <Input value={selectedElement.content.answerColor || ''} onChange={(e) => handleContentChange('answerColor', e.target.value)} placeholder="#9ca3af" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Accent</Label>
                                                <div className="flex gap-1">
                                                    <Input type="color" className="w-8 p-1 h-8 cursor-pointer" value={selectedElement.content.accentColor || '#3b82f6'} onChange={(e) => handleContentChange('accentColor', e.target.value)} />
                                                    <Input value={selectedElement.content.accentColor || ''} onChange={(e) => handleContentChange('accentColor', e.target.value)} placeholder="#3b82f6" className="flex-1 text-xs" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Conversion: Video Embed */}
                            {selectedElement.type === 'VideoEmbed' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Video</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Video URL (YouTube/Vimeo)</Label>
                                            <Input value={selectedElement.content.url || ''} onChange={(e) => handleContentChange('url', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Custom Thumbnail URL</Label>
                                            <Input value={selectedElement.content.thumbnail || ''} onChange={(e) => handleContentChange('thumbnail', e.target.value)} placeholder="Auto-generated from YouTube" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Caption</Label>
                                            <Input value={selectedElement.content.caption || ''} onChange={(e) => handleContentChange('caption', e.target.value)} placeholder="Watch how it works..." />
                                        </div>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Settings</Label>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={selectedElement.content.autoPlay || false} onChange={(e) => handleContentChange('autoPlay', e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                                            Auto-Play Video
                                        </label>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={selectedElement.content.showPlayButton !== false} onChange={(e) => handleContentChange('showPlayButton', e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                                            Show Play Button
                                        </label>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={selectedElement.content.shadow !== false} onChange={(e) => handleContentChange('shadow', e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                                            Drop Shadow
                                        </label>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Style</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Aspect Ratio</Label>
                                            <div className="grid grid-cols-2 gap-1">
                                                {['16:9', '4:3', '1:1', '9:16'].map(ratio => (
                                                    <button key={ratio} onClick={() => handleContentChange('aspectRatio', ratio)} className={`text-xs py-1.5 rounded-sm transition-colors ${(selectedElement.content.aspectRatio || '16:9') === ratio ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{ratio}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Border Radius</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['none', 'small', 'medium', 'large'].map(r => (
                                                    <button key={r} onClick={() => handleContentChange('borderRadius', r)} className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.borderRadius || 'medium') === r ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{r}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* CPA: Offer List */}
                            {selectedElement.type === 'OfferList' && (
                                <div className="space-y-4">
                                    {/* Display Settings */}
                                    <div className="space-y-3">


                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Display Settings</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Max Offers</Label>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={20}
                                                value={selectedElement.content.maxOffers || 5}
                                                onChange={(e) => handleContentChange('maxOffers', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Offer Type</Label>
                                            <div className="grid grid-cols-2 gap-1">
                                                {[
                                                    { value: '', label: 'All Types' },
                                                    { value: '1', label: 'App Install' },
                                                    { value: '2', label: 'Surveys' },
                                                    { value: '3', label: 'Sign-ups' },
                                                ].map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleContentChange('ctype', opt.value)}
                                                        className={`text-[10px] py-1.5 rounded border transition-colors ${(selectedElement.content.ctype || '') === opt.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">

                                            <Label className="text-xs">Card Style</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['default', 'minimal', 'gradient'].map(style => (
                                                    <button
                                                        key={style}
                                                        onClick={() => handleContentChange('cardStyle', style)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${selectedElement.content.cardStyle === style ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {style}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Image Size</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {['small', 'medium', 'large'].map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => handleContentChange('imageSize', size)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors capitalize ${(selectedElement.content.imageSize || 'medium') === size ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Toggle Options */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Show/Hide</Label>
                                        <div className="space-y-2">
                                            {[
                                                { key: 'showImage', label: 'Show Image', default: true },
                                                { key: 'showBadge', label: 'Show Badge', default: true },
                                                { key: 'showDescription', label: 'Show Description', default: true },
                                                { key: 'showStars', label: 'Star Placeholder', default: false },
                                            ].map(({ key, label, default: defaultVal }) => (
                                                <label key={key} className="flex items-center justify-between cursor-pointer">
                                                    <span className="text-xs">{label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedElement.content[key] ?? defaultVal}
                                                        onChange={(e) => handleContentChange(key, e.target.checked)}
                                                        className="h-4 w-4 rounded border-border accent-primary"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Text Customization */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Text Labels</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Heading (optional)</Label>
                                            <Input
                                                value={selectedElement.content.heading || ''}
                                                onChange={(e) => handleContentChange('heading', e.target.value)}
                                                placeholder="e.g., Complete 1 Offer"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Button Text</Label>
                                                <Input
                                                    value={selectedElement.content.buttonText || 'GET'}
                                                    onChange={(e) => handleContentChange('buttonText', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Badge Text</Label>
                                                <Input
                                                    value={selectedElement.content.badgeText || 'FREE'}
                                                    onChange={(e) => handleContentChange('badgeText', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Empty State Text</Label>
                                            <Input
                                                value={selectedElement.content.emptyText || 'No offers available.'}
                                                onChange={(e) => handleContentChange('emptyText', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Colors */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Colors</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Button Color</Label>
                                                <div className="flex gap-1">
                                                    <Input
                                                        type="color"
                                                        className="w-8 p-1 h-8 cursor-pointer"
                                                        value={selectedElement.content.buttonColor || '#22c55e'}
                                                        onChange={(e) => handleContentChange('buttonColor', e.target.value)}
                                                    />
                                                    <Input
                                                        value={selectedElement.content.buttonColor || ''}
                                                        onChange={(e) => handleContentChange('buttonColor', e.target.value)}
                                                        placeholder="#22c55e"
                                                        className="flex-1 text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Badge Color</Label>
                                                <div className="flex gap-1">
                                                    <Input
                                                        type="color"
                                                        className="w-8 p-1 h-8 cursor-pointer"
                                                        value={selectedElement.content.badgeColor || '#3b82f6'}
                                                        onChange={(e) => handleContentChange('badgeColor', e.target.value)}
                                                    />
                                                    <Input
                                                        value={selectedElement.content.badgeColor || ''}
                                                        onChange={(e) => handleContentChange('badgeColor', e.target.value)}
                                                        placeholder="#3b82f6"
                                                        className="flex-1 text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Card Background</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    className="w-10 p-1 h-8 cursor-pointer"
                                                    value={selectedElement.content.cardBgColor || '#1a1a1a'}
                                                    onChange={(e) => handleContentChange('cardBgColor', e.target.value)}
                                                />
                                                <Input
                                                    value={selectedElement.content.cardBgColor || ''}
                                                    onChange={(e) => handleContentChange('cardBgColor', e.target.value)}
                                                    placeholder="transparent"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CPA: Task Tracker */}
                            {selectedElement.type === 'TaskTracker' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Count / Target</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.count || 3}
                                            onChange={(e) => handleContentChange('count', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Points Reward</Label>
                                        <Input
                                            value={selectedElement.content.points || '+150'}
                                            onChange={(e) => handleContentChange('points', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* CPA: Countdown */}
                            {selectedElement.type === 'Countdown' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Duration (Minutes)</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.minutes || 5}
                                            onChange={(e) => handleContentChange('minutes', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Engagement: Live Counter */}
                            {selectedElement.type === 'LiveCounter' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Initial Count</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.initialCount || 1245}
                                            onChange={(e) => handleContentChange('initialCount', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Layout: Row */}
                            {selectedElement.type === 'Row' && (
                                <div className="space-y-4">
                                    {/* Columns */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Layout</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Columns</Label>
                                            <div className="flex bg-muted rounded-md p-1">
                                                {[1, 2].map(cols => (
                                                    <button
                                                        key={cols}
                                                        onClick={() => handleContentChange('columns', cols)}
                                                        className={`flex-1 text-xs py-1 rounded-sm transition-colors ${selectedElement.content.columns === cols ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {cols} Column{cols > 1 ? 's' : ''}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Background Image */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Background</Label>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Background Image URL</Label>
                                            <Input
                                                value={selectedElement.content.backgroundImage || ''}
                                                onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Overlay Color</Label>
                                            <Input
                                                value={selectedElement.content.backgroundOverlay || 'rgba(0,0,0,0.3)'}
                                                onChange={(e) => handleContentChange('backgroundOverlay', e.target.value)}
                                                placeholder="rgba(0,0,0,0.3)"
                                            />
                                            <p className="text-[10px] text-muted-foreground">Use rgba for transparency, e.g. rgba(0,0,0,0.5)</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Layout: Spacer */}
                            {selectedElement.type === 'Spacer' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Height (px)</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.height || 40}
                                            onChange={(e) => handleContentChange('height', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Circular Progress */}
                            {selectedElement.type === 'CircularProgress' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Target Percentage</Label>
                                        <Input
                                            type="number"
                                            min={0} max={100}
                                            value={selectedElement.content.percentage || 100}
                                            onChange={(e) => handleContentChange('percentage', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Animation Duration (seconds)</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.duration || 3}
                                            onChange={(e) => handleContentChange('duration', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Label Text</Label>
                                        <Input
                                            value={selectedElement.content.label || 'Verifying...'}
                                            onChange={(e) => handleContentChange('label', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Ring Color</Label>
                                        <Input
                                            value={selectedElement.content.strokeColor || '#22c55e'}
                                            onChange={(e) => handleContentChange('strokeColor', e.target.value)}
                                            placeholder="#22c55e"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Size</Label>
                                        <div className="flex bg-muted rounded-md p-1">
                                            {['small', 'medium', 'large'].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => handleContentChange('size', size)}
                                                    className={`flex-1 text-xs py-1 rounded-sm capitalize ${selectedElement.content.size === size ? 'bg-background shadow-sm' : ''}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Coupon Reveal */}
                            {selectedElement.type === 'CouponReveal' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Coupon Code</Label>
                                        <Input
                                            value={selectedElement.content.code || 'SAVE50OFF'}
                                            onChange={(e) => handleContentChange('code', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Visible Characters</Label>
                                        <Input
                                            type="number"
                                            min={0} max={10}
                                            value={selectedElement.content.visibleChars || 3}
                                            onChange={(e) => handleContentChange('visibleChars', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Label</Label>
                                        <Input
                                            value={selectedElement.content.label || 'Your Exclusive Coupon'}
                                            onChange={(e) => handleContentChange('label', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Button Text</Label>
                                        <Input
                                            value={selectedElement.content.buttonText || 'Complete to Reveal'}
                                            onChange={(e) => handleContentChange('buttonText', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Ticket Color (hex)</Label>
                                        <Input
                                            value={selectedElement.content.ticketColor || '#fbbf24'}
                                            onChange={(e) => handleContentChange('ticketColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Toast Notifier */}
                            {selectedElement.type === 'ToastNotifier' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Messages (one per line)</Label>
                                        <textarea
                                            className="w-full h-24 text-xs px-2 py-1.5 border rounded bg-background resize-none"
                                            value={(selectedElement.content.messages || []).join('\n')}
                                            onChange={(e) => handleContentChange('messages', e.target.value.split('\n').filter(Boolean))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Interval (seconds)</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.interval || 5}
                                            onChange={(e) => handleContentChange('interval', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Variant</Label>
                                        <div className="flex bg-muted rounded-md p-1">
                                            {['success', 'info', 'warning'].map(v => (
                                                <button
                                                    key={v}
                                                    onClick={() => handleContentChange('variant', v)}
                                                    className={`flex-1 text-xs py-1 rounded-sm capitalize ${selectedElement.content.variant === v ? 'bg-background shadow-sm' : ''}`}
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Position</Label>
                                        <div className="grid grid-cols-2 gap-1">
                                            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                                                <button
                                                    key={pos}
                                                    onClick={() => handleContentChange('position', pos)}
                                                    className={`text-[10px] py-1 rounded border ${selectedElement.content.position === pos ? 'border-primary bg-primary/10' : 'border-border'}`}
                                                >
                                                    {pos.replace('-', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Claim Counter */}
                            {selectedElement.type === 'ClaimCounter' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Total Claims</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.totalClaims || 1247}
                                            onChange={(e) => handleContentChange('totalClaims', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Spots Left</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.spotsLeft || 23}
                                            onChange={(e) => handleContentChange('spotsLeft', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Labels</Label>
                                        <Input
                                            value={selectedElement.content.label || 'claimed today'}
                                            onChange={(e) => handleContentChange('label', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Urgency Level</Label>
                                        <div className="flex bg-muted rounded-md p-1">
                                            {['low', 'medium', 'high'].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => handleContentChange('urgencyLevel', level)}
                                                    className={`flex-1 text-xs py-1 rounded-sm capitalize ${selectedElement.content.urgencyLevel === level ? 'bg-background shadow-sm' : ''}`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Queue Position */}
                            {selectedElement.type === 'QueuePosition' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Starting Position</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.position || 47}
                                            onChange={(e) => handleContentChange('position', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Total in Queue</Label>
                                        <Input
                                            type="number"
                                            value={selectedElement.content.totalInQueue || 234}
                                            onChange={(e) => handleContentChange('totalInQueue', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Estimated Wait</Label>
                                        <Input
                                            value={selectedElement.content.estimatedWait || '~2 mins'}
                                            onChange={(e) => handleContentChange('estimatedWait', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Label</Label>
                                        <Input
                                            value={selectedElement.content.label || 'Your Position in Queue'}
                                            onChange={(e) => handleContentChange('label', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Moving Speed</Label>
                                        <div className="flex bg-muted rounded-md p-1">
                                            {['slow', 'medium', 'fast'].map(speed => (
                                                <button
                                                    key={speed}
                                                    onClick={() => handleContentChange('movingSpeed', speed)}
                                                    className={`flex-1 text-xs py-1 rounded-sm capitalize ${selectedElement.content.movingSpeed === speed ? 'bg-background shadow-sm' : ''}`}
                                                >
                                                    {speed}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fallback for other types */}
                            {!['Header', 'Text', 'Link', 'Button', 'StickyCTA', 'OfferList', 'TaskTracker', 'Countdown', 'LiveCounter', 'Row', 'Spacer', 'CircularProgress', 'CouponReveal', 'ToastNotifier', 'ClaimCounter', 'QueuePosition', 'ParagraphHeader', 'IconBox', 'TestimonialsCarousel', 'FAQAccordion', 'VideoEmbed'].includes(selectedElement.type) && (
                                <div className="p-4 border border-dashed border-border rounded text-center">
                                    <p className="text-xs text-muted-foreground">Properties for {selectedElement.type} coming soon.</p>
                                </div>
                            )}


                        </TabsContent>

                        <TabsContent value="style" className="space-y-4 mt-0">
                            <StyleEditor element={selectedElement} />
                        </TabsContent>
                    </div>
                </Tabs >
            </ScrollArea >
        </div >
    );
}
