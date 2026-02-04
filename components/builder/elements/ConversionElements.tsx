'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Play, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================================
// TESTIMONIALS CAROUSEL
// ============================================================================

interface Testimonial {
    name: string;
    location: string;
    avatar: string;
    rating: number;
    quote: string;
}

interface TestimonialsCarouselProps {
    content: {
        testimonials?: Testimonial[];
        autoPlay?: boolean;
        autoPlayInterval?: number;
        showArrows?: boolean;
        showDots?: boolean;
        cardStyle?: 'default' | 'minimal' | 'gradient';
        bgColor?: string;
        textColor?: string;
        accentColor?: string;
    };
}

const defaultTestimonials: Testimonial[] = [
    {
        name: "Sarah M.",
        location: "New York, USA",
        avatar: "https://i.pravatar.cc/100?img=1",
        rating: 5,
        quote: "I couldn't believe it actually worked! Got my reward within 10 minutes of completing the offers. Super easy!"
    },
    {
        name: "James K.",
        location: "London, UK",
        avatar: "https://i.pravatar.cc/100?img=2",
        rating: 5,
        quote: "Was skeptical at first but tried it anyway. Completed 2 simple tasks and received my gift card instantly!"
    },
    {
        name: "Maria G.",
        location: "Toronto, CA",
        avatar: "https://i.pravatar.cc/100?img=3",
        rating: 4,
        quote: "The process was straightforward. Just follow the steps and you'll get your reward. Highly recommend!"
    },
];

export function TestimonialsCarousel({ content }: TestimonialsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const testimonials = content.testimonials?.length ? content.testimonials : defaultTestimonials;
    const autoPlay = content.autoPlay !== false;
    const interval = content.autoPlayInterval || 5000;
    const showArrows = content.showArrows !== false;
    const showDots = content.showDots !== false;
    const cardStyle = content.cardStyle || 'default';
    const accentColor = content.accentColor || '#fbbf24';

    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, testimonials.length]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    const current = testimonials[currentIndex];

    const cardStyles = {
        default: 'bg-white/10 backdrop-blur-sm border border-white/20',
        minimal: 'bg-transparent',
        gradient: 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/10',
    };

    return (
        <div
            className="w-full py-6"
            style={{ backgroundColor: content.bgColor }}
        >
            <div className="relative max-w-2xl mx-auto px-4">
                {/* Quote Icon */}
                <Quote
                    className="absolute -top-2 left-8 h-12 w-12 opacity-20"
                    style={{ color: accentColor }}
                />

                {/* Card */}
                <div className={`relative rounded-2xl p-6 ${cardStyles[cardStyle]}`}>
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < current.rating ? 'fill-current' : 'opacity-30'}`}
                                style={{ color: accentColor }}
                            />
                        ))}
                    </div>

                    {/* Quote */}
                    <p
                        className="text-center text-lg mb-6 leading-relaxed"
                        style={{ color: content.textColor || '#ffffff' }}
                    >
                        "{current.quote}"
                    </p>

                    {/* Avatar & Name */}
                    <div className="flex items-center justify-center gap-3">
                        <img
                            src={current.avatar}
                            alt={current.name}
                            className="w-12 h-12 rounded-full object-cover border-2"
                            style={{ borderColor: accentColor }}
                        />
                        <div>
                            <p
                                className="font-semibold"
                                style={{ color: content.textColor || '#ffffff' }}
                            >
                                {current.name}
                            </p>
                            <p
                                className="text-sm opacity-70"
                                style={{ color: content.textColor || '#ffffff' }}
                            >
                                {current.location}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                {showArrows && testimonials.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5 text-white" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ChevronRight className="h-5 w-5 text-white" />
                        </button>
                    </>
                )}

                {/* Dots */}
                {showDots && testimonials.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-6' : 'opacity-50'
                                    }`}
                                style={{ backgroundColor: accentColor }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    content: {
        items?: FAQItem[];
        title?: string;
        allowMultiple?: boolean;
        iconPosition?: 'left' | 'right';
        style?: 'default' | 'bordered' | 'separated';
        questionColor?: string;
        answerColor?: string;
        accentColor?: string;
        bgColor?: string;
    };
}

const defaultFAQs: FAQItem[] = [
    {
        question: "Is this really free?",
        answer: "Yes! You just need to complete a few simple offers or tasks. These are sponsored by advertisers who pay us, so you don't have to pay anything."
    },
    {
        question: "How long does it take to get my reward?",
        answer: "Most users receive their rewards within 5-15 minutes after completing the required offers. Some rewards may take up to 24 hours."
    },
    {
        question: "Are the offers safe to complete?",
        answer: "Absolutely! All our offers come from verified advertisers. We never ask for sensitive information like passwords or credit card details."
    },
    {
        question: "How many offers do I need to complete?",
        answer: "Usually just 1-2 offers. The exact number depends on the reward value. Higher value rewards may require more offers."
    },
];

