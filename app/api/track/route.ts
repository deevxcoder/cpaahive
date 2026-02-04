import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/adminDb';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { pageId, type, meta } = body;

        if (!pageId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate event type
        if (!['view', 'click'].includes(type)) {
            return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
        }

        // Fetch page to get ownerId
        let ownerId: string | undefined;
        try {
            const { pages } = await adminDb.query({
                pages: {
                    $: { where: { id: pageId } }
                }
            });
            ownerId = pages?.[0]?.ownerId;
        } catch (queryError) {
            console.warn('Failed to fetch page owner:', queryError);
        }

        const eventId = crypto.randomUUID();

        // Record event - wrapped in try/catch to avoid breaking frontend
        try {
            await adminDb.transact([
                adminDb.tx.analytics_events[eventId].update({
                    pageId,
                    ownerId: ownerId || 'unknown',
                    type,
                    timestamp: new Date().toISOString(),
                    meta: meta || {},
                }),
            ]);
        } catch (transactError: any) {
            // Log but don't fail - schema might not be synced yet
            console.warn('Analytics transact warning (schema may need sync):', transactError.message);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Analytics error:', error);
        // Return success anyway to not break frontend tracking
        return NextResponse.json({ success: true, warning: 'Event may not have been recorded' });
    }
}
