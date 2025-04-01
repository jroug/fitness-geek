'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthAndRedirect } from "@/lib/checkAuthAndRedirect";
import Image from "next/image";
import Link from 'next/link';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import header_logo from "../../public/images/splashscreen/header-logo.png";
import settings_icon from "../../public/svg/setting-icon.svg";
import home1 from "../../public/images/homescreen/home1.png";
import bottom from "../../public/images/homescreen/bottom.png";
import shoulders from "../../public/images/homescreen/shoulders.png";

import Loading from "../../components/Loading";
import SlickCustomNextArrow from "../../components/SlickCustomNextArrow";
import SlickCustomPrevArrow from "../../components/SlickCustomPrevArrow";


import BottomBar from "../../components/BottomBar";
import SideBar from "../../components/SideBar";
 
const profileDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/profile-data`;

const Homepage = () => {

 
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        user_name: '',
        user_registered: '',
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {

      // Fetch user authentication status from an API endpoint (session, cookies)
      async function getProfileDataForHome() {
        
        const ret = await checkAuthAndRedirect(router, false); // will redirect to root if no token found on http cookie
            if (ret === true){
            // User is authenticated, allow access to the page
            await fetch(profileDataFetchUrl, {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            })
            .then((res) => res.json())
            .then((data) => {
                    setProfileData(data)
                    setLoading(false)
            });
            }
        }
  
      getProfileDataForHome();
    }, [router]);
  
    if (loading) {
      return <Loading />; // Display a loading state while checking authentication
    }

    const settings = {
        // slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        swipeToSlide: true,
        infinite:true,
        dots: false,
        arrows:true,
        variableWidth: true,
        nextArrow: <SlickCustomNextArrow />,
        prevArrow: <SlickCustomPrevArrow />,
    };

    const handleHomeSettingsClick = () => {
        const sidebar = document.querySelector('.menu-sidebar') as HTMLElement;

        sidebar.classList.toggle('active');
    }

    const display_name = 
        profileData?.first_name && profileData.last_name
        ? `${profileData.first_name} ${profileData.last_name}`
        : profileData?.user_name || '';

    // get the correct format for date
    const dateObj = new Date(profileData.user_registered);
    const day =  dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' }); // Months are zero-based
    const year = dateObj.getFullYear();

    // Format the date to dd.mm.yyyy
    const user_registered_formatted = `${day} ${month} ${year}`;

    return (
        <>
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
                            <Link href="#" onClick={handleHomeSettingsClick} ><Image src={settings_icon} alt="setting-icon" /></Link>
                        </div>
                    </div>
                </header>
                {/* <!-- Header end --> */}
                {/* <!-- Homescreen screen start --> */}
                <div className="verify-email" id="homescreen-main">
                    <div className="home-bottom-content mt-24">
                        <div className="home-first container mx-8">
                            <h1>Hi {display_name},</h1>
                            <span>Registration: {user_registered_formatted}</span>
                            <br/>
                            <span>Workout plan for you</span>
                        </div>
                        <h2 className="hidden">Homescreen</h2>
                        <div className="home-slider-wrap mt-16" >
                            <Slider {...settings}  >
                                {/* <!-- slide start --> */}
                                <div className="workout-details">
                                    <Link href="#">
                                        <div className="verify-email-img-sec ">
                                            <div className="main-img-top">
                                                <Image src={home1} priority={true} alt="notification-img" />
                                            </div>
                                            <div className="main-img-bottom">
                                                <Image src={bottom} priority={true} alt="notification-img" />
                                            </div>
                                            <div className="workout-plan-ready-details">
                                                <h3 className="md-font-sans fw-700 color-green">Daily Exercise</h3>
                                                <p>sssssssss  |  Beginner</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                {/* <!-- slide end --> */}
                                {/* <!-- slide start --> */}
                                <div className="workout-details">
                                    <Link href="#">
                                        <div className="verify-email-img-sec ">
                                            <div className="main-img-top">
                                                <Image src={home1} priority={true} alt="notification-img" />
                                            </div>
                                            <div className="main-img-bottom">
                                                <Image src={bottom} priority={true} alt="notification-img" />
                                            </div>
                                            <div className="workout-plan-ready-details">
                                                <h3 className="md-font-sans fw-700 color-green">Daily Exercise</h3>
                                                <p>sssssssss  |  Beginner</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                {/* <!-- slide end --> */}
                                {/* <!-- slide start --> */}
                                <div className="workout-details">
                                    <Link href="#">
                                        <div className="verify-email-img-sec ">
                                            <div className="main-img-top">
                                                <Image src={home1} priority={true} alt="notification-img" />
                                            </div>
                                            <div className="main-img-bottom">
                                                <Image src={bottom} priority={true} alt="notification-img" />
                                            </div>
                                            <div className="workout-plan-ready-details">
                                                <h3 className="md-font-sans fw-700 color-green">Daily Exercise</h3>
                                                <p>sssssssss  |  Beginner</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                {/* <!-- slide end --> */}
                            </Slider>
                        </div>
                    </div>
                    <div className="home-second">
                        <h2 className="text-left container mx-8">Body focus area</h2>
                        <div className="home-second-wrap mt-12">
                            <div className="focus-content shoulder-redirect">
                                <Image src={shoulders} alt="body-img" />
                                <p className="mt-8 color-black">Shoulders</p>	
                            </div>
                            <div className="focus-content shoulder-redirect">
                                <Image src={shoulders} alt="body-img" />
                                <p className="mt-8 color-black">Chest</p>	
                            </div>
                            <div className="focus-content shoulder-redirect">
                                <Image src={shoulders} alt="body-img" />
                                <p className="mt-8 color-black">Legs</p>	
                            </div>
                        </div>
                        <div className="home-second-wrap mt-12">
                            <div className="focus-content shoulder-redirect">
                                <Image src={shoulders} alt="body-img" />
                                <p className="mt-8 color-black">Back</p>	
                            </div>
                            <div className="focus-content shoulder-redirect">
                                <Image src={shoulders} alt="body-img" />
                                <p className="mt-8 color-black">Arms</p>	
                            </div>
                            <div className="focus-content shoulder-redirect">
                                <Image src={shoulders} alt="body-img" />
                                <p className="mt-8 color-black">Stomach</p>	
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Homescreen screen end --> */}
            </main>
            {/* <!-- Bottom tabbar content start --> */}
            <BottomBar />
            {/* <!-- Bottom tabbar content end --> */}
            {/* <!-- Side bar content start --> */}
            <SideBar />
            {/* <!-- Side bar content end --> */}
        </>
    );
};

export default Homepage;