import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import left_arrow from "../public/svg/black-left-arrow.svg";
import settings_icon from "../public/svg/setting-icon.svg";

const Header = (props) => {

    const header_title = props.title ? props.title : null;
    const header_back_url = props.backUrl ? props.backUrl : null;
    const header_settings_url = props.settingsUrl ? props.settingsUrl : null;
 
    return (     
        <header id="top-header" className="border-0">
            <div className="header-wrap">
                {
                    header_back_url!==null
                    ?
                        <div className="header-back">
                            <Link href={header_back_url}>
                                <Image src={left_arrow} alt="back-btn-icon" />
                            </Link>
                        </div>
                    :
                        <></>
                }

                {
                    header_title!==null
                    ?
                        <div className="header-name">
                            <p className="sm-font-zen fw-400">{header_title}</p>
                        </div>
                    :
                        <></>
                }

                {
                    header_settings_url!==null
                    ?
                        <div className="home-setting">
                            <Link href={header_settings_url}  >
                                <Image src={settings_icon} alt="setting-icon" />
                            </Link>
                        </div>
                    :
                        <></>
                }
            </div>
        </header>
    );
};

export default Header;