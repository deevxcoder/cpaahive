'use client';

import { BuilderElement } from '@/store/useBuilderStore';
import { useState, useEffect } from 'react';
import { Ticket, Gift, Users, Clock } from 'lucide-react';

// ============================================
// 1. CIRCULAR PROGRESS - Animated 0-100% ring
// ============================================
interface CircularProgressContent {
    percentage?: number;
    duration?: number; // seconds to animate
    size?: 'small' | 'medium' | 'large';
    strokeColor?: string;
    trackColor?: string;
    label?: string;
    showPercentage?: boolean;
    autoAnimate?: boolean;
}

export const CircularProgress = ({ element, isBuilder }: { element: BuilderElement, isBuilder?: boolean }) => {
    const content: CircularProgressContent = element.content || {};
    const {
        percentage = 100,
        duration = 3,
        size = 'medium',
        strokeColor = '#22c55e',
        trackColor = '#1f2937',
        label = 'Verifying...',
        showPercentage = true,
        autoAnimate = true,
    } = content;

    const [progress, setProgress] = useState(isBuilder ? percentage : 0);

    useEffect(() => {
        if (isBuilder || !autoAnimate) {
            setProgress(percentage);
            return;
        }

        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) / 1000;
            const current = Math.min((elapsed / duration) * percentage, percentage);
            setProgress(current);

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [percentage, duration, isBuilder, autoAnimate]);

    const sizeMap = { small: 80, medium: 120, large: 160 };
    const strokeMap = { small: 6, medium: 8, large: 10 };
    const s = sizeMap[size];
    const stroke = strokeMap[size];
    const radius = (s - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-4">
            <div className="relative" style={{ width: s, height: s }}>
                <svg width={s} height={s} className="transform -rotate-90">
                    {/* Track */}
                    <circle
                        cx={s / 2}
                        cy={s / 2}
                        r={radius}
                        fill="transparent"
                        stroke={trackColor}
                        strokeWidth={stroke}
                    />
                    {/* Progress */}
                    <circle
                        cx={s / 2}
                        cy={s / 2}
                        r={radius}
                        fill="transparent"
                        stroke={strokeColor}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 0.1s ease' }}
                    />
                </svg>
                {showPercentage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-foreground">{Math.round(progress)}%</span>
                    </div>
                )}
            </div>
            {label && <p className="text-sm text-muted-foreground">{label}</p>}
        </div>
    );
};

// ============================================
// 2. COUPON REVEAL - Ticket-style blurred code
// ============================================
interface CouponRevealContent {
    code?: string;
    visibleChars?: number; // how many chars are visible
    label?: string;
    buttonText?: string;
    ticketColor?: string;
    blurIntensity?: 'low' | 'medium' | 'high';
}

