import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/adminDb';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

const MOCK_OFFERS = [
    {
        offerid: '12345',
        name_short: 'Download TikTok',
        picture: 'https://via.placeholder.com/64',
        payout: '0.45',
        adcopy: 'Install and open the app to unlock.',
    },
    {
        offerid: '67890',
        name_short: 'Play Genshin Impact',
        picture: 'https://via.placeholder.com/64',
        payout: '1.20',
        adcopy: 'Reach level 10 to unlock.',
    },
    {
        offerid: '11223',
        name_short: 'Complete Survey',
        picture: 'https://via.placeholder.com/64',
        payout: '0.90',
        adcopy: 'Complete the short survey.',
    }
];

// Temporary test credentials (remove in production)
const TEST_API_KEY = '40220|EahNCF6879S5EG3s6RjbhFI0gorQ12jVkAG6WKGD79924203';
const TEST_ENDPOINT = 'https://lockedapp.space/api/v2';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const ctype = searchParams.get('ctype'); // Offer type: 1=CPI, 2=CPS, 3=CPL

    // Get visitor info from headers
    const headersList = await headers();
    let visitorIp = headersList.get('x-forwarded-for')?.split(',')[0] ||
        headersList.get('x-real-ip') ||
        '127.0.0.1';

    // Use a fallback public IP for local development (US IP for testing)
    if (visitorIp === '127.0.0.1' || visitorIp === '::1' || visitorIp.startsWith('192.168') || visitorIp.startsWith('10.')) {
        visitorIp = '8.8.8.8'; // Google DNS - US IP for testing
    }

    const userAgent = headersList.get('user-agent') || 'Mozilla/5.0';

    let API_KEY = TEST_API_KEY;
    let ENDPOINT = TEST_ENDPOINT;

    // If pageId provided, try to get user's custom credentials
    if (pageId) {
        try {
            const pageResult = await adminDb.query({
                pages: {
                    $: {
                        where: { id: pageId }
                    },
                    owner: {}
                }
            });

            const page = pageResult.pages[0];
            if (page?.owner) {
                const user = page.owner;
                if (user.ogadsApiKey && user.ogadsEndpoint) {
                    API_KEY = user.ogadsApiKey;
                    ENDPOINT = user.ogadsEndpoint;
                }
            }
        } catch (error) {
            console.warn('Failed to fetch user credentials, using test credentials');
        }
    }

    try {
        // Build URL with required parameters
        const url = new URL(ENDPOINT);
        url.searchParams.set('ip', visitorIp);
        url.searchParams.set('user_agent', userAgent);
        url.searchParams.set('max', searchParams.get('max') || '10'); // Use maxOffers from request
        // Add ctype filter if specified
        if (ctype) {
            url.searchParams.set('ctype', ctype);
        }


        console.log(`Fetching OGAds from: ${url.toString().replace(API_KEY, '***')}`);

        // Make request with Bearer token authentication
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OGAds API Error: ${response.status} - ${errorText}`);
            throw new Error(`Upstream API failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('OGAds response:', JSON.stringify(data).slice(0, 200));

        // Handle different response formats
        if (data.offers && Array.isArray(data.offers)) {
            console.log(`OGAds returned ${data.offers.length} offers`);
            return NextResponse.json({ success: true, offers: data.offers });
        }
        if (data.data?.offers && Array.isArray(data.data.offers)) {
            return NextResponse.json({ success: true, offers: data.data.offers });
        }
        if (Array.isArray(data)) {
            return NextResponse.json({ success: true, offers: data });
        }

        console.warn('Unexpected OGAds response format:', data);
        return NextResponse.json({ success: true, offers: MOCK_OFFERS, source: 'unexpected_format' });

    } catch (error) {
        console.error('OGAds API Error:', error);
        return NextResponse.json({ success: true, offers: MOCK_OFFERS, source: 'mock_fallback' });
    }
}
