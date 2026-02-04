
const { init, id } = require('@instantdb/admin');

const APP_ID = '51c734c6-9638-400e-a002-3ab53761c839';
const ADMIN_TOKEN = '9f8897f8-b392-4540-b0b2-926fa7d53efb';

const db = init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
});

async function dump() {
    console.log("Fetching everything...");

    const data = await db.query({
        pages: {
            owner: {}
        },
        leads: {},
        $users: {
            pages: {}
        }
    });

    console.log("\n--- USERS and their PAGES ---");
    data.$users.forEach(u => {
        console.log(`User: ${u.email} (${u.id})`);
        (u.pages || []).forEach(p => {
            console.log(`  -> Page: ${p.title} (${p.id})`);
        });
    });

    console.log("\n--- ALL LEADS ---");
    console.log(`Count: ${data.leads.length}`);
    data.leads.forEach(l => {
        console.log(`Lead ${l.id} | pageId: ${l.pageId} | ownerId: ${l.ownerId || 'NULL'} | payout: ${l.payout}`);
    });
}

dump().catch(console.error);
