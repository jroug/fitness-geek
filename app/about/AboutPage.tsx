import React from 'react';
import SimpleContent from '@/components/SimpleContent';

export default  function AboutPage({ pageTitle, pageContent }: { pageTitle: string; pageContent: string }) {

    return (
        <>
            <main className="site-content">
                <SimpleContent pageContent={pageContent} />
            </main>
        </>
    );
}
