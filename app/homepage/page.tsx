import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import header_logo from "../../public/images/splashscreen/header-logo.png";
import settings_icon from "../../public/svg/setting-icon.svg";

const homepage = () => {
    return (
        <main className="site-content">
            {/* <!-- Preloader start --> */}
            {/* <div className="preloader">
                <Image src="assets/images/favicon/preloader.gif" alt="preloader" />
            </div> */}
            {/* <!-- Preloader end --> */}

            {/* <!-- Header start --> */}
            <header id="top-header">
                <div className="header-wrap-home">
                    <div className="header-logo-home">
                        <Link href="#">
                            <Image src={header_logo} alt="back-btn-icon" />
                        </Link>
                    </div>
                    <div className="header-name">
                        <p className="sm-font-zen fw-400">FITNESS GEEK</p>
                    </div>
                    <div className="home-setting">
                        <Link href="#"><Image src={settings_icon} alt="setting-icon" /></Link>
                    </div>
                </div>
            </header>
            {/* <!-- Header end --> */}

        </main>
	 
    );
};

export default homepage;