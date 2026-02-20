'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import header_logo from "../public/images/logo/fitness-geek-logo-fresh.svg";
import setting1 from '../public/images/setting/setting1.svg';
import dashBoardIcon from '../public/images/setting/setting4.svg';
import calendarIcon from '@/public/svg/calendar-icon.svg';
import chartIcon from '../public/images/setting/setting5.svg';
import setting6 from '../public/images/setting/setting6.svg';
import setting11 from '../public/images/setting/setting11.svg';
import close_icon from '../public/svg/close-icon.svg';


type MenuChild = {
    key: string;
    label: string;
    href: string;
};

type MenuItem = {
    key: string;
    label: string;
    href?: string;
    icon: StaticImageData;
    children?: MenuChild[];
};

const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems: MenuItem[] = useMemo(
        () => [
            {
                key: 'dashboard',
                label: 'Dashboard',
                href: '/dashboard',
                icon: dashBoardIcon,
            },
            {
                key: 'add-meal',
                label: 'Add Meal',
                href: '/dashboard/add-meal',
                icon: setting6,
            },
            {
                key: 'add-weighing',
                label: 'Add Weighing',
                href: '/dashboard/add-weighing',
                icon: setting6,
            },
            {
                key: 'add-body-composition',
                label: 'Add Body Composition',
                href: '/dashboard/add-body-composition',
                icon: setting6,
            },
            {
                key: 'add-workout',
                label: 'Add Workout',
                href: '/dashboard/add-workout',
                icon: setting1,
            },
            {
                key: 'calendar',
                label: 'Calendar',
                href: '/dashboard/calendar',
                icon: calendarIcon,
            },
            {
                key: 'charts',
                label: 'Charts',
                icon: chartIcon,
                children: [
                    { key: 'charts-weight', label: 'Weight Chart', href: '/dashboard/charts/weight' },
                    { key: 'charts-workouts', label: 'Workouts Chart', href: '/dashboard/charts/workouts' },
                    { key: 'charts-grades', label: 'Grades Chart', href: '/dashboard/charts/grades' },
                    { key: 'charts-bodyfat', label: 'Body Composition', href: '/dashboard/charts/body-composition' },
                ],
            },
            {
                key: 'about',
                label: 'About Fitness Geek',
                href: '/dashboard/about',
                icon: setting11,
            }
        ],
        []
    );

    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // console.log('useEffect sidebar');
        document.body.classList.add('open-sidebar');
        return () => {
            document.body.classList.remove('open-sidebar');
        };
    }, []);

    const closeSidebar = () => {
        document.body.classList.remove('open-sidebar');
    };

    const closeSidebarFromMenuItem = () => {
        if (window.innerWidth <= 768) { // desktop
            document.body.classList.remove('open-sidebar');
            return;
        }
    };


    const handleDropDownClick = (key: string) => {
        setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isItemActive = (item: MenuItem) => {
        if (item.href) return pathname === item.href;
        if (item.children?.length) return item.children.some((child) => pathname === child.href);
        return false;
    };

    return (
        <div className="menu-sidebar details !z-20">
            <aside className="h-full rounded-r-3xl from-slate-900 via-sky-900 to-cyan-800 p-4 text-slate-100 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-white/20 pb-3">
                    <Link href={"/dashboard"}>
                        <Image src={header_logo} alt="Fitness Geek logo" className="header-logo-img" />
                    </Link>
                    <button
                        type="button"
                        onClick={closeSidebar}
                        className="rounded-lg bg-white/10 px-2 py-1 text-base font-semibold text-black transition hover:bg-white/20"
                        aria-label="Close sidebar"
                    >
                        <Image src={close_icon} alt="Close" className="h-5 w-5" />
                    </button>
                </div>

                <nav className="max-h-[calc(100vh-110px)] space-y-2 overflow-y-auto pr-1">
                    {menuItems.map((item) => {
                        const isDropdown = Array.isArray(item.children) && item.children.length > 0;
                        const isOpen = !!openDropdowns[item.key];
                        const activeItem = isItemActive(item);

                        if (isDropdown) {
                            return (
                                <div key={item.key} className="rounded-xl border-white/15 bg-white/5">
                                    <button
                                        type="button"
                                        onClick={() => handleDropDownClick(item.key)}
                                        className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                                            activeItem ? 'bg-white/15' : 'hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                            <Image src={item.icon} alt={item.label} className="h-[23px] w-[23px]" />
                                        </div>
                                        <span className="flex-1 text-base font-normal text-black">{item.label}</span>
                                        <span
                                            className={`text-lg leading-none text-cyan-100 transition-transform ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                        >
                                            ˅
                                        </span>
                                    </button>
                                    {isOpen ? (
                                        <ul className="space-y-1 px-3 pb-3">
                                            {item.children!.map((child) => {
                                                const activeChild = pathname === child.href;
                                                return (
                                                    <li key={child.key}>
                                                        <Link
                                                            href={child.href}
                                                            onClick={closeSidebarFromMenuItem}
                                                            className={`block rounded-lg px-3 py-2 text-base transition ml-[40px] ${
                                                                activeChild
                                                                    ? 'border-cyan-300/40 bg-cyan-300/15 text-[#2a86bb]'
                                                                    : 'border-white/15 bg-white/5 hover:bg-white/10 text-black '
                                                            }`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : null}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.key}
                                href={item.href ?? '#'}
                                onClick={closeSidebarFromMenuItem}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition hover:text-[#2a86bb] ${
                                    activeItem
                                        ? 'border-cyan-300/40 bg-cyan-300/15 text-[#2a86bb]'
                                        : 'border-white/15 bg-white/5 hover:bg-white/10 text-black '
                                }`}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ">
                                    <Image src={item.icon} alt={item.label} className="h-[23px] w-[23px]" />
                                </div>
                                <span className="text-base font-normal  ">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
};

export default SideBar;
