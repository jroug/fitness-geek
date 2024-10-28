import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import left_arrow from "../public/svg/black-left-arrow.svg";
import settings_icon from "../public/svg/setting-icon.svg";

interface HeaderProps {
    title?: string;
    backUrl?: string;
    settingsUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ title, backUrl, settingsUrl }) => {
    return (     
        <header id="top-header" className="border-0">
            <div className="header-wrap">
                {backUrl && (
                    <div className="header-back">
                        <Link href={backUrl}>
                            <Image src={left_arrow} alt="back-btn-icon" />
                        </Link>
                    </div>
                )}

                {title && (
                    <div className="header-name">
                        <p className="sm-font-zen fw-400">{title}</p>
                    </div>
                )}

                {settingsUrl && (
                    <div className="home-setting">
                        <Link href={settingsUrl}>
                            <Image src={settings_icon} alt="setting-icon" />
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
