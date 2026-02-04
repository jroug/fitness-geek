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
import workout_image from "../../public/images/workout-complete/workout.png";
import minutes_image from "../../public/images/workout-complete/minutes.png";
import kcal_image from "../../public/images/workout-complete/kcal.png";

import useSWR from 'swr';
// import { format } from 'path/win32';
import { formatDate } from '@/lib/formatDate';


const fetcher = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch data');
    return (await res.json()) as T;
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
        data: profileDataWithStats,
        error: profileError,
        isLoading: isProfileLoading,
    } = useSWR<ProfileDataWithStats>('/api/profile-data?include_fitness_stats=1', (url) => fetcher<ProfileDataWithStats>(url), {
        provider: () => new Map(),
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
 
    const display_name =
        profileDataWithStats?.first_name && profileDataWithStats?.last_name
            ? `${profileDataWithStats.first_name} ${profileDataWithStats.last_name}`
            : profileDataWithStats?.user_name || '';
 
    const calcAgeFromDOB = (dobString: string): number | null => {
        const dob = new Date(dobString);
        if (isNaN(dob.getTime())) {
            return null; // Invalid date
        }
        const diffMs = Date.now() - dob.getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const last_weekly_avg_weight = profileDataWithStats?.fitness_stats?.last_weekly_avg_weight || 0; // Placeholder for average weight calculation
    const this_weekly_avg_weight = profileDataWithStats?.fitness_stats?.this_weekly_avg_weight || 0; // Placeholder for average weight calculation
    const weekly_workouts_count = profileDataWithStats?.fitness_stats?.weekly_workouts_count || 0;
    const avgGrade =   0; // Placeholder for average grade calculation
    const last_weighing_date = profileDataWithStats?.fitness_stats?.last_weighing_date || ''; // d//m//yyy
    
    const last_weighing = profileDataWithStats?.fitness_stats?.last_weighing || 0;
    const formattedLastWeighingDate = last_weighing_date
        ? formatDate(last_weighing_date) 
        : '';

    const last_weighing_date_is_today = (() => {
        if (!last_weighing_date) return false;
        const today = new Date();
        const weighingDate = new Date(last_weighing_date);
        return (
            today.getFullYear() === weighingDate.getFullYear() &&
            today.getMonth() === weighingDate.getMonth() &&
            today.getDate() === weighingDate.getDate()
        );
    })();

    const days_from_last_weiing = (() => {
        if (!last_weighing_date) return null;
        const today = new Date();
        const weighingDate = new Date(last_weighing_date);
        const diffTime = today.getTime() - weighingDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    })();

    const this_week_avg_grade = profileDataWithStats?.fitness_stats?.this_week_avg_grade || 0;
    
    return (
        <>
            <div className="verify-email" id="homescreen-main">
                <div className="home-bottom-content mt-24">
                    <div className="home-first container">
                        <h1 className="mx-8">{display_name}, Age {calcAgeFromDOB(profileDataWithStats?.date_of_birth || '')}</h1>
   
                        <h2 className="text-[20px] text-center font-main">This week</h2>
                        <div className="workout-wrap mt-16 max-w-[600px] mx-auto">
                            <div className="workout-first border-green text-center">
                                <Image src={minutes_image} className="mx-auto" alt="workout-img" />
                                <h2>{weekly_workouts_count}</h2>
                                <p># Workouts </p>
                            </div>
                            <div className="workout-first border-yellow text-center">
                                <Image src={kcal_image} className="mx-auto" alt="kcal-img" />
                                <h2>{this_week_avg_grade}</h2>
                                <p>AVG. Grade </p>
                            </div>
                        </div>
                    </div>
 
                    <div className="home-section-first">
                        <h2 className="text-left container mx-8">Weight Progress</h2>
                        <div className="workout-wrap mt-16 max-w-[600px] mx-auto">
                            <div className="workout-first border-red text-center">
                                <Image src={workout_image} className="mx-auto translate-x-[-5px]" alt="workout-img" />
                                <h2>{last_weekly_avg_weight}<span>Kg</span></h2>
                                <p>AVG. last week</p>
                            </div>
                            <div className="workout-first border-red text-center">
                                <Image src={workout_image} className="mx-auto translate-x-[-5px]" alt="workout-img" />
                                <h2>{this_weekly_avg_weight}<span>Kg</span></h2>
                                <p>AVG. current week</p>
                            </div>
                            <div className="workout-first border-blue text-center">
                                <Image src={workout_image} className="mx-auto translate-x-[-5px]" alt="workout-img" />
                                <h2>{last_weighing}<span>Kg</span></h2>
                                <p>{last_weighing_date_is_today ? 'Today' : `${days_from_last_weiing} days ago`}</p>
                            </div>
                        </div>
                        {!last_weighing_date_is_today  ? (
                            <div className="green-btn mt-4 max-w-[320px] mx-auto">
                                <Link href="/add-weighing" type="submit" className="bg-blue-500 text-white py-2 rounded-full">ADD</Link>
                            </div>
                        ) : (
                            <></>
                        )}

                    </div>
                    <div className="home-section-first">
                        <h2 className="text-left container mx-8">Workouts</h2>
                        <div className="home-slider-wrap mt-16" >
                            <Slider {...settings}  >
                                {/* <!-- slide start --> */}
                                {
                                    workouts.map((workout: UserWorkoutData, index: number) => (
                                        <div className="workout-details" key={workout.id}>
                                            <Link href={`/add-workout?workoutId=${workout.id}`}>
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