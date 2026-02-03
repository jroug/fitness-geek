'use client';

import React from 'react';
import Loading from '@/components/Loader';
import Image from "next/image";
import Link from 'next/link';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import body_muscles from "../../public/images/homescreen/muscles/body-muscles.png";
import SlickCustomNextArrow from "../../components/SlickCustomNextArrow";
import SlickCustomPrevArrow from "../../components/SlickCustomPrevArrow";
import calendar_thumb from '../../public/images/homescreen/cal-thumb.png';

import useSWR from 'swr';


const fetcher = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch data');
    return (await res.json()) as T;
};

type ProfileData = {
    first_name?: string;
    last_name?: string;
    user_name?: string;
    user_registered?: string;
};

type UserWorkoutData = {
    id: string | number;
    w_type: string;
    w_title: string;
    w_description: string;
    w_calories?: string;
    w_time?: string;
};

const Homepage = () => {


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

    // get the data of the page
    const {
        data: profileData,
        error: profileError,
        isLoading: isProfileLoading,
    } = useSWR<ProfileData>('/api/profile-data', (url) => fetcher<ProfileData>(url), {
        dedupingInterval: 60_000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const {
        data: workouts = [],
        error: workoutsError,
        isLoading: isWorkoutsLoading,
    } = useSWR<UserWorkoutData[]>('/api/get-all-workouts', (url) => fetcher<UserWorkoutData[]>(url), {
        dedupingInterval: 60_000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const isLoading = isProfileLoading || isWorkoutsLoading;
    const hasError = profileError || workoutsError;

    if (isLoading || hasError) {
        return (
            <Loading />
        );
    }

    const registeredRaw = profileData?.user_registered;
    const dateObj = registeredRaw ? new Date(registeredRaw) : null;
    const user_registered_formatted = dateObj && !Number.isNaN(dateObj.getTime())
        ? `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'short' })} ${dateObj.getFullYear()}`
        : '';

    const display_name =
        profileData?.first_name && profileData?.last_name
            ? `${profileData.first_name} ${profileData.last_name}`
            : profileData?.user_name || '';

    return (
        <>
            <div className="verify-email" id="homescreen-main">
                <div className="home-bottom-content mt-24">
                    <div className="home-first container mx-8">
                        <h1>{display_name},</h1>
                        {profileError || workoutsError ? (
                            <p className="mt-8" style={{ fontSize: 12 }}>
                                Failed to load some data.
                            </p>
                        ) : null}
                        {user_registered_formatted ? (
                            <span>Registration: {user_registered_formatted}</span>
                        ) : null}

                    </div>
 

                    <div className="home-section-first">
                        <h2 className="text-left container mx-8">Workouts for you</h2>
                        <div className="home-slider-wrap mt-16" >
                            <Slider {...settings}  >
                                {/* <!-- slide start --> */}
                                {
                                    workouts.map((workout: UserWorkoutData, index: number) => (
                                        <div className="workout-details" key={workout.id}>
                                            <Link href={`/workouts?workoutId=${workout.id}`}>
                                                <div className="verify-email-img-sec ">
                                                    <div className="main-img-top">
                                                        <div className="palceholder-1"></div> 
                                                    </div>
                                                    <div className="workout-plan-ready-details">
                                                        <h3 className="md-font-sans fw-700 color-white">{(index+1) + '. ' + workout.w_type}</h3>
                                                        <h3 className="md-font-sans fw-700 color-green">{workout.w_title}</h3>
                                                        <h4 className="md-font-sans fw-700 color-green">{workout.w_title===workout.w_description ? "" : workout.w_description}</h4>
                                                        <p>{parseInt(workout.w_calories || '0')} cal </p>
                                                        <p>{parseInt(workout.w_time || '0')} min</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                }
                                {/* <!-- slide end --> */}
                            </Slider>
                        </div>
                    </div>
                    <div className="home-section-second">
                        <h2 className="text-left container mx-8">Calendar</h2>
                        <Link href="/calendar">
                            <Image src={calendar_thumb} alt="calendar-thumb" className="block max-w-[300px] mt-2 mx-auto" />
                        </Link>
                    </div>
                    <div className="home-section-third">
                        <h2 className="text-left container mx-8">Body focus areas</h2>
                        <div className="home-second-wrap mt-12">
                            <div className="focus-content shoulder-redirect">
                                <div className="small-img"><Image src={body_muscles} alt="body-img" className="shoulders"/></div>
                                <p className="mt-8 color-black">Shoulders</p>	
                            </div>
                            <div className="focus-content shoulder-redirect">
                                <div className="small-img"><Image src={body_muscles} alt="body-img" className="chest" /></div>
                                <p className="mt-8 color-black">Chest</p>	
                            </div>
                            <div className="focus-content shoulder-redirect">
                                <div className="small-img"><Image src={body_muscles} alt="body-img" className="legs" /></div>
                                <p className="mt-8 color-black">Legs</p>	
                            </div>
                        </div>
                        <div className="home-second-wrap mt-12">
                            <div className="focus-content shoulder-redirect">
                                <div className="small-img"><Image src={body_muscles} alt="body-img" className="back" /></div>
                                <p className="mt-8 color-black">Back</p>	
                            </div>
                            <div className="focus-content shoulder-redirect">
                                <div className="small-img"><Image src={body_muscles} alt="body-img" className="arms" /></div>
                                <p className="mt-8 color-black">Arms</p>	
                            </div>
                            <div className="focus-content shoulder-redirect">
                                <div className="small-img"><Image src={body_muscles} alt="body-img" className="stomach" /></div>
                                <p className="mt-8 color-black">Stomach</p>	
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Homepage;