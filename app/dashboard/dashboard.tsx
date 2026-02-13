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
import chart_thumb from '../../public/images/homescreen/chart-thumb.png';
import workout_image from "../../public/images/workout-complete/workout.png";
import minutes_image from "../../public/images/workout-complete/minutes.png";
import kcal_image from "../../public/images/workout-complete/kcal.png";

import useSWR from 'swr';
// import { format } from 'path/win32';
// import { formatDate } from '@/lib/formatDate';


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

const Dashboard = () => {


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

    const formatDateDDMMYYYY = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const last_weekly_avg_weight = profileDataWithStats?.fitness_stats?.last_weekly_avg_weight || 0; // Placeholder for average weight calculation
    const this_weekly_avg_weight = profileDataWithStats?.fitness_stats?.this_weekly_avg_weight || 0; // Placeholder for average weight calculation
    const weekly_workouts_count = profileDataWithStats?.fitness_stats?.weekly_workouts_count || 0;
    
    const bodycomp_date = profileDataWithStats?.fitness_stats?.bodycomp_date || '';
    const body_fat_percent = profileDataWithStats?.fitness_stats?.bodycomp_fat_percent || 0;
    const visceral_fat = profileDataWithStats?.fitness_stats?.bodycomp_fat_visceral || 0;
    const muscle_mass = profileDataWithStats?.fitness_stats?.bodycomp_fat || 0;
    const body_weight = profileDataWithStats?.fitness_stats?.bodycomp_weight || 0;
    const waist = profileDataWithStats?.fitness_stats?.bodycomp_waist || 0;

    const last_weighing_date = profileDataWithStats?.fitness_stats?.last_weighing_date || ''; // d//m//yyy
    
    const last_weighing = profileDataWithStats?.fitness_stats?.last_weighing || 0;

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

    const bodycomp_date_info = (() => {
        if (!bodycomp_date) return null;
        const dateObj = new Date(bodycomp_date);
        if (isNaN(dateObj.getTime())) return null;
        const today = new Date();
        const diffTime = today.getTime() - dateObj.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return {
            dateLabel: formatDateDDMMYYYY(dateObj),
            diffDays,
        };
    })();

    const this_week_avg_grade = profileDataWithStats?.fitness_stats?.this_week_avg_grade || 0;


    const weightDiff = Math.round((this_weekly_avg_weight - last_weekly_avg_weight) * 100) / 100;

    type Trend = 'up' | 'down' | 'same';

    const trend: Trend =
    weightDiff > 0 ? 'up' :
    weightDiff < 0 ? 'down' :
    'same';

    return (
        <>
            <div className="verify-email" id="homescreen-main">
                <div className="home-bottom-content mt-16">
                    <div className="home-section-zero">
                        <h1 className="mx-8">{display_name}, Age {calcAgeFromDOB(profileDataWithStats?.date_of_birth || '')}</h1>
                        <div className="home-first home-container">
                            <div className="workout-wrap flex-wrap gap-3 mt-16 mx-auto">
                                <div className="workout-first w-1/2 border-light-green  text-center">
                                    <Image src={minutes_image} className="mx-auto" alt="workout-img" />
                                    <h2>{weekly_workouts_count}<span className="text-[12px] leading-[10px]" >/4</span></h2>
                                    <p># Workouts <br/> This Week</p>
                                </div>
                                <div className="workout-first w-1/2 border-yellow text-center">
                                    <Image src={kcal_image} className="mx-auto" alt="kcal-img" />
                                    <h2>{this_week_avg_grade}<span className="text-[12px] leading-[10px]" >/10</span></h2>
                                    <p>AVG. Grade <br/> This Week</p>
                                </div>
                                {/* <div className={`workout-first w-[25%] border-magenta text-center`}>
                                    <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                    <h2>{body_fat_percent}<span className="text-[12px] leading-[10px]" >%</span></h2>
                                    <p><br/>Body Fat </p>
                                </div>
                                <div className={`workout-first w-[25%] border-magenta text-center`}>
                                    <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                    <h2>{muscle_mass}<span className="text-[12px] leading-[10px]" >Kg</span></h2>
                                    <p><br/>Muscle Mass </p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="home-section-first">
                        <h2 className="text-left  mx-8">Body Composition</h2>
                        <p className="w-full text-center font-bold">
                            Measurement: {bodycomp_date_info ? bodycomp_date_info.dateLabel : '—'}
                            {bodycomp_date_info ? ` before ${bodycomp_date_info.diffDays} days` : ''}
                        </p>
                        <div className="home-first home-container">
                            <div className="workout-wrap flex-wrap gap-3 mt-16 mx-auto">
 
                                <div className={`workout-first w-1/2 md:w-1/3 lg:w-1/5 border-magenta text-center`}>
                                    <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                    <h2>{body_fat_percent}<span className="text-[12px] leading-[10px]" >%</span></h2>
                                    <p>Body Fat </p>
                                </div>
                                <div className={`workout-first w-1/2 md:w-1/3 lg:w-1/5 border-magenta text-center`}>
                                    <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                    <h2>{visceral_fat}<span className="text-[12px] leading-[10px]" >cm</span></h2>
                                    <p>Visceral Fat </p>
                                </div>
                                <div className={`workout-first w-1/2 md:w-1/3 lg:w-1/5 border-magenta text-center`}>
                                    <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                    <h2>{muscle_mass}<span className="text-[12px] leading-[10px]" >Kg</span></h2>
                                    <p>Muscle Mass </p>
                                </div>
                                <div className={`workout-first w-1/2 md:w-1/3 lg:w-1/5 border-magenta text-center`}>
                                    <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                    <h2>{body_weight}<span className="text-[12px] leading-[10px]" >Kg</span></h2>
                                    <p>Weight </p>
                                </div>
                                <div className={`workout-first w-1/2 md:w-1/3 lg:w-1/5 border-magenta text-center`}>
                                    <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                    <h2>{waist}<span className="text-[12px] leading-[10px]" >cm</span></h2>
                                    <p>Weist </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="home-section-first">
                        <h2 className="text-left  mx-8">Weight Progress</h2>
                        <div className="home-container workout-wrap flex-wrap gap-3 mt-16 mx-auto">
                            <div className="workout-first w-1/2 lg:w-1/4 border-blue text-center ">
                                <Image src={workout_image} className="mx-auto " alt="workout-img" />
                                <h2>{last_weekly_avg_weight}<span className="text-[12px]">Kg</span></h2>
                                <p>AVG. <br/>Last Week</p>
                            </div>
                            <div className={`workout-first w-1/2 lg:w-1/4 border-blue text-center`}>
                                <Image src={workout_image} className="mx-auto " alt="workout-img" />
                                <h2>{this_weekly_avg_weight}<span className="text-[12px]">Kg</span></h2>
                                <p>AVG. <br/>This Week</p>
                            </div>
                            <div className={`workout-first w-1/2 lg:w-1/4 border-trend-${trend} text-center`}>
                                <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                <h2>{weightDiff}<span className="text-[12px] leading-[10px]" >Kg
                                    <span className={`trend-arrow ${trend}`}>
                                            {trend === 'up' && '↑'}
                                            {trend === 'down' && '↓'}
                                            {trend === 'same' && '→'}
                                    </span></span></h2>
                                <p><br/>Weigt Diff</p>
                            </div>
                            <div className={`workout-first w-1/2 lg:w-1/4 border-magenta text-center`}>
                                <Image src={workout_image} className="mx-auto" alt="workout-img" />
                                <h2>{last_weighing}<span className="text-[12px] leading-[10px]" >Kg</span></h2>
                                <p><br/>{last_weighing_date_is_today ? 'Today' : `${days_from_last_weiing} days ago`}</p>
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
                        <h2 className="text-left mx-8">Workouts</h2>
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
                                                        <h4 className="md-font-sans fw-700 color-green">{workout.w_title}</h4>
                                                        <h5 className="md-font-sans fw-700 color-green">{workout.w_title===workout.w_description ? "" : workout.w_description}</h5>
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
                        <h2 className="text-left mx-8">Calendar - Charts</h2>
                        <div className='grid grid-cols-2 home-container calendar md:grid-cols-5 mt-16' > 
                            <Link href="/calendar" className="">
                                <Image src={calendar_thumb} alt="calendar-thumb" className="calendar-img block mx-auto" /> 
                                <p>Calendar</p>
                            </Link>
                            <Link href="/charts/weight" className="" >
                                <Image src={chart_thumb} alt="calendar-thumb" className="block max-w-[180px] mx-auto" /> 
                                <p>Weight</p>
                            </Link>
                            <Link href="/charts/workouts" className="">
                                <Image src={chart_thumb} alt="calendar-thumb" className="block max-w-[180px] mx-auto" /> 
                                <p>Workouts</p>
                            </Link>
                            <Link href="/charts/grades" className="" >
                                <Image src={chart_thumb} alt="calendar-thumb" className="block max-w-[180px]  mx-auto" /> 
                                <p>Grades</p>
                            </Link>
                            <Link href="/charts/body-composition" className="" >
                                <Image src={chart_thumb} alt="calendar-thumb" className="block max-w-[180px]  mx-auto" /> 
                                <p className="!top-[55px]" >Body <br/>Comp.</p>
                            </Link>
                        </div>
                    </div>
                    <div className="home-section-third">
                        <h2 className="text-left mx-8">Body focus areas</h2>
                        <div className="home-second-wrap  mt-16">
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
                        <div className="home-second-wrap  mt-12">
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

export default Dashboard;
