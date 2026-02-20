import React from 'react';
// import settingImg from "@/public/images/main-img/setting-img.png";
// import fitnessGeekLogo from "@/public/images/logo/fitness-geek-logo.png";
import fitnessGeekLogo from "@/public/images/logo/fitness-geek-logo-fresh.svg";
import Image from 'next/image';

interface SimpleContentProps {
    pageContent: string;
}

const SimpleContent: React.FC<SimpleContentProps> = ({ pageContent }) => {
    return (
        <div className="min-h-[calc(100vh-120px)] pb-24" id="about-us">
            <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Fitness Geek</p>
                    <h1 className="mt-2 text-2xl font-bold md:text-3xl">About</h1>
                    <p className="mt-2 text-sm text-cyan-100">Learn more about our mission and approach.</p>
                </section>

                <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-8">
                    <div className="mx-auto max-w-3xl">
                        <div className="mx-auto mb-6 max-w-[260px]">
                            <Image src={fitnessGeekLogo} alt="Fitness Geek logo" />
                        </div>
                        <div
                            className="page-content text-slate-700 [&_a]:text-cyan-700 [&_a]:underline [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_p]:leading-7"
                            dangerouslySetInnerHTML={{ __html: pageContent }}
                        ></div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SimpleContent;
