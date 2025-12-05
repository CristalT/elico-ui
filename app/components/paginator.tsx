'use client';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginatorProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export function Paginator({ currentPage, lastPage, onPageChange }: PaginatorProps) {
    // Generate page numbers to display (max 10 buttons)
    const generatePageNumbers = () => {
        const maxButtons = 10;
        const pages: (number | 'ellipsis')[] = [];

        if (lastPage <= maxButtons) {
            // If total pages is less than or equal to max buttons, show all pages
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            // Complex logic for showing pages with ellipsis
            const halfMax = Math.floor(maxButtons / 2);

            if (currentPage <= halfMax + 1) {
                // Show first pages + ellipsis + last page
                for (let i = 1; i <= maxButtons - 2; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(lastPage);
            } else if (currentPage >= lastPage - halfMax) {
                // Show first page + ellipsis + last pages
                pages.push(1);
                pages.push('ellipsis');
                for (let i = lastPage - (maxButtons - 3); i <= lastPage; i++) {
                    pages.push(i);
                }
            } else {
                // Show first page + ellipsis + middle pages + ellipsis + last page
                pages.push(1);
                pages.push('ellipsis');

                const start = currentPage - Math.floor((maxButtons - 4) / 2);
                const end = currentPage + Math.floor((maxButtons - 4) / 2);

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                pages.push('ellipsis');
                pages.push(lastPage);
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (hasPrevious) {
                                onPageChange(currentPage - 1);
                            }
                        }}
                        className={!hasPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page as number);
                                }}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (hasNext) {
                                onPageChange(currentPage + 1);
                            }
                        }}
                        className={!hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
