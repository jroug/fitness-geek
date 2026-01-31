import React from 'react';
// import settingImg from "@/public/images/main-img/setting-img.png";
// import fitnessGeekLogo from "@/public/images/logo/fitness-geek-logo.png";
import fitnessGeekLogo from "@/public/images/logo/fitness-geek-logo-boomer.png";
import Image from 'next/image';

interface SimpleContentProps {
    pageContent: string;
}

const SimpleContent: React.FC<SimpleContentProps> = ({ pageContent }) => {
    return (
        <div className="verify-email pb-20" id="about-us">
            <div className="container mx-auto">
                <div className="about-us-section-wrap">
                    <div className="about-us-screen-full border-b-2 border-gray-200 mt-4">
                        <div className="max-w-4xl mx-auto bg-white rounded-lg mt-4 mb-6">
                            <div className="setting-bottom-img p-0 mt-16">
                                <div className="verify-email-img-sec">
                                    <div className="main-img-top main-img-top-logo">
                                        <Image src={fitnessGeekLogo} alt="notification-img" />
                                    </div>
                                </div>
                            </div>
                            <div className="page-content mt-4" dangerouslySetInnerHTML={{ __html: pageContent }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SimpleContent;
