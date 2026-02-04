'use client';

import React from 'react';
import { BuilderElement, useBuilderStore } from '@/store/useBuilderStore';

import { Type, Image as ImageIcon, Box, Link as LinkIcon, Heading, ListChecks, Star, Timer, CheckCircle2, User, Eye, ShieldCheck, Footprints, Lock, Megaphone, Search, Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDroppable } from '@dnd-kit/core';
import { OfferList } from '@/components/builder/elements/OfferList';
import { CircularProgress, CouponReveal, ToastNotifier, ClaimCounter, QueuePosition } from '@/components/builder/elements/EngagementElements';
import { ParagraphHeader, IconBox } from '@/components/builder/elements/ContentElements';
import { TestimonialsCarousel, FAQAccordion, VideoEmbed } from '@/components/builder/elements/ConversionElements';
import Image from 'next/image';




// --- Content Elements ---
const HeaderElement = ({ element }: { element: BuilderElement }) => {
    const Tag = (element.content.level || 'h2') as React.ElementType;
    return <Tag className="text-2xl font-bold tracking-tight text-foreground">{element.content.text || 'Heading Text'}</Tag>;
};

const TextElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="p-2 border border-transparent hover:border-dashed hover:border-primary/50 rounded transition-colors">
            <p className="text-foreground">{element.content.text || 'Edit this text'}</p>
        </div>
    );
};

const ButtonElement = ({ element }: { element: BuilderElement }) => {
    return (
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
            {element.content.label || 'Click me'}
        </button>
    );
};

const LinkElement = ({ element }: { element: BuilderElement }) => {
    return <a href="#" className="text-primary hover:underline hover:text-primary-hover transition-colors">{element.content.text || 'Link Text'}</a>;
};

const ImageElement = ({ element }: { element: BuilderElement }) => {
    const src = element.content.url || '';
    if (!src) {
        return (
            <div className="h-48 bg-muted flex flex-col items-center justify-center rounded border border-border border-dashed p-4 text-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">No Image Selected</p>
            </div>
        );
    }
    return (
        <div className="relative w-full overflow-hidden rounded-lg group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={element.content.alt || 'Image'}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
        </div>
    );
};

// --- CPA Elements ---
// --- CPA Elements ---
// OfferListElement removed and imported

const SingleOfferElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="p-6 bg-gradient-to-br from-card to-muted border border-border rounded-xl shadow-lg flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
            </div>
            <div>
                <h3 className="font-bold text-lg">Featured Offer</h3>
                <p className="text-sm text-muted-foreground">Complete this simple task to unlock content</p>
            </div>
            <Button className="w-full">Start Now</Button>
        </div>
    )
}

const ProgressBarElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
                <span>Progress</span>
                <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
        </div>
    )
}

const CountdownElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="flex justify-center space-x-4 text-center">
            {['02', '14', '59'].map((val, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-card border border-border rounded flex items-center justify-center text-xl font-bold font-mono">
                        {val}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase mt-1">
                        {['Min', 'Sec', 'Ms'][i]}
                    </span>
                </div>
            ))}
        </div>
    )
}

const TaskTrackerElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Tasks Completed</span>
            </div>
            <span className="font-bold text-primary">0 / 2</span>
        </div>
    )
}

// --- Engagement Elements ---
const LiveCounterElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full w-fit">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span><span className="font-bold text-foreground">1,245</span> users online</span>
        </div>
    )
}

const TrustBadgeElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="flex items-center justify-center space-x-4 p-4 border border-border rounded bg-card/50">
            <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-semibold">SSL Secure</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-semibold">Verified</span>
            </div>
        </div>
    )
}

const StepIndicatorElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((step, i) => (
                <div key={step} className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {step}
                    </div>
                    {i < 2 && <div className="w-8 h-1 bg-muted mx-2"></div>}
                </div>
            ))}
        </div>
    )
}

const BlurredPreviewElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="relative overflow-hidden rounded-lg border border-border">
            <div className="p-4 blur-sm select-none opacity-50 bg-muted">
                <h3 className="text-lg font-bold">Premium Content</h3>
                <p>This is hidden content that will be revealed after completion.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="flex flex-col items-center p-4 bg-card border border-border rounded shadow-lg">
                    <Lock className="h-6 w-6 text-primary mb-2" />
                    <span className="font-bold text-sm">Locked Content</span>
                </div>
            </div>
        </div>
    )
}

const StickyCTAElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="p-4 bg-primary text-primary-foreground rounded flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
                <Megaphone className="h-5 w-5" />
                <span className="font-bold text-sm">Limited Time Offer!</span>
            </div>
            <Button size="sm" variant="secondary" className="text-xs h-7">Claim Now</Button>
        </div>
    )
}

const UsernameFinderElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="bg-card p-4 rounded-lg border border-border space-y-3">
            <div className="flex space-x-2">
                <div className="relative flex-1">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Enter Username..." className="pl-9" />
                </div>
                <Button><Search className="h-4 w-4" /></Button>
            </div>
        </div>
    )
}

const SocialButtonsElement = ({ element }: { element: BuilderElement }) => {
    return (
        <div className="flex justify-center space-x-2">
            <Button size="icon" variant="outline"><Facebook className="h-4 w-4 text-blue-600" /></Button>
            <Button size="icon" variant="outline"><Twitter className="h-4 w-4 text-sky-500" /></Button>
            <Button size="icon" variant="outline"><Instagram className="h-4 w-4 text-pink-600" /></Button>
            <Button size="icon" variant="outline"><Share2 className="h-4 w-4" /></Button>
        </div>
    )
}

// --- Layout Components ---

const BuilderRow = ({ element, pageId }: { element: BuilderElement, pageId?: string }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: element.id,
        data: {
            isContainer: true,
        },
    });
    const { selectElement, selectedElementId } = useBuilderStore();

    const columns = element.content?.columns || 1;
    const gridClassName = columns === 2 ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-2';

    // Background image and styling
    const backgroundImage = element.content?.backgroundImage;
    const backgroundOverlay = element.content?.backgroundOverlay || 'rgba(0,0,0,0.3)';

    const rowStyle: React.CSSProperties = {
        ...(backgroundImage ? {
            backgroundImage: `linear-gradient(${backgroundOverlay}, ${backgroundOverlay}), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } : {}),
        ...(element.styles?.backgroundColor ? { backgroundColor: element.styles.backgroundColor } : {}),
        ...(element.styles?.padding ? { padding: element.styles.padding } : {}),
        ...(element.styles?.borderRadius ? { borderRadius: element.styles.borderRadius + 'px' } : {}),
    };

    return (
        <div
            ref={setNodeRef}
            className={`p-4 border border-dashed rounded min-h-[100px] transition-colors ${isOver ? 'border-primary bg-primary/10' : 'border-muted'
                } ${!backgroundImage && !element.styles?.backgroundColor ? 'bg-background/50' : ''}`}
            style={rowStyle}
        >
            {element.children && element.children.length > 0 ? (
                <div className={gridClassName}>
                    {element.children.map(child => {
                        const isChildSelected = selectedElementId === child.id;
                        return (
                            <div
                                key={child.id}
                                className={`relative group cursor-pointer rounded transition-all ${isChildSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-border'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectElement(child.id);
                                }}
                            >
                                <ElementRenderer element={child} isBuilder={true} pageId={pageId} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-xs text-muted-foreground py-4 pointer-events-none">
                    {columns === 2 ? '2-Column Row' : 'Row Container'} (Drop items here)
                </div>
            )}
        </div>
    );
};

