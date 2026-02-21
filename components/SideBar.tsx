'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import header_logo from "../public/images/logo/fitness-geek-logo-fresh.svg";
import dashBoardIcon from '../public/images/setting/setting4.svg';
import calendarIcon from '@/public/svg/calendar-icon.svg';
import weightIcon from '@/public/svg/weight.svg';
import mealIcon from '@/public/svg/add-meal-blue.svg';
// import workoutHeartIcon from '@/public/svg/workout-heart-icon.svg';
import workoutHeartIcon from '@/public/svg/add-workout.svg';
import chartIcon from '../public/images/setting/setting5.svg';
import goalsIcon from '@/public/svg/goals-icon.svg';
import achievementsIcon from '@/public/svg/achievements-icon.svg';
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

const SIDEBAR_DIVIDER_INDEXES = [1, 5, 6, 8];

const SideBar = () => {

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
                key: 'calendar',
                label: 'Calendar',
                href: '/dashboard/calendar',
                icon: calendarIcon,
            },
            {
                key: 'add-body-composition',
                label: 'Body Composition',
                href: '/dashboard/add-body-composition',
                icon: setting6,
            },
            {
                key: 'add-weighing',
                label: 'Weighing',
                href: '/dashboard/add-weighing',
                icon: weightIcon,
            },
            {
                key: 'add-meal',
                label: 'Meal',
                href: '/dashboard/add-meal',
                icon: mealIcon,
            },
            {
                key: 'add-workout',
                label: 'Workout',
                href: '/dashboard/add-workout',
                icon: workoutHeartIcon,
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
                key: 'goals',
                label: 'Goals',
                icon: goalsIcon,
                children: [
                    { key: 'goals-weight', label: 'Weight', href: '/dashboard/goals/weight' },
                    { key: 'goals-workouts', label: 'Workouts', href: '/dashboard/goals/workouts' },
                    { key: 'goals-bodyfat', label: 'Body Fat', href: '/dashboard/goals/bodyfat' },
                    { key: 'goals-muscle', label: 'Muscle', href: '/dashboard/goals/muscle' },
                ],
            },
            {
                key: 'achievements',
                label: 'Achievements',
                href: '/dashboard/achievements',
                icon: achievementsIcon,
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
        if (window.innerWidth>=600)
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
                <div className="mb-8 flex items-center justify-between border-b border-white/20 pb-3">
                    <Link href={"/dashboard"}>
                        <Image src={header_logo} alt="Fitness Geek logo" className="header-logo-img sidebar-logo" />
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
                    {menuItems.map((item, index) => {
                        const isDropdown = Array.isArray(item.children) && item.children.length > 0;
                        const isOpen = !!openDropdowns[item.key];
                        const activeItem = isItemActive(item);

                        if (isDropdown) {
                            return (
                                <React.Fragment key={item.key}>
                                    <div className="rounded-xl border-white/15 bg-white/5">
                                        <button
                                            type="button"
                                            onClick={() => handleDropDownClick(item.key)}
                                            className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                                                activeItem ? 'bg-white/15' : 'hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                                <Image src={item.icon} alt={item.label} className="h-[26px] w-[26px]" />
                                            </div>
                                            <span className="flex-1 text-base font-normal text-black">{item.label}</span>
                                            <span
                                                className={`transition-transform duration-200 text-black ${
                                                    isOpen ? 'rotate-180' : ''
                                                }`}
                                                aria-hidden="true"
                                            >
                                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                                                    <path
                                                        d="M5 7.5L10 12.5L15 7.5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
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
                                {SIDEBAR_DIVIDER_INDEXES.includes(index) ? (
                                    <div className="my-2 pt-[1px] bg-[#e5e7eb]" aria-hidden="true"></div>
                                ) : null}
                                    </div>
                                </React.Fragment>
                            );
                        }

                        return (
                            <React.Fragment key={item.key}>
                                <Link
                                    href={item.href ?? '#'}
                                    onClick={closeSidebarFromMenuItem}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2 transition hover:text-[#2a86bb] ${
                                        activeItem
                                            ? 'border-cyan-300/40 bg-cyan-300/15 text-[#2a86bb]'
                                            : 'border-white/15 bg-white/5 hover:bg-white/10 text-black '
                                    }`}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ">
                                        <Image src={item.icon} alt={item.label} className="h-[26px] w-[26px]" />
                                    </div>
                                    <span className="text-base font-normal  ">{item.label}</span>
                                </Link>
                                {SIDEBAR_DIVIDER_INDEXES.includes(index) ? (
                                    <div className="my-2 pt-[1px] bg-[#e5e7eb]" aria-hidden="true"></div>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
};

export default SideBar;
