'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import fitness_geek_logo from '@/public/images/logo/fitness-geek-logo-fresh.svg';

const PublicHeader = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <header id="top-header-public" className="bg-white py-4">
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
                <div className="flex items-center justify-between md:hidden">
                    <Link href="/">
                        <Image src={fitness_geek_logo} alt="Fitness Geek logo" className="h-10 w-auto" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700"
                    >
                        <span className="sr-only">Menu</span>
                        <span className="flex flex-col gap-1">
                            <span className="block h-[2px] w-5 bg-slate-700" />
                            <span className="block h-[2px] w-5 bg-slate-700" />
                            <span className="block h-[2px] w-5 bg-slate-700" />
                        </span>
                    </button>
                </div>

                {isMenuOpen ? (
                    <div className="relative z-[100] mt-3 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:hidden">
                        <nav className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                            <Link href="/" className="rounded-md px-2 py-1 transition hover:bg-slate-100">Home</Link>
                            <Link href="/features" className="rounded-md px-2 py-1 transition hover:bg-slate-100">Features</Link>
                            <Link href="/contact" className="rounded-md px-2 py-1 transition hover:bg-slate-100">Contact</Link>
                        </nav>
                        <div className="h-px bg-slate-200" />
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <Link href="/users/enter" className="text-slate-700 transition hover:text-cyan-700">Login</Link> |
                            <Link href="/users/join" className="text-slate-700 transition hover:text-cyan-700">Register</Link>
                        </div>
                    </div>
                ) : null}

                <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
                    <div className="flex justify-start">
                        <Link href="/">
                            <Image src={fitness_geek_logo} alt="Fitness Geek logo" className="h-12 w-auto" />
                        </Link>
                    </div>

                    <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
                        <Link href="/" className="transition hover:text-cyan-700">Home</Link>
                        <Link href="/features" className="transition hover:text-cyan-700">Features</Link>
                        <Link href="/contact" className="transition hover:text-cyan-700">Contact</Link>
                    </nav>

                    <div className="flex items-center justify-end gap-4 text-sm font-medium">
                        <Link href="/users/enter" className="text-slate-700 transition hover:text-cyan-700">Login</Link>
                        <span className="text-slate-400">|</span>
                        <Link href="/users/join" className="text-slate-700 transition hover:text-cyan-700">Register</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;
