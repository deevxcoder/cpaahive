import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/adminDb';
import { id } from '@instantdb/admin';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // OGAds common parameters or custom placeholders
    const userId = searchParams.get('user_id');
    const payout = parseFloat(searchParams.get('payout') || '0');
    const offerId = searchParams.get('offer_id');
    const country = searchParams.get('country') || 'Unknown';
    const device = searchParams.get('device') || 'Desktop';
    const pageId = searchParams.get('page_id') || 'unknown';

    if (!userId) {
        return NextResponse.json({ success: false, error: 'Missing user_id' }, { status: 400 });
    }

    try {
        // Record the lead in InstantDB
        const leadId = id();
        await adminDb.transact([
            adminDb.tx.leads[leadId].create({
                pageId: pageId,
                ownerId: userId, // Directly use userId from postback
                offerId: offerId || 'unknown',
                payout: payout,
                country: country,
                device: device,
                timestamp: new Date().toISOString(),
            }),
            adminDb.tx.leads[leadId].link({ owner: userId, page: pageId })
        ]);

        return NextResponse.json({ success: true, message: 'Postback received' });
    } catch (error) {
        console.error('Postback error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
