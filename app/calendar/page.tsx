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
            
            const hour = Number(moment(item.datetime_of_meal).format("HHmm"));
            let mealDateTime = moment(item.datetime_of_meal).format("YYYY-MM-DD");
            if (hour < 900) { // Before 9am
                mealDateTime += "9 AM";
            } else if (hour < 1130) {  // Before 11:30am
                mealDateTime += "9 AM";
            } else if (hour < 1400) {  // Before 2pm 
                mealDateTime += "12 PM";
            } else if (hour < 1630) {  // Before 4:30pm
                mealDateTime += "2 PM";
            } else if (hour < 1900) {  // Before 7pm
                mealDateTime += "5 PM";
            } else if (hour < 2130) {  // Before 9:30pm
                mealDateTime += "7 PM";
            } else {
                mealDateTime += "10 PM";
            }
            // if ( moment(item.datetime_of_meal).format("YYYY-MM-DD") === "2025-02-26" ) {
            //     console.log('hour', hour);
            // }
            if (!acc[mealDateTime]) acc[mealDateTime] = [];
            acc[mealDateTime].push({
                id: String(item.ID),
                start: moment(item.datetime_of_meal).toDate(),
                end: moment(item.datetime_of_meal).add(30, 'minutes').toDate(),
                title: `${item.food_name} ${item.meal_quantity_type === 'GR' ? item.meal_quantity + 'gr' : ' - ' + Math.round(item.meal_quantity * Number(item.serving_size)) + 'gr'}`,
                category: item.category
            });
            return acc;
        }, {} as Record<string, MealGrouped[]>);
        // console.log(groupedData);
        const transformedMealData: MealEvent[] = Object.values(groupedData).map((group) => ({
            id: group.map(event => event.id).join(','), 
            title: moment(group[0].start).format("hh:mm a"),
            meals: group.map(event => ({ id: event.id, f_title: event.title, f_category: event.category || "" })),
            start: adjustTime(group[0].start),
            end: group[0].end,
        }));
        // console.log(transformedMealData);
        // User weight data
        const transformedWeightData: Record<string, string> = {};
        data.weight_list.forEach((val) => {
            transformedWeightData[moment(val.date_of_weighing).format("YYYY-MM-DD")] = `${val.weight}kg @${moment(val.date_of_weighing).format("hh:mma")}`;
        });

        // User workout data
        const transformedWorkoutData: Record<string, UserWorkoutData> = {};
        data.workout_list.forEach((val) => {
            transformedWorkoutData[moment(val.date_of_workout).format("YYYY-MM-DD")] = {
                id: val.id,
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
            <div className="fixed custom_margin" >
                <Header title="Calendar" backUrl="/homepage" />
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
                            click here!
                        </Link>
                    </p>
                )}
            </div>
            <div className="calendar-main-wrapper top-175px" >
                <div className="pb-20 calendar-main mx-auto" id="calendar-main">
                    <div className="padding-wrapper" >
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
                                event: (props) => <CustomEvent {...props} cameFrom="private" />,  
                                dateCellWrapper: (props) => <CustomDateCell {...props} weightData={userWeightList} workoutData={userWorkoutList} />, 
                                timeGutterWrapper: CustomTimeGutter,  
                            }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CalendarHomePage;
