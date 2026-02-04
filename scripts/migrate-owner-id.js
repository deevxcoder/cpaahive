
const { init, id } = require('@instantdb/admin');

const APP_ID = '51c734c6-9638-400e-a002-3ab53761c839';
const ADMIN_TOKEN = '9f8897f8-b392-4540-b0b2-926fa7d53efb';

const db = init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
});

async function migrate() {
    console.log("Starting migration...");

    // 1. Fetch all pages with their owners and leads/analytics
    const data = await db.query({
        pages: {
            owner: {},
            leads: {},
            analytics: {}
        }
    });

    const pages = data.pages || [];
    console.log(`Found ${pages.length} pages.`);

    const transactions = [];

    for (const page of pages) {
        const ownerId = page.owner?.id;
        if (!ownerId) {
            console.log(`Page ${page.title} (${page.id}) has no owner. Skipping.`);
            continue;
        }

        console.log(`Processing page: ${page.title} (Owner: ${ownerId})`);

        // Update leads
        const leads = page.leads || [];
        for (const lead of leads) {
            if (!lead.ownerId) {
                transactions.push(
                    db.tx.leads[lead.id].update({ ownerId: ownerId })
                );
                // Also ensure link is correct
                transactions.push(
                    db.tx.leads[lead.id].link({ owner: ownerId, page: page.id })
                );
            }
        }

        // Update analytics events
        const events = page.analytics || [];
        for (const event of events) {
            if (!event.ownerId) {
                transactions.push(
                    db.tx.analytics_events[event.id].update({ ownerId: ownerId })
                );
                transactions.push(
                    db.tx.analytics_events[event.id].link({ owner: ownerId, page: page.id })
                );
            }
        }
    }

    if (transactions.length > 0) {
        console.log(`Pushing ${transactions.length} updates...`);
        // Batch transactions if they are too many
        const batchSize = 50;
        for (let i = 0; i < transactions.length; i += batchSize) {
            const batch = transactions.slice(i, i + batchSize);
            await db.transact(batch);
            console.log(`Flushed batch ${i / batchSize + 1}`);
        }
        console.log("Migration completed successfully.");
    } else {
        console.log("No records need updating.");
    }
}

migrate().catch(console.error);
