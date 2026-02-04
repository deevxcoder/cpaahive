
const { init, id } = require('@instantdb/admin');

const APP_ID = '51c734c6-9638-400e-a002-3ab53761c839';
const ADMIN_TOKEN = '9f8897f8-b392-4540-b0b2-926fa7d53efb';

const db = init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
});

async function debug() {
    console.log("Inspecting data...");

    const data = await db.query({
        pages: {
            owner: {}
        },
        leads: {
            page: {}
        }
    });

    console.log("\n--- PAGES ---");
    data.pages.forEach(p => {
        console.log(`Page: ${p.title} | ID: ${p.id} | Owner: ${p.owner?.email || 'NONE'}`);
    });

    console.log("\n--- LEADS ---");
    console.log(`Total Leads: ${data.leads.length}`);
    data.leads.slice(0, 10).forEach(l => {
        console.log(`Lead ID: ${l.id} | Page: ${l.page?.title || 'NONE'} | Payout: ${l.payout} | OwnerID: ${l.ownerId || 'MISSING'}`);
    });
}

debug().catch(console.error);
