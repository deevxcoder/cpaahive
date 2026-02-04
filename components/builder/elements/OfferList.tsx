'use client';

import { BuilderElement } from '@/store/useBuilderStore';
import { Star, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

interface Offer {
    offerid: string | number;
    name_short: string;
    name?: string;
    picture: string;
    payout: string;
    adcopy: string;
    link?: string;
}

interface OfferListContent {
    // Display settings
    maxOffers?: number;
    showImage?: boolean;
    showBadge?: boolean;
    showDescription?: boolean;
    showStars?: boolean;

    // Text customization
    heading?: string;
    buttonText?: string;
    badgeText?: string;
    emptyText?: string;
    loadingText?: string;

    // Style customization
    cardStyle?: 'default' | 'minimal' | 'gradient';
    imageSize?: 'small' | 'medium' | 'large';
    buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary';

    // Colors
    badgeColor?: string;
    buttonColor?: string;
    cardBgColor?: string;
    cardBorderColor?: string;
    ctype?: string; // Offer type filter: 1=CPI, 2=Surveys, 3=CPL
}

export const OfferList = ({ element, isBuilder, pageId }: { element: BuilderElement, isBuilder?: boolean, pageId?: string }) => {

    const [allOffers, setAllOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    const content: OfferListContent = element.content || {};
    const {
        maxOffers = 5,
        showImage = true,
        showBadge = true,
        showDescription = true,
        showStars = false,
        heading = '',
        buttonText = 'GET',
        badgeText = 'FREE',
        emptyText = 'No offers available at the moment.',
        loadingText = 'Loading offers...',
        cardStyle = 'default',
        imageSize = 'medium',
        buttonVariant = 'default',
        badgeColor = '',
        buttonColor = '',
        cardBgColor = '',
        cardBorderColor = '',
        ctype = '',
    } = content;

    // Store all offers, slice happens during render
    const offers = allOffers.slice(0, maxOffers);

    // Debug logging
    console.log(`OfferList: allOffers=${allOffers.length}, maxOffers=${maxOffers}, displaying=${offers.length}`);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const params = new URLSearchParams();
                if (pageId) params.set('pageId', pageId);
                if (ctype) params.set('ctype', ctype);
                params.set('max', String(maxOffers)); // Only fetch what user needs
                const query = `?${params.toString()}`;
                const res = await fetch(`/api/ogads${query}`);
                const data = await res.json();
                if (data.success && data.offers) {
                    setAllOffers(data.offers);
                }
            } catch (error) {
                console.error('Failed to load offers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [pageId, ctype, maxOffers]); // Re-fetch when maxOffers changes too



    // Image size classes
    const imageSizeClasses = {
        small: 'h-8 w-8',
        medium: 'h-12 w-12',
        large: 'h-16 w-16',
    };

    // Card style classes
    const getCardClasses = () => {
        const base = 'flex items-center justify-between p-3 rounded-lg transition-all';
        switch (cardStyle) {
            case 'minimal':
                return `${base} bg-transparent hover:bg-muted/50`;
            case 'gradient':
                return `${base} bg-gradient-to-r from-card to-muted/50 border border-border shadow-md hover:shadow-lg`;
            default:
                return `${base} bg-card border border-border shadow-sm hover:shadow-md`;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                {loadingText}
            </div>
        );
    }

    if (offers.length === 0) {
        return (
            <div className="text-center p-4 bg-muted/20 rounded-lg text-muted-foreground text-sm">
                {emptyText}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {heading && (
                <h3 className="text-lg font-semibold text-center mb-4">{heading}</h3>
            )}
            {offers.map((offer, i) => (
                <div
                    key={offer.offerid || i}
                    className={getCardClasses()}
                    style={{
                        backgroundColor: cardBgColor || undefined,
                        borderColor: cardBorderColor || undefined,
                    }}
                >
                    <div className="flex items-center space-x-3 overflow-hidden flex-1">
                        {showImage && (
                            offer.picture ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={offer.picture}
                                    alt={offer.name_short || offer.name || 'Offer'}
                                    className={`${imageSizeClasses[imageSize]} rounded-lg object-cover bg-muted flex-shrink-0`}
                                />
                            ) : showStars ? (
                                <div className={`${imageSizeClasses[imageSize]} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <Star className="h-5 w-5 text-white fill-white" />
                                </div>
                            ) : (
                                <div className={`${imageSizeClasses[imageSize]} bg-muted rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <Download className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate pr-2">
                                {offer.name_short || offer.name}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground gap-2 mt-0.5">
                                {showBadge && (
                                    <Badge
                                        variant="secondary"
                                        className="text-[10px] h-4 px-1.5 rounded-sm font-semibold"
                                        style={{ backgroundColor: badgeColor || undefined }}
                                    >
                                        {badgeText}
                                    </Badge>
                                )}
                                {showDescription && offer.adcopy && (
                                    <span className="truncate max-w-[180px]">{offer.adcopy}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant={buttonVariant}
                        className="h-8 shrink-0 font-semibold px-4"
                        style={{ backgroundColor: buttonColor || undefined }}
                        onClick={() => !isBuilder && offer.link && window.open(offer.link, '_blank')}
                        disabled={isBuilder}
                    >
                        {buttonText}
                    </Button>
                </div>
            ))}
        </div>
    );
}
