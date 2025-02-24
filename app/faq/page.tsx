import React from 'react';

import Header from "../../components/Header";

export default async function faq() {

    // server side component no need to call node API
    const fetchFaqPageDataUrl = `${process.env.WORDPRESS_API_URL}/wp/v2/pages?slug=faqs&_fields=id,title,content`;
    const response = await fetch(fetchFaqPageDataUrl);
    const data = await response.json();
    const pageData = data[0];
    const pageDataContent = pageData.content.rendered.split("\n\n\n\n");

    return (
        <main className="site-content">

            {/* <Preloader /> */}
            <Header backUrl="/homepage" title="FAQS"  />
 
            {/* <!-- Faq screen start --> */}
            <div className="verify-email pb-20" id="faq-main">
                <div className="container">
                    <div className="faq-full-sec mt-16">
                        <h1 className="hidden">Faq</h1>
                        <div className='page-content'>
                            <div className='nested-custom-accordion'>
                                <h1 className="boder-top font-bold">Questions</h1>
                                <div className="custom-accordion">
                                    {pageDataContent.map((element: string, index: number, array: string[]) =>  (
                                        index % 2 === 0 && (
                                            <div className="custom-accordion-item rounded-12" key={index}>
                                                <input
                                                    type="checkbox"
                                                    id={"item" + index}
                                                    className="custom-accordion-toggle"
                                                />
                                                <label
                                                    htmlFor={"item" + index}
                                                    className="custom-accordion-label border-green-1 rounded-12"
                                                    dangerouslySetInnerHTML={{ __html: element }}
                                                ></label>
                                                {index + 1 < array.length && (
                                                    <div
                                                        className="custom-accordion-content"
                                                        dangerouslySetInnerHTML={{ __html: array[index + 1] }}
                                                    ></div>
                                                )}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>	
                </div>
            </div>
            {/* <!-- Faq screen start --> */}
        </main>
    );
}