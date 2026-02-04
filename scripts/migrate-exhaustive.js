
const { init, id } = require('@instantdb/admin');

const APP_ID = '51c734c6-9638-400e-a002-3ab53761c839';
const ADMIN_TOKEN = '9f8897f8-b392-4540-b0b2-926fa7d53efb';

const db = init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
});

async function migrate() {
    console.log("Starting exhaustive migration...");

    // 1. Fetch all pages and all leads (separately)
    const data = await db.query({
        pages: {
            owner: {}
        },
        leads: {}
    });

    const pages = data.pages || [];
    const leads = data.leads || [];
    console.log(`Found ${pages.length} pages and ${leads.length} leads.`);

    const transactions = [];
    const pageMap = new Map(pages.map(p => [p.id, p]));

    for (const lead of leads) {
        const pageId = lead.pageId;
        const page = pageMap.get(pageId);

        if (!page) {
            console.log(`Lead ${lead.id} belongs to unknown page ${pageId}. Skipping.`);
            continue;
        }

        const ownerId = page.owner?.id;
        if (!ownerId) {
            console.log(`Lead ${lead.id} belongs to page ${page.title} which has no owner. Skipping.`);
            continue;
        }

        let needsUpdate = false;
        const updateObj = {};

        if (!lead.ownerId) {
            updateObj.ownerId = ownerId;
            needsUpdate = true;
        }

        if (needsUpdate) {
            transactions.push(db.tx.leads[lead.id].update(updateObj));
        }

        // Always ensure links are established if they are missing or to be certain
        // In InstantDB, link() is idempotent for unique links but let's just push it
        transactions.push(db.tx.leads[lead.id].link({ owner: ownerId, page: page.id }));
    }

    // Also do analytics_events
    const eventsData = await db.query({ analytics_events: {} });
    const events = eventsData.analytics_events || [];
    console.log(`Found ${events.length} analytics events.`);

    for (const event of events) {
        const pageId = event.pageId;
        const page = pageMap.get(pageId);
        if (page && page.owner?.id) {
            transactions.push(db.tx.analytics_events[event.id].update({ ownerId: page.owner.id }));
            transactions.push(db.tx.analytics_events[event.id].link({ owner: page.owner.id, page: page.id }));
        }
    }

    if (transactions.length > 0) {
        console.log(`Pushing ${transactions.length} operations...`);
        const batchSize = 100;
        for (let i = 0; i < transactions.length; i += batchSize) {
            const batch = transactions.slice(i, i + batchSize);
            await db.transact(batch);
            console.log(`Batch ${Math.floor(i / batchSize) + 1} done.`);
        }
        console.log("Migration finished.");
    } else {
        console.log("Nothing to migrate.");
    }
}

migrate().catch(console.error);
