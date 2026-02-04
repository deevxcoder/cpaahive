import { adminDb } from '@/lib/adminDb';
import { PageViewer } from '@/components/public/PageViewer';
import { Metadata } from 'next';

interface Props {
    params: { domain: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { domain } = await params;

    const { pages } = await adminDb.query({
        pages: {
            $: {
                where: { customDomain: domain }
            }
        }
    });

    const page = pages[0];

    if (!page) {
        return {
            title: 'Page Not Found - CPAHive',
        };
    }

    return {
        title: page.title,
        description: page.description || `Check out ${page.title} on CPAHive.`,
        openGraph: {
            title: page.title,
            description: page.description || `Check out ${page.title} on CPAHive.`,
            images: page.ogImage ? [page.ogImage] : (page.thumbnail ? [page.thumbnail] : []),
        },
        twitter: {
            card: 'summary_large_image',
            title: page.title,
            description: page.description || `Check out ${page.title} on CPAHive.`,
            images: page.ogImage ? [page.ogImage] : (page.thumbnail ? [page.thumbnail] : []),
        },
    };
}

export default async function DomainPage({ params }: Props) {
    const { domain } = await params;

    const { pages } = await adminDb.query({
        pages: {
            $: {
                where: { customDomain: domain }
            }
        }
    });

    const page = pages[0];

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="text-muted-foreground">Domain not configured</p>
                    <p className="text-xs text-muted-foreground mt-4">If you're the owner, check your settings in CPAHive dashboard.</p>
                </div>
            </div>
        );
    }

    if (!page.published) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">Unpublished</h1>
                    <p className="text-muted-foreground">This page is not yet public.</p>
                </div>
            </div>
        );
    }

    return <PageViewer page={page} />;
}
