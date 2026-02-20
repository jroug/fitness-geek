import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import right_arrow from "../public/svg/right-arrow.svg";

interface InnerLinkProps {
    title: string;
    goToUrl: string;
}

const InnerLink: React.FC<InnerLinkProps> = ({ title, goToUrl }) => {
    return (     
        <div className="calendar-link-wrapper mt-5 flex justify-end px-4 md:px-6">
            <Link
                href={goToUrl}
                className="inline-flex items-center gap-2 rounded-md px-1 py-1 text-sm font-semibold text-slate-600 transition hover:text-cyan-700"
            >
                <span>{title}</span>
                <div className="flex h-5 w-5 items-center justify-center">
                    <Image src={right_arrow} alt={`${title} link`} className="h-3.5 w-3.5 opacity-80" />
                </div>
            </Link>
        </div>
    );
}

export default InnerLink;
