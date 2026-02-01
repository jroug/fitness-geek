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
        <Link href={goToUrl} className="inner-link-wrap flex flex-row justify-end items-center mt-[20px]">
            <div className="flex">
                <div className="inner-link-name mr-[10px]">
                    <p className="sm-font-zen fw-400">{title}</p>
                </div>
                <div className="home-setting">
                    <Image src={right_arrow} alt="setting-icon" />
                </div>
            </div>
        </Link>
    );
}

export default InnerLink;
