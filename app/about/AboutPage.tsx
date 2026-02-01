import React from 'react';
import Header from '@/components/Header';
import SimpleContent from '@/components/SimpleContent';
import SideBar from '@/components/SideBar';

export default  function AboutPage({ pageTitle, pageContent }: { pageTitle: string; pageContent: string }) {

    return (
        <>
            <main className="site-content">
                <Header backUrl="/homepage" title={pageTitle}  />
                <SimpleContent pageContent={pageContent} />
            </main>
            <SideBar />
        </>
    );
}