import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    const hostname = req.headers
        .get("host")!
        .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

    // Special case for Vercel preview URLs or main domain
    // We want to skip rewriting for the main dashboard app
    // Assuming 'cpahive.vercel.app' or 'localhost:3000' is the main app
    const isMainApp =
        hostname === 'localhost:3000' ||
        hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
        hostname.endsWith('.vercel.app') ||
        hostname.endsWith('.netlify.app'); // Support both Vercel and Netlify deployments

    // If it's the main app, proceed as normal (handling dashboard, etc.)
    // But wait, what if 'localhost:3000' IS the main app and accessed directly? 
    // We don't want to rewrite to /p/.

    // Logic: 
    // If custom domain (NOT main app), rewrite to /d/[domain]/[path]
    // If proper subdomain (e.g. slug.cpahive.com), rewrite to /p/[slug] ? 
    // Or do we rely on /p/[slug] path for subdomains? 
    // The current app serves pages at /p/[slug].

    // Custom Domain Logic:
    // If hostname is "custom.com", rewrite content of "/" to "/d/custom.com".
    // content of "/foo" to "/d/custom.com/foo" (if we supported multi-page sites, currently just single page landing usually).

    if (!isMainApp) {
        // It is a custom domain!
        const searchParams = req.nextUrl.searchParams.toString();
        // Get the path (e.g. /about, /)
        const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
            }`;

        // Rewrite to the dynamic route for custom domains
        // For single page sites, we likely just care about the root "/" or maybe specific paths.
        // We'll rewrite everything to the domain handler for now.
        return NextResponse.rewrite(
            new URL(`/d/${hostname}${path}`, req.url)
        );
    }

    return NextResponse.next();
}
