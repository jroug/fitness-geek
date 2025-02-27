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
                        title: 'Hasta lasagna.',
                        message: "You're all safe and logged out. Enjoy the rest of your day.",
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
    }, []); // Runs only on mount

    return (
        <main className="site-content">
            <PublicHeader />
            <div className="verify-email pb-20" id="logout">
                <div className="container mx-auto">
                    <div className="about-us-section-wrap">
                        <div className="border-b-2 border-gray-200">
                            <div className="logout-screen-full flex flex-col justify-center max-w-4xl mx-auto bg-white rounded-lg">
                                <h2 className="text-4xl font-bold text-gray-900 mb-6 mt-4 text-center">
                                    {logoutStatus.title}
                                </h2>
                                <p className="text-center">
                                    {logoutStatus.message}
                                </p>
                            </div>
                        </div>
                        <PublicFooter />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;