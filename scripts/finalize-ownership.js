
const { init, id } = require('@instantdb/admin');

const APP_ID = '51c734c6-9638-400e-a002-3ab53761c839';
const ADMIN_TOKEN = '9f8897f8-b392-4540-b0b2-926fa7d53efb';

const db = init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
});

async function finishMigration() {
    console.log("Finalizing Lead/Event Ownership...");

    const data = await db.query({
        pages: {
            leads: {},
            analytics: {}
        }
    });

    const pages = data.pages || [];
    console.log(`Found ${pages.length} pages.`);

    const transactions = [];

    for (const page of pages) {
        const ownerId = page.ownerId;
        if (!ownerId) {
            console.log(`  Page ${page.title} still has no ownerId property. Skipping.`);
            continue;
        }

        const leads = page.leads || [];
        const events = page.analytics || [];
        console.log(`  Page ${page.title} has ${leads.length} leads and ${events.length} events.`);

        leads.forEach(l => {
            if (l.ownerId !== ownerId) {
                transactions.push(db.tx.leads[l.id].update({ ownerId: ownerId }));
                transactions.push(db.tx.leads[l.id].link({ owner: ownerId, page: page.id }));
            }
        });

        events.forEach(e => {
            if (e.ownerId !== ownerId) {
                transactions.push(db.tx.analytics_events[e.id].update({ ownerId: ownerId }));
                transactions.push(db.tx.analytics_events[e.id].link({ owner: ownerId, page: page.id }));
            }
        });
    }

    if (transactions.length > 0) {
        console.log(`Pushing ${transactions.length} updates...`);
        const batchSize = 100;
        for (let i = 0; i < transactions.length; i += batchSize) {
            const batch = transactions.slice(i, i + batchSize);
            await db.transact(batch);
        }
        console.log("Migration finalized.");
    } else {
        console.log("No leads/events needed updating.");
    }
}

finishMigration().catch(console.error);
