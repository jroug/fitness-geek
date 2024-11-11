'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "@/components/Loading";
import CustomTimeGutter from '@/components/CustomTimeGutter';
import Link from "next/link";
import { adjustTime } from "../../../lib/adjustTime";

const localizer = momentLocalizer(moment);

const checkAuthFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/check-auth`;
const userMealsFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-user-meals`;
const getUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-user-calendar-token`;
const createUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/create-user-calendar-token`;
const deleteUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/delete-user-calendar-token`;

interface MealEvent {
    start: Date;
    end: Date;
    title: string;
}

interface UserMealData {
    datetime_of_meal: moment.MomentInput;
    food_name: string;
}

interface TokenResponse {
    jr_token: string;
}

 

const CalendarHomePage: React.FC = () => {
    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [loadingMeals, setLoadingMeals] = useState<boolean>(true);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
    const [isPublished, setIsPublished] = useState<boolean>(false);
    const [jrTokenFromDb, setJrTokenFromDb] = useState<string>('');
    const router = useRouter();

    const handlePublishingCalendar = async (): Promise<void> => {
        if (isPublished) {
            await unpublishCalendar();
        } else {
            await publishCalendar();
        }
    };

    const unpublishCalendar = async (): Promise<void> => {
        const response = await fetch(deleteUserCalendarTokenUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (data.deleted === 'ok') {
            setIsPublished(false);
            setJrTokenFromDb('');
        } else {
            alert(data.message);
        }
    };

    const publishCalendar = async (): Promise<void> => {
        const response = await fetch(createUserCalendarTokenUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const data: TokenResponse = await response.json();
        if (data.jr_token) {
            setIsPublished(true);
            setJrTokenFromDb(data.jr_token);
        } else {
            alert("Error publishing calendar");
        }
    };

    const getCalendarStatus = async (): Promise<void> => {
        const response = await fetch(getUserCalendarTokenUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (data[0]?.jr_token) {
            setIsPublished(true);
            setJrTokenFromDb(data[0].jr_token);
        } else {
            setIsPublished(false);
        }
        setLoadingStatus(false);
    };

    const getUserMeals = async (): Promise<void> => {
        const response = await fetch(userMealsFetchUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const data: UserMealData[] = await response.json();
        
        if (!data || data.length === 0) {
            setUserMealsList([]);
            setLoadingMeals(false);
            return;
        }

        const groupedData = data.reduce((acc, item) => {
            const mealDateTime = moment(item.datetime_of_meal).format("YYYY-MM-DD hh A");
            if (!acc[mealDateTime]) acc[mealDateTime] = [];
            acc[mealDateTime].push({
                start: moment(item.datetime_of_meal).toDate(),
                end: moment(item.datetime_of_meal).add(30, 'minutes').toDate(),
                title: item.food_name,
            });
            return acc;
        }, {} as Record<string, MealEvent[]>);

        const transformedData: MealEvent[] = Object.values(groupedData).map((group) => ({
            title: ' ----- ' + moment(group[0].start).format("h:mm a") + ' ----- ' + group.map(event => event.title).join(', '),
            start: adjustTime(group[0].start),
            end: group[0].end,
        }));

        setUserMealsList(transformedData);
        setLoadingMeals(false);
    };

    useEffect(() => {
        const getCalendarData = async () => {
            const res = await fetch(checkAuthFetchUrl, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                await getUserMeals();
                await getCalendarStatus();
            } else {
                router.push('/');
            }
        };
        getCalendarData();
    }, [router]);

    if (loadingMeals || loadingStatus) {
        return <Loading />;
    }

    const calendarPageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/meals/calendar/${jrTokenFromDb}`;
    
    return (
        <main className="site-content">
            <Header title="Meals Calendar" backUrl="/homepage" />
            <div className="flex items-center publish-btn-wrapper mt-4">
                <div className="flex-auto">
                    <h2>Status: <b>{isPublished ? 'Published' : 'Not Published'}</b></h2>
                </div>
                <button type="button" className="green-btn" onClick={handlePublishingCalendar}>
                    {isPublished ? 'Unpublish' : 'Publish'}
                </button>
            </div>
            <br />
            {isPublished && (
                <p>
                    <span>Public URL: </span>
                    <Link href={calendarPageUrl} target="_blank" style={{ textDecoration: "underline" }}>
                        {calendarPageUrl}
                    </Link>
                </p>
            )}
            <div className="pb-20 mt-5" id="calendar-main">
                <div className="container">
                    <Calendar
                        localizer={localizer}
                        defaultDate={new Date()}
                        defaultView="week"
                        events={userMealsList}
                        views={{ day: true, week: true }}
                        step={150}
                        timeslots={1}
                        min={new Date(new Date().setHours(9, 0))}
                        max={new Date(new Date().setHours(23, 59))}
                        components={{
                            timeGutterWrapper: CustomTimeGutter,
                        }}
                    />
                </div>
            </div>
        </main>
    );
};

export default CalendarHomePage;
