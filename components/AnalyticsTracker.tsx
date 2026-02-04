'use client';

import { useEffect, useRef } from 'react';

interface Props {
    pageId: string;
}

export function AnalyticsTracker({ pageId }: Props) {
    const trackedRef = useRef(false);

    useEffect(() => {
        if (trackedRef.current) return;
        trackedRef.current = true;

        const trackView = async () => {
            try {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pageId,
                        type: 'view',
                        meta: {
                            referrer: document.referrer,
                        }
                    })
                });
            } catch (error) {
                console.error('Failed to track view:', error);
            }
        };

        trackView();
    }, [pageId]);

    return null;
}
