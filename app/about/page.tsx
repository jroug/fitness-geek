import React from 'react';

import Header from '@/components/Header';
import SimpleContent from '@/components/SimpleContent';

export default async function about() {

   
 
    const fetchPageDataUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.WORDPRESS_API_URL}/wp/v2/pages?slug=about&_fields=id,title,content`;
    const response = await fetch(fetchPageDataUrl);
    const data = await response.json();
    const pageData = data[0];
    const pageTitle = pageData.title.rendered;
    const pageContent = pageData.content.rendered;

 
    return (
        <main className="site-content">
            <Header backUrl="/settings" title={pageTitle}  />
            <SimpleContent pageContent={pageContent} />
        </main>
    );
}