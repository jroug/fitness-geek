'use client';
import React, { useEffect, useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const Page = () => {
    const [logoutStatus, setLogoutStatus] = useState({
        title: 'Logging out...',
        message: 'Please wait while we log you out.',
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/logout', {
                    method: 'POST',
                });

                if (res.ok) {
                    setLogoutStatus({
                        title: 'You are logged out',
                        message: 'Session closed successfully. See you next workout.',
                    });
                } else {
                    setLogoutStatus({
                        title: 'Logout Failed',
                        message: 'Something went wrong. Please try again.',
                    });
                }
            } catch (error) {
                console.error('Logout request failed:', error);
                setLogoutStatus({
                    title: 'Error',
                    message: 'Network error occurred. Please check your connection.',
                });
            }
        })();
    }, []);

    return (
        <main className="site-content full-width bg-slate-50 !pt-0">
            <PublicHeader />
            <section className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 md:px-6">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Fitness Geek</p>
                    <h1 className="mt-2 text-2xl font-bold md:text-3xl">Logout</h1>
                    <p className="mt-2 text-sm text-cyan-100">Managing account session status.</p>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 md:p-10">
                    <h2 className="text-3xl font-bold text-slate-900">{logoutStatus.title}</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-slate-600">{logoutStatus.message}</p>
                </div>
            </section>
            <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
                <PublicFooter />
            </section>
        </main>
    );
};

export default Page;
