import React from 'react';
import settingImg from "@/public/images/main-img/setting-img.png";
import Image from 'next/image';


const SimpleContent = (props) => {
    
    const pageTitle = props.pageTitle;
    const pageContent = props.pageContent;

    return (
        <div className="verify-email pb-20" id="about-us">
            <div className="container mx-auto">
                <div className="about-us-section-wrap">
                    <div className="about-us-screen-full border-b-2 border-gray-200 mt-4" >
                        <div className="max-w-4xl mx-auto bg-white rounded-lg mt-4 mb-6">
                            {/* <h2 className="text-4xl font-bold text-gray-900 mb-6 mt-4">{pageTitle}</h2> */}
                            <div className="setting-bottom-img p-0 mt-16">
                                <div className="verify-email-img-sec">
                                    <div className="main-img-top">
                                        <Image src={settingImg} alt="notification-img" />
                                    </div>
                                </div>
                            </div>
                            <div className="page-content mt-4" dangerouslySetInnerHTML={{__html:pageContent}}></div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default SimpleContent;