export function FAQAccordion({ content }: FAQAccordionProps) {
    const [openItems, setOpenItems] = useState<number[]>([]);
    const items = content.items?.length ? content.items : defaultFAQs;
    const allowMultiple = content.allowMultiple !== false;
    const iconPosition = content.iconPosition || 'right';
    const style = content.style || 'default';
    const accentColor = content.accentColor || '#3b82f6';

    const toggleItem = (index: number) => {
        if (allowMultiple) {
            setOpenItems(prev =>
                prev.includes(index)
                    ? prev.filter(i => i !== index)
                    : [...prev, index]
            );
        } else {
            setOpenItems(prev =>
                prev.includes(index) ? [] : [index]
            );
        }
    };

    const containerStyles = {
        default: 'space-y-2',
        bordered: 'border rounded-xl overflow-hidden divide-y',
        separated: 'space-y-3',
    };

    const itemStyles = {
        default: 'rounded-lg bg-white/5',
        bordered: 'bg-white/5',
        separated: 'rounded-xl bg-white/10 border border-white/20',
    };

    return (
        <div
            className="w-full py-4"
            style={{ backgroundColor: content.bgColor }}
        >
            {content.title && (
                <h3
                    className="text-xl font-bold mb-4 text-center"
                    style={{ color: content.questionColor || '#ffffff' }}
                >
                    {content.title}
                </h3>
            )}

            <div className={containerStyles[style]}>
                {items.map((item, index) => {
                    const isOpen = openItems.includes(index);
                    const Icon = isOpen ? ChevronUp : ChevronDown;

                    return (
                        <div key={index} className={itemStyles[style]}>
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                            >
                                {iconPosition === 'left' && (
                                    <Icon
                                        className="h-5 w-5 flex-shrink-0 transition-transform"
                                        style={{ color: accentColor }}
                                    />
                                )}
                                <span
                                    className="flex-1 font-medium"
                                    style={{ color: content.questionColor || '#ffffff' }}
                                >
                                    {item.question}
                                </span>
                                {iconPosition === 'right' && (
                                    <Icon
                                        className="h-5 w-5 flex-shrink-0 transition-transform"
                                        style={{ color: accentColor }}
                                    />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p
                                    className="px-4 pb-4 text-sm leading-relaxed"
                                    style={{
                                        color: content.answerColor || '#9ca3af',
                                        marginLeft: iconPosition === 'left' ? '2rem' : 0
                                    }}
                                >
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================================
// VIDEO EMBED
// ============================================================================

interface VideoEmbedProps {
    content: {
        url?: string;
        thumbnail?: string;
        autoPlay?: boolean;
        showPlayButton?: boolean;
        aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
        borderRadius?: 'none' | 'small' | 'medium' | 'large';
        shadow?: boolean;
        caption?: string;
        captionColor?: string;
    };
}

export function VideoEmbed({ content }: VideoEmbedProps) {
    const [isPlaying, setIsPlaying] = useState(content.autoPlay || false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const url = content.url || '';
    const thumbnail = content.thumbnail || '';
    const showPlayButton = content.showPlayButton !== false;
    const aspectRatio = content.aspectRatio || '16:9';
    const borderRadius = content.borderRadius || 'medium';
    const shadow = content.shadow !== false;

    // Parse YouTube/Vimeo URL to get embed URL
    const getEmbedUrl = (videoUrl: string): string => {
        // YouTube
        const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
        }

        // Vimeo
        const vimeoMatch = videoUrl.match(/(?:vimeo\.com\/)(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        }

        return videoUrl;
    };

    const aspectRatios = {
        '16:9': 'aspect-video',
        '4:3': 'aspect-[4/3]',
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]',
    };

    const borderRadii = {
        none: 'rounded-none',
        small: 'rounded-md',
        medium: 'rounded-xl',
        large: 'rounded-2xl',
    };

    // Auto-generate thumbnail from YouTube URL if not provided
    const getThumbnail = (): string => {
        if (thumbnail) return thumbnail;
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
        if (youtubeMatch) {
            return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
        }
        return 'https://via.placeholder.com/640x360/1a1a2e/ffffff?text=Video';
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    return (
        <div className="w-full py-4">
            <div
                className={`relative overflow-hidden ${aspectRatios[aspectRatio]} ${borderRadii[borderRadius]} ${shadow ? 'shadow-2xl shadow-black/50' : ''
                    }`}
            >
                {!isPlaying ? (
                    // Thumbnail with Play Button
                    <div
                        className="absolute inset-0 bg-cover bg-center cursor-pointer group"
                        style={{ backgroundImage: `url(${getThumbnail()})` }}
                        onClick={handlePlay}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                        {/* Play Button */}
                        {showPlayButton && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="h-10 w-10 text-red-600 ml-1" fill="currentColor" />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Video iframe
                    <iframe
                        ref={iframeRef}
                        src={getEmbedUrl(url)}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </div>

            {/* Caption */}
            {content.caption && (
                <p
                    className="text-center text-sm mt-3 opacity-70"
                    style={{ color: content.captionColor || '#ffffff' }}
                >
                    {content.caption}
                </p>
            )}
        </div>
    );
}
