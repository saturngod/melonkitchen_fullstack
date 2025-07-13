import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface PaginationProps {
    meta: PaginationMeta;
    className?: string;
}

export default function Pagination({ meta, className }: PaginationProps) {
    const { current_page, last_page, links } = meta;

    if (last_page <= 1) {
        return null;
    }

    const renderPageButton = (link: PaginationLink, index: number) => {
        const isPrevious = link.label.includes('Previous');
        const isNext = link.label.includes('Next');
        const isEllipsis = link.label === '...';

        if (isEllipsis) {
            return (
                <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    disabled
                    className="h-10 w-10"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More pages</span>
                </Button>
            );
        }

        if (isPrevious) {
            return (
                <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    disabled={!link.url}
                    asChild={!!link.url}
                >
                    {link.url ? (
                        <Link href={link.url} preserveState>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Link>
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </>
                    )}
                </Button>
            );
        }

        if (isNext) {
            return (
                <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    disabled={!link.url}
                    asChild={!!link.url}
                >
                    {link.url ? (
                        <Link href={link.url} preserveState>
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </Link>
                    ) : (
                        <>
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </>
                    )}
                </Button>
            );
        }

        // Regular page number
        return (
            <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                size="icon"
                className="h-10 w-10"
                asChild={!!link.url}
                disabled={!link.url}
            >
                {link.url ? (
                    <Link href={link.url} preserveState>
                        {link.label}
                    </Link>
                ) : (
                    link.label
                )}
            </Button>
        );
    };

    return (
        <div className={cn("flex items-center justify-between px-2 py-4", className)}>
            <div className="flex-1 text-sm text-muted-foreground">
                Showing {meta.from} to {meta.to} of {meta.total} results
            </div>
            <div className="flex items-center space-x-2">
                {links.map((link, index) => renderPageButton(link, index))}
            </div>
        </div>
    );
}
