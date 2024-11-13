'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { checkAuthAndRedirect } from "@/lib/checkAuthAndRedirect";
import Header from "@/components/Header";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "@/components/Loading";
import CustomDateCell from '@/components/CustomDateCell';
import CustomTimeGutter from '@/components/CustomTimeGutter';
import CustomEvent from '@/components/CustomEvent';
import Link from "next/link";
import { adjustTime } from "@/lib/adjustTime";

const localizer = momentLocalizer(moment);

const calendarDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-calendar-data`;
const getUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-user-calendar-token`;
const createUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/create-user-calendar-token`;
const deleteUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/delete-user-calendar-token`;

interface MealEvent {
    start: Date;
    end: Date;
    title: string;
    meals?: string[];
}

interface UserMealData {
    datetime_of_meal: moment.MomentInput;
    food_name: string;
    serving_size: number;
    meal_quantity: number;
    meal_quantity_type: string;
}

interface UserWeightData {
    date_of_weighing: moment.MomentInput;
    weight: string;
}

interface UserWorkoutData {
    date_of_workout: moment.MomentInput;
    w_title: string;
    w_type: string;
}

interface CalendarData {
    meals_list: UserMealData[];
    weight_list: UserWeightData[];
    workout_list: UserWorkoutData[];
}

interface TokenResponse {
    jr_token: string;
    deleted?: string;
    message?: string;
}

const CalendarHomePage: React.FC = () => {
    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [userWeightList, setUserWeightList] = useState<Record<string, string>>({});
    const [userWorkoutList, setUserWorkoutList] = useState<Record<string, UserWorkoutData>>({});
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
        const data: TokenResponse = await response.json();
        if (data.deleted === 'ok') {
            setIsPublished(false);
            setJrTokenFromDb('');
        } else if (data.message) {
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

    const getCalendarData = async (): Promise<void> => {
        const response = await fetch(calendarDataFetchUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const data: CalendarData = await response.json();

        if (!data || !data.meals_list || data.meals_list.length === 0) {
            setUserWorkoutList({});
            setUserWeightList({});
            setUserMealsList([]);
            setLoadingMeals(false);
            return;
        }

        // User meal data
        const groupedData = data.meals_list.reduce((acc, item) => {
            const mealDateTime = moment(item.datetime_of_meal).format("YYYY-MM-DD hh A");
            if (!acc[mealDateTime]) acc[mealDateTime] = [];
            acc[mealDateTime].push({
                start: moment(item.datetime_of_meal).toDate(),
                end: moment(item.datetime_of_meal).add(30, 'minutes').toDate(),
                title: `${item.food_name} ${item.meal_quantity_type === 'GR' ? item.meal_quantity + 'gr' : ' - ' + Math.round(item.meal_quantity * Number(item.serving_size)) + 'gr'}`,
            });
            return acc;
        }, {} as Record<string, MealEvent[]>);

        const transformedMealData: MealEvent[] = Object.values(groupedData).map((group) => ({
            title: moment(group[0].start).format("hh:mm a"),
            meals: group.map(event => event.title),
            start: adjustTime(group[0].start),
            end: group[0].end,
        }));

        // User weight data
        const transformedWeightData: Record<string, string> = {};
        data.weight_list.forEach((val) => {
            transformedWeightData[moment(val.date_of_weighing).format("YYYY-MM-DD")] = `${val.weight}kg @${moment(val.date_of_weighing).format("hh:mma")}`;
        });

        // User workout data
        const transformedWorkoutData: Record<string, UserWorkoutData> = {};
        data.workout_list.forEach((val) => {
            transformedWorkoutData[moment(val.date_of_workout).format("YYYY-MM-DD")] = {
                w_title: val.w_title,
                w_type: `${val.w_type} @${moment(val.date_of_workout).format("hh:mma")}`,
                date_of_workout: val.date_of_workout,
            };
        });

        setUserWorkoutList(transformedWorkoutData);
        setUserWeightList(transformedWeightData);
        setUserMealsList(transformedMealData);
        setLoadingMeals(false);
    };

    useEffect(() => {
        const prepareCalendar = async () => {
            const ret = await checkAuthAndRedirect(router);
            if (ret === true) {
                await getCalendarData();
                await getCalendarStatus();
            }
        };
        prepareCalendar();
    }, [router]);

    if (loadingMeals || loadingStatus) {
        return <Loading />;
    }

    const calendarPageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/calendar/${jrTokenFromDb}`;

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
                            event: CustomEvent,  
                            dateCellWrapper: (props) => <CustomDateCell {...props} weightData={userWeightList} workoutData={userWorkoutList} />, 
                            timeGutterWrapper: CustomTimeGutter,  
                        }}
                    />
                </div>
            </div>
        </main>
    );
};

export default CalendarHomePage;
