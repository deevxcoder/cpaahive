import { i } from "@instantdb/react";

const _schema = i.schema({
    entities: {
        pages: i.entity({
            title: i.string(),
            slug: i.string().unique().indexed(),
            type: i.string(), // 'landing' | 'locker'
            elements: i.json(),
            createdAt: i.string().indexed(),
            updatedAt: i.string().indexed(),
            thumbnail: i.string().optional(),
            description: i.string().optional(),
            ogImage: i.string().optional(),
            customDomain: i.string().unique().indexed().optional(),
            headScripts: i.string().optional(),
            bodyScripts: i.string().optional(),
            published: i.boolean(),
            ownerId: i.string().indexed(), // Added for direct filtering
        }),
        $users: i.entity({
            email: i.string().unique().indexed(),
            name: i.string().optional(),
            avatar: i.string().optional(),
            ogadsApiKey: i.string().optional(),
            ogadsUserId: i.string().optional(),
            ogadsEndpoint: i.string().optional(),
        }),
        analytics_events: i.entity({
            pageId: i.string().indexed(),
            ownerId: i.string().indexed(), // Added for easier filtering
            type: i.string(), // 'view' | 'click'
            timestamp: i.string().indexed(),
            meta: i.json().optional(),
        }),
        leads: i.entity({
            pageId: i.string().indexed(),
            ownerId: i.string().indexed(), // Added for easier filtering
            offerId: i.string().optional(),
            payout: i.number().optional(),
            country: i.string().optional(),
            device: i.string().optional(),
            timestamp: i.string().indexed(),
        }),
        ai_contents: i.entity({
            ownerId: i.string().indexed(),
            type: i.string(), // 'copy' | 'image'
            prompt: i.string(),
            result: i.string(), // Text or Image URL
            category: i.string().optional(), // 'landing' | 'locker'
            createdAt: i.string().indexed(),
        }),
    },
    links: {
        pageAnalytics: {
            forward: {
                on: "analytics_events",
                has: "one",
                label: "page",
            },
            reverse: {
                on: "pages",
                has: "many",
                label: "analytics",
            },
        },
        userLeads: {
            forward: {
                on: "leads",
                has: "one",
                label: "owner",
            },
            reverse: {
                on: "$users",
                has: "many",
                label: "leads",
            },
        },
        userAnalytics: {
            forward: {
                on: "analytics_events",
                has: "one",
                label: "owner",
            },
            reverse: {
                on: "$users",
                has: "many",
                label: "analytics",
            },
        },
        pageOwner: {
            forward: {
                on: "pages",
                has: "one",
                label: "owner",
            },
            reverse: {
                on: "$users",
                has: "many",
                label: "pages",
            },
        },
        pageLeads: {
            forward: {
                on: "leads",
                has: "one",
                label: "page",
            },
            reverse: {
                on: "pages",
                has: "many",
                label: "leads",
            },
        },
        userAiContents: {
            forward: {
                on: "ai_contents",
                has: "one",
                label: "owner",
            },
            reverse: {
                on: "$users",
                has: "many",
                label: "aiContents",
            },
        },
    },
});

export default _schema;