export const CouponReveal = ({ element, isBuilder }: { element: BuilderElement, isBuilder?: boolean }) => {
    const content: CouponRevealContent = element.content || {};
    const {
        code = 'SAVE50OFF',
        visibleChars = 3,
        label = 'Your Exclusive Coupon',
        buttonText = 'Complete to Reveal',
        ticketColor = '#fbbf24',
        blurIntensity = 'medium',
    } = content;

    const blurMap = { low: 'blur-[2px]', medium: 'blur-[4px]', high: 'blur-[6px]' };
    const visiblePart = code.slice(0, visibleChars);
    const hiddenPart = code.slice(visibleChars);

    return (
        <div className="flex flex-col items-center gap-4 py-4">
            {label && <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>}

            {/* Ticket-style container */}
            <div className="relative">
                {/* Ticket notches */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background" />

                <div
                    className="px-8 py-4 rounded-lg border-2 border-dashed"
                    style={{ backgroundColor: ticketColor + '20', borderColor: ticketColor }}
                >
                    <div className="flex items-center gap-1 font-mono text-2xl font-bold tracking-widest">
                        <Ticket className="h-5 w-5 mr-2" style={{ color: ticketColor }} />
                        <span className="text-foreground">{visiblePart}</span>
                        <span className={`text-foreground select-none ${blurMap[blurIntensity]}`}>{hiddenPart}</span>
                    </div>
                </div>
            </div>

            <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                onClick={(e) => e.preventDefault()}
            >
                🔒 {buttonText}
            </button>
        </div>
    );
};

// ============================================
// 3. TOAST NOTIFIER - Inject messages
// ============================================
interface ToastNotifierContent {
    messages?: string[];
    interval?: number; // seconds between toasts
    duration?: number; // how long each toast shows
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    variant?: 'success' | 'info' | 'warning';
}

export const ToastNotifier = ({ element, isBuilder }: { element: BuilderElement, isBuilder?: boolean }) => {
    const content: ToastNotifierContent = element.content || {};
    const {
        messages = [
            '🎉 Sarah from NYC just claimed their reward!',
            '✅ Mike completed offer #3 seconds ago',
            '🔥 12 people are viewing this right now',
            '⚡ Limited time offer - 23 spots remaining',
        ],
        interval = 5,
        duration = 4,
        position = 'bottom-left',
        variant = 'info',
    } = content;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (isBuilder) return;

        const showToast = () => {
            setVisible(true);
            setTimeout(() => setVisible(false), duration * 1000);
        };

        showToast();
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % messages.length);
            showToast();
        }, interval * 1000);

        return () => clearInterval(timer);
    }, [messages, interval, duration, isBuilder]);

    const variantStyles = {
        success: 'bg-green-500/10 border-green-500/30 text-green-400',
        info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    };

    const positionStyles = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
    };

    // In builder, show static preview
    if (isBuilder) {
        return (
            <div className="p-4">
                <p className="text-xs text-muted-foreground mb-2">Toast Notifier Preview ({messages.length} messages)</p>
                <div className={`px-4 py-3 rounded-lg border ${variantStyles[variant]} text-sm max-w-xs`}>
                    {messages[0]}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`fixed ${positionStyles[position]} z-50 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
        >
            <div className={`px-4 py-3 rounded-lg border backdrop-blur-sm ${variantStyles[variant]} text-sm max-w-xs shadow-lg`}>
                {messages[currentIndex]}
            </div>
        </div>
    );
};

// ============================================
// 4. CLAIM COUNTER - X claimed, Y left
// ============================================
interface ClaimCounterContent {
    totalClaims?: number;
    spotsLeft?: number;
    label?: string;
    showIcon?: boolean;
    urgencyLevel?: 'low' | 'medium' | 'high';
    animateClaims?: boolean;
}

export const ClaimCounter = ({ element, isBuilder }: { element: BuilderElement, isBuilder?: boolean }) => {
    const content: ClaimCounterContent = element.content || {};
    const {
        totalClaims = 1247,
        spotsLeft = 23,
        label = 'claimed today',
        showIcon = true,
        urgencyLevel = 'high',
        animateClaims = true,
    } = content;

    const [claims, setClaims] = useState(totalClaims);
    const [spots, setSpots] = useState(spotsLeft);

    useEffect(() => {
        if (isBuilder || !animateClaims) return;

        const timer = setInterval(() => {
            if (Math.random() > 0.5) {
                setClaims(prev => prev + 1);
                setSpots(prev => Math.max(1, prev - 1));
            }
        }, 8000);

        return () => clearInterval(timer);
    }, [isBuilder, animateClaims]);

    const urgencyColors = {
        low: 'text-green-400',
        medium: 'text-yellow-400',
        high: 'text-red-400',
    };

    return (
        <div className="flex items-center justify-center gap-6 py-4">
            {/* Claims */}
            <div className="flex items-center gap-2">
                {showIcon && <Users className="h-5 w-5 text-green-400" />}
                <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{claims.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                </div>
            </div>

            <div className="h-8 w-px bg-border" />

            {/* Spots Left */}
            <div className="flex items-center gap-2">
                <Gift className={`h-5 w-5 ${urgencyColors[urgencyLevel]}`} />
                <div className="text-center">
                    <p className={`text-2xl font-bold ${urgencyColors[urgencyLevel]}`}>{spots}</p>
                    <p className="text-xs text-muted-foreground">spots left</p>
                </div>
            </div>
        </div>
    );
};

// ============================================
// 5. QUEUE POSITION - Waitlist indicator
// ============================================
interface QueuePositionContent {
    position?: number;
    totalInQueue?: number;
    estimatedWait?: string;
    movingSpeed?: 'slow' | 'medium' | 'fast';
    showProgress?: boolean;
    label?: string;
}

export const QueuePosition = ({ element, isBuilder }: { element: BuilderElement, isBuilder?: boolean }) => {
    const content: QueuePositionContent = element.content || {};
    const {
        position = 47,
        totalInQueue = 234,
        estimatedWait = '~2 mins',
        movingSpeed = 'medium',
        showProgress = true,
        label = 'Your Position in Queue',
    } = content;

    const [currentPosition, setCurrentPosition] = useState(position);

    useEffect(() => {
        if (isBuilder) return;

        const speedMap = { slow: 15000, medium: 8000, fast: 4000 };
        const timer = setInterval(() => {
            setCurrentPosition(prev => Math.max(1, prev - Math.floor(Math.random() * 3)));
        }, speedMap[movingSpeed]);

        return () => clearInterval(timer);
    }, [isBuilder, movingSpeed]);

    const progressPercentage = ((totalInQueue - currentPosition) / totalInQueue) * 100;

    return (
        <div className="flex flex-col items-center gap-4 py-4 px-6">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>

            <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary animate-pulse" />
                <span className="text-4xl font-bold text-primary">#{currentPosition}</span>
            </div>

            {showProgress && (
                <div className="w-full max-w-xs">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{totalInQueue - currentPosition} ahead of you</span>
                        <span className="text-xs text-muted-foreground">{estimatedWait}</span>
                    </div>
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Please wait - you'll be processed automatically
            </p>
        </div>
    );
};
