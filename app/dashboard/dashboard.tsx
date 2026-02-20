'use client';

import React, { useMemo } from 'react';
import Loading from '@/components/Loading';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SlickCustomNextArrow from '../../components/SlickCustomNextArrow';
import SlickCustomPrevArrow from '../../components/SlickCustomPrevArrow';
import calendarThumb from '../../public/images/homescreen/cal-thumb.png';
import chartThumb from '../../public/images/homescreen/chart-thumb.png';
import workoutImage from '../../public/images/workout-complete/workout.png';
import minutesImage from '../../public/images/workout-complete/minutes.png';
import kcalImage from '../../public/images/workout-complete/kcal.png';
import useSWR from 'swr';
import { profileDataSWRFetcher, profileDataSWRKey } from '@/lib/profileDataSWR';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

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

type Trend = 'up' | 'down' | 'same';

const Dashboard = () => {
    const twoWeeksRange = useMemo(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 13);
        const toISODate = (date: Date) => date.toISOString().split('T')[0];
        return {
            startDate: toISODate(start),
            endDate: toISODate(end),
        };
    }, []);

    const settings = {
        slidesToScroll: 1,
        autoplay: false,
        swipeToSlide: true,
        infinite: true,
        dots: false,
        arrows: true,
        variableWidth: true,
        nextArrow: <SlickCustomNextArrow />,
        prevArrow: <SlickCustomPrevArrow />,
    };

    const {
        data: profileDataWithStats,
        error: profileError,
        isLoading: isProfileLoading,
    } = useSWR<ProfileDataWithStats>(profileDataSWRKey, (url) => profileDataSWRFetcher<ProfileDataWithStats>(url), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 300000,
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

    const { data: twoWeekWeights = [], isLoading: isTwoWeekWeightsLoading } = useSWR<UserWeighingData[]>(
        `/api/get-weighing-data?startDate=${twoWeeksRange.startDate}&endDate=${twoWeeksRange.endDate}`,
        (url) => fetcher<UserWeighingData[]>(url),
        {
            dedupingInterval: 60_000,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const twoWeekWeightChartData = useMemo(() => {
        if (!twoWeekWeights.length) return null;

        const sorted = [...twoWeekWeights].sort(
            (a, b) => new Date(String(a.date_of_weighing)).getTime() - new Date(String(b.date_of_weighing)).getTime()
        );

        const labels = sorted.map((item) => {
            const d = new Date(String(item.date_of_weighing));
            return Number.isNaN(d.getTime())
                ? String(item.date_of_weighing)
                : d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        });

        const values = sorted.map((item) => Number(item.weight));

        return {
            labels,
            datasets: [
                {
                    label: 'Weight (kg)',
                    data: values,
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.2)',
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    borderWidth: 3,
                    tension: 0.35,
                    fill: true,
                },
            ],
        };
    }, [twoWeekWeights]);

    const isLoading = isProfileLoading || isWorkoutsLoading;
    const hasError = profileError || workoutsError;

    if (isLoading || hasError) {
        return <Loading />;
    }

    const displayName =
        profileDataWithStats?.first_name && profileDataWithStats?.last_name
            ? `${profileDataWithStats.first_name} ${profileDataWithStats.last_name}`
            : profileDataWithStats?.user_name || '';

    const calcAgeFromDOB = (dobString: string): number | null => {
        const dob = new Date(dobString);
        if (Number.isNaN(dob.getTime())) return null;
        const diffMs = Date.now() - dob.getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const formatDateDDMMYYYY = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const lastWeeklyAvgWeight = profileDataWithStats?.fitness_stats?.last_weekly_avg_weight || 0;
    const thisWeeklyAvgWeight = profileDataWithStats?.fitness_stats?.this_weekly_avg_weight || 0;
    const weeklyWorkoutsCount = profileDataWithStats?.fitness_stats?.weekly_workouts_count || 0;

    const bodycompDate = profileDataWithStats?.fitness_stats?.bodycomp_date || '';
    const bodyFatPercent = profileDataWithStats?.fitness_stats?.bodycomp_fat_percent || 0;
    const bodyFatMass = profileDataWithStats?.fitness_stats?.bodycomp_fat || 0;
    const visceralFat = profileDataWithStats?.fitness_stats?.bodycomp_fat_visceral || 0;
    const muscleMass = profileDataWithStats?.fitness_stats?.bodycomp_muscle || 0;
    const bodyWeight = profileDataWithStats?.fitness_stats?.bodycomp_weight || 0;
    const waist = profileDataWithStats?.fitness_stats?.bodycomp_waist || 0;

    const lastWeighingDate = profileDataWithStats?.fitness_stats?.last_weighing_date || '';
    const lastWeighing = profileDataWithStats?.fitness_stats?.last_weighing || 0;
    const thisWeekAvgGrade = profileDataWithStats?.fitness_stats?.this_week_avg_grade || 0;

    const lastWeighingDateIsToday = (() => {
        if (!lastWeighingDate) return false;
        const today = new Date();
        const weighingDate = new Date(lastWeighingDate);
        return (
            today.getFullYear() === weighingDate.getFullYear() &&
            today.getMonth() === weighingDate.getMonth() &&
            today.getDate() === weighingDate.getDate()
        );
    })();

    const daysFromLastWeighing = (() => {
        if (!lastWeighingDate) return null;
        const today = new Date();
        const weighingDate = new Date(lastWeighingDate);
        const diffTime = today.getTime() - weighingDate.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    })();

    const bodycompDateInfo = (() => {
        if (!bodycompDate) return null;
        const dateObj = new Date(bodycompDate);
        if (Number.isNaN(dateObj.getTime())) return null;
        const today = new Date();
        const diffTime = today.getTime() - dateObj.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return {
            dateLabel: formatDateDDMMYYYY(dateObj),
            diffDays,
        };
    })();

    const weightDiff = Math.round((thisWeeklyAvgWeight - lastWeeklyAvgWeight) * 100) / 100;
    const trend: Trend = weightDiff > 0 ? 'up' : weightDiff < 0 ? 'down' : 'same';

    const trendBadgeClasses: Record<Trend, string> = {
        up: 'text-rose-600 bg-rose-100',
        down: 'text-emerald-600 bg-emerald-100',
        same: 'text-slate-700 bg-slate-200',
    };

    const trendArrow: Record<Trend, string> = {
        up: '↑',
        down: '↓',
        same: '→',
    };

    const trendLabel: Record<Trend, string> = {
        up: 'Up',
        down: 'Down',
        same: 'Flat',
    };

    const twoWeekWeightChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: '#e2e8f0',
                },
                ticks: {
                    color: '#475569',
                },
            },
            y: {
                grid: {
                    color: '#e2e8f0',
                },
                ticks: {
                    color: '#475569',
                    callback: (value: string | number) => `${Number(value).toFixed(1)} kg`,
                },
            },
        },
    };

    const age = calcAgeFromDOB(profileDataWithStats?.date_of_birth || '');

    return (
        <div id="dashboard-main" className="dashboard-modern min-h-screen pb-28 ">
            <div className="dash-main-div mx-auto w-full px-4 md:px-8">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-10">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Fitness Geek Dashboard</p>
                    <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold leading-tight md:text-4xl">Hi, {displayName}</h1>
                            <p className="mt-2 text-sm text-cyan-100 md:text-base">
                                {age !== null ? `Age ${age}` : 'Age not set'}
                                {' · '}Stay consistent and track this week&apos;s progress.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/dashboard/add-workout"
                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
                            >
                                Log Workout
                            </Link>
                            <Link
                                href="/dashboard/add-weighing"
                                className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300"
                            >
                                Add Weighing
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-emerald-100 p-3">
                                <Image src={minutesImage} alt="Workout count" className="h-9 w-9" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Workouts This Week</p>
                                <p className="text-3xl font-bold text-slate-900">
                                    {weeklyWorkoutsCount}
                                    <span className="ml-1 text-lg font-medium text-slate-500">/4</span>
                                </p>
                            </div>
                        </div>
                    </article>
                    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-amber-100 p-3">
                                <Image src={kcalImage} alt="Average grade" className="h-9 w-9" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Average Grade This Week</p>
                                <p className="text-3xl font-bold text-slate-900">
                                    {thisWeekAvgGrade}
                                    <span className="ml-1 text-lg font-medium text-slate-500">/10</span>
                                </p>
                            </div>
                        </div>
                    </article>
                </section>

                <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-xl font-bold text-slate-900">Body Composition</h2>
                        <p className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                            {bodycompDateInfo
                                ? `Measured ${bodycompDateInfo.dateLabel} · ${bodycompDateInfo.diffDays} days ago`
                                : 'No recent measurement'}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                        {[
                            { label: 'Body Fat', value: bodyFatPercent, unit: '%' },
                            { label: 'Body Fat Mass', value: bodyFatMass, unit: 'kg' },
                            { label: 'Visceral Fat', value: visceralFat, unit: 'cm' },
                            { label: 'Muscle Mass', value: muscleMass, unit: 'kg' },
                            { label: 'Weight', value: bodyWeight, unit: 'kg' },
                            { label: 'Waist', value: waist, unit: 'cm' },
                        ].map((item) => (
                            <article key={item.label} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                <Image src={workoutImage} alt={item.label} className="mx-auto h-8 w-8" />
                                <p className="mt-3 text-center text-2xl font-bold text-slate-900">
                                    {item.value}
                                    <span className="ml-1 text-sm font-medium text-slate-500">{item.unit}</span>
                                </p>
                                <p className="mt-1 text-center text-sm text-slate-600">{item.label}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                    <h2 className="text-xl font-bold text-slate-900">Weight Progress</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <article className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="text-sm text-slate-500">Avg. Last Week</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{lastWeeklyAvgWeight} kg</p>
                        </article>
                        <article className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="text-sm text-slate-500">Avg. This Week</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{thisWeeklyAvgWeight} kg</p>
                        </article>
                        <article className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="text-sm text-slate-500">Weight Difference</p>
                            <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
                                {weightDiff} kg
                                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${trendBadgeClasses[trend]}`}>
                                    {trendArrow[trend]} {trendLabel[trend]}
                                </span>
                            </p>
                        </article>
                        <article className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="text-sm text-slate-500">Latest Weighing</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{lastWeighing} kg</p>
                            <p className="mt-1 text-sm text-slate-600">
                                {lastWeighingDateIsToday ? 'Today' : `${daysFromLastWeighing ?? 'No'} days ago`}
                            </p>
                        </article>
                    </div>
                    {!lastWeighingDateIsToday ? (
                        <div className="mt-5">
                            <Link
                                href="/dashboard/add-weighing"
                                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                            >
                                Add today&apos;s weighing
                            </Link>
                        </div>
                    ) : null}
                </section>

                <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                    <h2 className="text-xl font-bold text-slate-900">Last 2 Weeks Weight Chart</h2>
                    <p className="mt-1 text-sm text-slate-500">Daily weighing trend for the past 14 days.</p>
                    <div className="mt-4 h-[260px]">
                        {isTwoWeekWeightsLoading ? (
                            <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading chart...</div>
                        ) : twoWeekWeightChartData ? (
                            <Line data={twoWeekWeightChartData} options={twoWeekWeightChartOptions} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                No weighing data found for the last 2 weeks.
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                    <h2 className="text-xl font-bold text-slate-900">Workouts</h2>
                    <div className="mt-5">
                        <Slider {...settings}>
                            {workouts.map((workout, index) => (
                                <div key={workout.id} className="w-[280px] pr-3 md:w-[320px]">
                                    <Link href={`/dashboard/add-workout?workoutId=${workout.id}`}>
                                        <article className="flex h-[230px] flex-col rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-5 text-white transition hover:-translate-y-1 hover:shadow-xl">
                                            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">{`#${index + 1} ${workout.w_type}`}</p>
                                            <h3 className="mt-2 text-xl font-bold leading-tight">{workout.w_title}</h3>
                                            {workout.w_title !== workout.w_description ? (
                                                <p
                                                    className="mt-1 overflow-hidden text-sm text-slate-200"
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {workout.w_description}
                                                </p>
                                            ) : null}
                                            <div className="mt-auto flex gap-2 text-sm">
                                                <span className="rounded-full bg-white/15 px-3 py-1">{parseInt(workout.w_calories || '0', 10)} cal</span>
                                                <span className="rounded-full bg-white/15 px-3 py-1">{parseInt(workout.w_time || '0', 10)} min</span>
                                            </div>
                                        </article>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </section>

                <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                    <h2 className="text-xl font-bold text-slate-900">Calendar & Charts</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                        {[
                            { href: '/dashboard/calendar', label: 'Calendar', image: calendarThumb },
                            { href: '/dashboard/charts/weight', label: 'Weight', image: chartThumb },
                            { href: '/dashboard/charts/workouts', label: 'Workouts', image: chartThumb },
                            { href: '/dashboard/charts/grades', label: 'Grades', image: chartThumb },
                            { href: '/dashboard/charts/body-composition', label: 'Body Comp.', image: chartThumb },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-slate-200 transition hover:-translate-y-1 hover:bg-slate-100"
                            >
                                <Image src={item.image} alt={item.label} className="mx-auto h-[72px] w-auto" />
                                <p className="mt-2 text-sm font-semibold text-slate-800">{item.label}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
