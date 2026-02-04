
const { init, id } = require('@instantdb/admin');

const APP_ID = '51c734c6-9638-400e-a002-3ab53761c839';
const ADMIN_TOKEN = '9f8897f8-b392-4540-b0b2-926fa7d53efb';

const db = init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
});

async function migratePages() {
    console.log("Syncing Page Ownership...");

    // 1. Fetch all users and their pages
    const data = await db.query({
        $users: {
            pages: {}
        }
    });

    const users = data.$users || [];
    console.log(`Found ${users.length} users.`);

    const transactions = [];

    for (const user of users) {
        const pages = user.pages || [];
        console.log(`User ${user.email} (${user.id}) has ${pages.length} pages.`);

        for (const page of pages) {
            if (page.ownerId !== user.id) {
                console.log(`  Updating page ${page.title} with ownerId ${user.id}`);
                transactions.push(
                    db.tx.pages[page.id].update({ ownerId: user.id })
                );
            }
        }
    }

    if (transactions.length > 0) {
        console.log(`Pushing ${transactions.length} page updates...`);
        await db.transact(transactions);
        console.log("Page migration finished.");
    } else {
        console.log("All pages have correct ownerId.");
    }

    // Now re-run the leads/events link check just in case
    console.log("Checking for orphaned leads/events...");
    const fullData = await db.query({
        leads: { page: {} },
        analytics_events: { page: {} }
    });

    const leadsTransactions = [];
    (fullData.leads || []).forEach(l => {
        // If lead has page link but no ownerId, or wrong ownerId
        const pageOwnerId = l.page?.ownerId; // Should be populated now if we hit pages first, but wait, query is stale
    });

    // Actually let's just do it in two steps.
}

migratePages().catch(console.error);
