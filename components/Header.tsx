'use client';

import React from 'react';
import Image from "next/image";
import Link from 'next/link';
// import left_arrow from "../public/svg/black-left-arrow.svg";
import burger_menu_icon from "../public/svg/burger-menu.svg";
import calendar_icon from '@/public/svg/calendar-icon.svg';
import HeaderProfileMenu from '@/components/HeaderProfileMenu';
// import header_logo from "../public/images/logo/fitness-geek-logo-fresh.svg";

const Header: React.FC = () => {
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
                    <div className="home-setting relative !z-10">
                        <button type="button" onClick={handleHomeSettingsClick} aria-label="Open sidebar">
                            <Image src={burger_menu_icon} alt="menu-icon" className="h-5 w-5"/>
                        </button>
                    </div>
                    <div className="ml-auto mr-2 flex items-center gap-2">
                        <Link
                            href="/calendar"
                            aria-label="Go to calendar"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 p-2 transition hover:bg-slate-200"
                        >
                            <Image src={calendar_icon} alt="calendar-shortcut-icon" className="h-5 w-5" />
                        </Link>
                        <HeaderProfileMenu />
                    </div>
                </div>
            </header>
        </>
 
        
    );
}

export default Header;
