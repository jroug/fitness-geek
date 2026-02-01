'use client';

import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import left_arrow from "../public/svg/black-left-arrow.svg";
import settings_icon from "../public/svg/setting-icon.svg";
import header_logo from "../public/images/splashscreen/header-logo.png";

interface HeaderProps {
    title?: string;
    backUrl?: string;
    homeUrl?: string;
}


const Header: React.FC<HeaderProps> = ({ title, backUrl, homeUrl }) => {

    const handleHomeSettingsClick = () => {
        const sidebar = document.querySelector('.menu-sidebar') as HTMLElement;
        if (sidebar){ // sidebar is in a diffrent component so it needs to exist
            document.body.classList.toggle('open-sidebar');
        }
    }

    const handleOverlayClick = () => {
        const sidebar = document.querySelector('.menu-sidebar') as HTMLElement;
        if (sidebar){ // sidebar is in a diffrent component so it needs to exist
            document.body.classList.remove('open-sidebar');
        }
    }
 
    return (  
        <>   
            <div className="header-overlay" onClick={handleOverlayClick}></div>
            <header id="top-header" >
                <div className="header-wrap">

                    {homeUrl && (
                        <div className="header-logo-home">
                            <Link href={homeUrl}>
                                <Image src={header_logo} alt="back-btn-icon" />
                            </Link>
                        </div>
                    )}

                    {backUrl && (
                        <div className="header-back">
                            <Link href={backUrl}>
                                <Image src={left_arrow} alt="back-btn-icon" className="scale13" />
                            </Link>
                        </div>
                    )}

                    {title && (
                        <div className="header-name">
                            <p className="sm-font-zen fw-400">{title}</p>
                        </div>
                    )}

                    <div className="home-setting">
                        <Link href="#" onClick={handleHomeSettingsClick} ><Image src={settings_icon} alt="setting-icon" className="scale13"/></Link>
                    </div>
                </div>
            </header>
        </>
 
        
    );
}

export default Header;
