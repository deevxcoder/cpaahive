'use client';

import { BuilderElement } from '@/store/useBuilderStore';
import {
    Star, Heart, Check, AlertCircle, Info, Zap, Shield,
    Gift, Trophy, Crown, Rocket, Target, Award, Flame,
    Clock, Users, Eye, Lock, Sparkles, ThumbsUp
} from 'lucide-react';

// Available icons for IconBox
export const ICON_OPTIONS = [
    { value: 'Star', icon: Star },
    { value: 'Heart', icon: Heart },
    { value: 'Check', icon: Check },
    { value: 'AlertCircle', icon: AlertCircle },
    { value: 'Info', icon: Info },
    { value: 'Zap', icon: Zap },
    { value: 'Shield', icon: Shield },
    { value: 'Gift', icon: Gift },
    { value: 'Trophy', icon: Trophy },
    { value: 'Crown', icon: Crown },
    { value: 'Rocket', icon: Rocket },
    { value: 'Target', icon: Target },
    { value: 'Award', icon: Award },
    { value: 'Flame', icon: Flame },
    { value: 'Clock', icon: Clock },
    { value: 'Users', icon: Users },
    { value: 'Eye', icon: Eye },
    { value: 'Lock', icon: Lock },
    { value: 'Sparkles', icon: Sparkles },
    { value: 'ThumbsUp', icon: ThumbsUp },
];

// ============================================
// 1. PARAGRAPH WITH HEADER
// ============================================
interface ParagraphHeaderContent {
    heading?: string;
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4';
    paragraph?: string;
    headingColor?: string;
    paragraphColor?: string;
    alignment?: 'left' | 'center' | 'right';
    spacing?: 'tight' | 'normal' | 'relaxed';
}

export const ParagraphHeader = ({ element }: { element: BuilderElement }) => {
    const content: ParagraphHeaderContent = element.content || {};
    const {
        heading = 'Your Heading Here',
        headingLevel = 'h2',
        paragraph = 'Add your paragraph text here. This is a great place to explain your offer or provide additional context.',
        headingColor = '',
        paragraphColor = '',
        alignment = 'left',
        spacing = 'normal',
    } = content;

    const spacingClasses = {
        tight: 'gap-1',
        normal: 'gap-3',
        relaxed: 'gap-5',
    };

    const headingSizes = {
        h1: 'text-3xl font-bold',
        h2: 'text-2xl font-bold',
        h3: 'text-xl font-semibold',
        h4: 'text-lg font-semibold',
    };

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    const HeadingTag = headingLevel;

    return (
        <div className={`flex flex-col ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
            {HeadingTag === 'h1' && <h1 className={`${headingSizes.h1} tracking-tight`} style={{ color: headingColor || undefined }}>{heading}</h1>}
            {HeadingTag === 'h2' && <h2 className={`${headingSizes.h2} tracking-tight`} style={{ color: headingColor || undefined }}>{heading}</h2>}
            {HeadingTag === 'h3' && <h3 className={`${headingSizes.h3} tracking-tight`} style={{ color: headingColor || undefined }}>{heading}</h3>}
            {HeadingTag === 'h4' && <h4 className={`${headingSizes.h4} tracking-tight`} style={{ color: headingColor || undefined }}>{heading}</h4>}
            <p
                className="text-muted-foreground leading-relaxed"
                style={{ color: paragraphColor || undefined }}
            >
                {paragraph}
            </p>
        </div>
    );
};

// ============================================
// 2. ICON BOX - Icon + Header + Paragraph
// ============================================
interface IconBoxContent {
    icon?: string;
    heading?: string;
    paragraph?: string;
    layout?: 'vertical' | 'horizontal';
    alignment?: 'left' | 'center' | 'right';
    iconSize?: 'small' | 'medium' | 'large';
    iconColor?: string;
    iconBgColor?: string;
    headingColor?: string;
    paragraphColor?: string;
    showIconBg?: boolean;
}

export const IconBox = ({ element }: { element: BuilderElement }) => {
    const content: IconBoxContent = element.content || {};
    const {
        icon = 'Star',
        heading = 'Feature Title',
        paragraph = 'Describe your feature or benefit here.',
        layout = 'vertical',
        alignment = 'center',
        iconSize = 'medium',
        iconColor = '#3b82f6',
        iconBgColor = '#3b82f6',
        headingColor = '',
        paragraphColor = '',
        showIconBg = true,
    } = content;

    const IconComponent = ICON_OPTIONS.find(opt => opt.value === icon)?.icon || Star;

    const iconSizes = {
        small: { icon: 'h-5 w-5', container: 'p-2' },
        medium: { icon: 'h-6 w-6', container: 'p-3' },
        large: { icon: 'h-8 w-8', container: 'p-4' },
    };

    const alignmentClasses = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right',
    };

    const isHorizontal = layout === 'horizontal';

    return (
        <div
            className={`flex ${isHorizontal ? 'flex-row gap-4' : 'flex-col gap-3'} ${alignmentClasses[alignment]}`}
        >
            {/* Icon */}
            <div
                className={`shrink-0 rounded-lg ${iconSizes[iconSize].container} ${isHorizontal && alignment === 'center' ? 'self-start' : ''}`}
                style={{
                    backgroundColor: showIconBg ? iconBgColor + '20' : 'transparent',
                }}
            >
                <IconComponent
                    className={iconSizes[iconSize].icon}
                    style={{ color: iconColor }}
                />
            </div>

            {/* Content */}
            <div className={`flex flex-col gap-1 ${isHorizontal ? '' : alignmentClasses[alignment]}`}>
                <h4
                    className="font-semibold text-foreground"
                    style={{ color: headingColor || undefined }}
                >
                    {heading}
                </h4>
                <p
                    className="text-sm text-muted-foreground"
                    style={{ color: paragraphColor || undefined }}
                >
                    {paragraph}
                </p>
            </div>
        </div>
    );
};
