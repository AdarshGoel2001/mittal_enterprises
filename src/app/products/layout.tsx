import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex gap-12 items-start">
            <div className="hidden lg:block sticky top-24">
                <Sidebar />
            </div>
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}
