import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import fitness_geek_logo from '@/public/images/logo/fitness-geek-logo-fresh.svg';

const PublicHeader = () => {
    return (     
        <header id="top-header-public" className="bg-white py-4">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6">
                <div className="flex justify-start">
                    <Link href="/" >
                        <Image src={fitness_geek_logo} alt="Fitness Geek logo" className="h-12 w-auto" />
                    </Link>
                </div>

                <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
                    <Link href="/" className="transition hover:text-cyan-700">Home</Link>
                    <Link href="/features" className="transition hover:text-cyan-700">Features</Link>
                    <Link href="/contact" className="transition hover:text-cyan-700">Contact</Link>
                </nav>

                <div className="flex items-center justify-end gap-4 text-sm font-medium">
                    <Link href="/users/enter" className="text-slate-700 transition hover:text-cyan-700">Login</Link>|
                    <Link href="/users/join" className="text-slate-700 transition hover:text-cyan-700">Register</Link>
                </div>
            </div>
        </header>
    );
}

export default PublicHeader;