const ViewerRow = ({ element, pageId }: { element: BuilderElement, pageId?: string }) => {
    const columns = element.content?.columns || 1;
    const gridClassName = columns === 2 ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-2';

    // Background image and styling
    const backgroundImage = element.content?.backgroundImage;
    const backgroundOverlay = element.content?.backgroundOverlay || 'rgba(0,0,0,0.3)';

    const rowStyle: React.CSSProperties = {
        ...(backgroundImage ? {
            backgroundImage: `linear-gradient(${backgroundOverlay}, ${backgroundOverlay}), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } : {}),
        ...(element.styles?.backgroundColor ? { backgroundColor: element.styles.backgroundColor } : {}),
        ...(element.styles?.padding ? { padding: element.styles.padding } : { padding: '16px' }),
        ...(element.styles?.borderRadius ? { borderRadius: element.styles.borderRadius + 'px' } : {}),
    };

    return (
        <div className="min-h-[50px]" style={rowStyle}>
            {element.children && element.children.length > 0 ? (
                <div className={gridClassName}>
                    {element.children.map(child => (
                        <ElementRenderer key={child.id} element={child} isBuilder={false} pageId={pageId} />
                    ))}
                </div>
            ) : null}
        </div>

    );
};

const SpacerElement = ({ element }: { element: BuilderElement }) => {
    const height = element.content.height || 40;
    return <div style={{ height: `${height}px` }} className="w-full" />;
};

// Registry mapping
const elementRegistry: Record<string, React.ComponentType<{ element: BuilderElement; isBuilder?: boolean; pageId?: string }>> = {
    // Content
    Header: HeaderElement,
    Text: TextElement,
    Button: ButtonElement,
    Link: LinkElement,
    Image: ImageElement,
    ParagraphHeader: ParagraphHeader,
    IconBox: IconBox,

    // CPA

    OfferList: OfferList,
    SingleOffer: SingleOfferElement,
    ProgressBar: ProgressBarElement,
    Countdown: CountdownElement,
    TaskTracker: TaskTrackerElement,

    // Engagement
    LiveCounter: LiveCounterElement,
    TrustBadge: TrustBadgeElement,
    StepIndicator: StepIndicatorElement,
    BlurredPreview: BlurredPreviewElement,
    StickyCTA: StickyCTAElement,
    UsernameFinder: UsernameFinderElement,
    SocialButtons: SocialButtonsElement,

    // New Engagement Elements
    CircularProgress: CircularProgress,
    CouponReveal: CouponReveal,
    ToastNotifier: ToastNotifier,
    ClaimCounter: ClaimCounter,
    QueuePosition: QueuePosition,

    // Conversion Elements
    TestimonialsCarousel: ({ element }: any) => <TestimonialsCarousel content={element.content} />,
    FAQAccordion: ({ element }: any) => <FAQAccordion content={element.content} />,
    VideoEmbed: ({ element }: any) => <VideoEmbed content={element.content} />,

    // Layout
    Row: (props) => props.isBuilder ? <BuilderRow {...props} /> : <ViewerRow {...props} />,
    Spacer: SpacerElement,
};



export const ElementRenderer = ({ element, isBuilder = false, pageId }: { element: BuilderElement; isBuilder?: boolean; pageId?: string }) => {
    const Component = elementRegistry[element.type];
    if (!Component) {
        return <div className="p-4 bg-destructive/10 text-destructive text-sm rounded">Unknown element type: {element.type}</div>;
    }

    // Apply styles
    const style: React.CSSProperties = {
        padding: element.styles?.padding,
        margin: element.styles?.margin,
        backgroundColor: element.styles?.backgroundColor,
        color: element.styles?.color,
        fontSize: element.styles?.fontSize ? `${element.styles.fontSize}px` : undefined,
        fontWeight: element.styles?.fontWeight,
        textAlign: element.styles?.textAlign as any,
        borderRadius: element.styles?.borderRadius ? `${element.styles.borderRadius}px` : undefined,
        opacity: element.styles?.opacity,
        width: element.styles?.width,
    };

    const className = `transition-all ${isBuilder ? 'cursor-default' : ''}`;

    return (
        <div style={style} className={className}>
            <Component element={element} isBuilder={isBuilder} pageId={pageId} />
        </div>
    );
};
