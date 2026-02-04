import { adminDb } from '@/lib/adminDb';
import { PageViewer } from '@/components/public/PageViewer';
import { Metadata } from 'next';

interface Props {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}

// SEO Metadata Generation (unchanged logic, just re-exporting if needed or keeping it)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const { pages } = await adminDb.query({
        pages: {
            $: {
                where: { slug: slug }
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

export default async function PublicPage({ params }: Props) {
    const { slug } = await params;

    const { pages } = await adminDb.query({
        pages: {
            $: {
                where: { slug: slug }
            }
        }
    });

    const page = pages[0];

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="text-muted-foreground">Page not found</p>
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
