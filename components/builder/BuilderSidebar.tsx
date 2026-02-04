'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Type, Image, Box, LayoutGrid, Link as LinkIcon, Heading, ListChecks, Star, Timer, CheckCircle2, Siren, Eye, ShieldCheck, Footprints, Lock, Megaphone, Search, Share2, MoveVertical, FileText } from 'lucide-react';

import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const elements = [
    {
        group: 'Layout', items: [
            { type: 'Row', icon: LayoutGrid, label: 'Row' },
            { type: 'Spacer', icon: MoveVertical, label: 'Spacer' },
        ]
    },
    {
        group: 'Content', items: [
            { type: 'Header', icon: Heading, label: 'Header' },
            { type: 'Text', icon: Type, label: 'Text' },
            { type: 'ParagraphHeader', icon: FileText, label: 'Paragraph' },
            { type: 'IconBox', icon: LayoutGrid, label: 'Icon Box' },
            { type: 'Image', icon: Image, label: 'Image' },
            { type: 'Button', icon: Box, label: 'Button' },
            { type: 'Link', icon: LinkIcon, label: 'Link' },
        ]
    },

    {
        group: 'CPA', items: [
            { type: 'OfferList', icon: ListChecks, label: 'Offer List' },
            { type: 'SingleOffer', icon: Star, label: 'Single Offer' },
            { type: 'ProgressBar', icon: Timer, label: 'Progress' },
            { type: 'Countdown', icon: Siren, label: 'Countdown' },
            { type: 'TaskTracker', icon: CheckCircle2, label: 'Tracker' },
        ]
    },
    {
        group: 'Engagement', items: [
            { type: 'LiveCounter', icon: Eye, label: 'Live Count' },
            { type: 'TrustBadge', icon: ShieldCheck, label: 'Trust' },
            { type: 'StepIndicator', icon: Footprints, label: 'Steps' },
            { type: 'BlurredPreview', icon: Lock, label: 'Blur Lock' },
            { type: 'StickyCTA', icon: Megaphone, label: 'Sticky CTA' },
            { type: 'UsernameFinder', icon: Search, label: 'User Finder' },
            { type: 'SocialButtons', icon: Share2, label: 'Social' },
            { type: 'CircularProgress', icon: Timer, label: 'Progress Ring' },
            { type: 'CouponReveal', icon: Star, label: 'Coupon' },
            { type: 'ToastNotifier', icon: Megaphone, label: 'Toast Msg' },
            { type: 'ClaimCounter', icon: Eye, label: 'Claims' },
            { type: 'QueuePosition', icon: Footprints, label: 'Queue' },
        ]
    },
    {
        group: 'Conversion', items: [
            { type: 'TestimonialsCarousel', icon: Star, label: 'Testimonials' },
            { type: 'FAQAccordion', icon: ListChecks, label: 'FAQ' },
            { type: 'VideoEmbed', icon: Eye, label: 'Video' },
        ]
    }
];



function SidebarItem({ type, icon: Icon, label }: { type: string; icon: any; label: string }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            isSidebar: true,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                "flex flex-col items-center justify-center p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-move transition-colors touch-none bg-card/80",
                isDragging && "opacity-50 ring-2 ring-primary"
            )}
        >
            <Icon className="h-5 w-5 mb-2 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-center line-clamp-1">{label}</span>
        </div>
    );
}

export function BuilderSidebar() {
    return (
        <div className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-border shrink-0">
                <h2 className="font-semibold text-sm">Elements</h2>
            </div>
            <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                    {elements.map((group) => (
                        <div key={group.group}>
                            <h3 className="text-xs font-semibold text-muted-foreground mb-3 pl-1">{group.group}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {group.items.map((el) => (
                                    <SidebarItem key={el.type} {...el} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

