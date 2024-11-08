'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "@/components/Loading";
import CustomTimeGutter from '@/components/CustomTimeGutter';

const localizer = momentLocalizer(moment);

const getPublicCalendarData = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-public-calendar-data`;
const checkUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/check-user-calendar-token`;

interface MealEvent {
    start: Date;
    end: Date;
    title: string;
}

interface CalendarPageProps {
    params: {
      jr_token: string;
    }
}

const CalendarPage: React.FC<CalendarPageProps> = ({ params }) => {

    const { jr_token } = params;

    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [loadingMeals, setLoadingMeals] = useState<boolean>(true);
    const [userDisplayName, setUserDisplayName] = useState<string>('');
    const router = useRouter();

    const getUserMealsANDNameFromToken = useCallback(async (): Promise<void> => {
        try {
            const res = await fetch(getPublicCalendarData + '?jr_token=' + jr_token, { method: 'GET' });
            const data = await res.json();
            setUserDisplayName(data.user_display_name);
            // Check if data exists and is not empty
            if (!data.meals_list || data.meals_list.length === 0) {
                setUserMealsList([]); // Set an empty list if no meals are found
                setLoadingMeals(false); // Stop loading
                return;
            }

            const transformedData: MealEvent[] = data.meals_list.map((item: { datetime_of_meal: moment.MomentInput; food_name: string; }) => ({
                start: moment(item.datetime_of_meal).toDate(),
                end: moment(item.datetime_of_meal).add(30, 'minutes').toDate(),
                title: item.food_name,
            }));
            
            setUserMealsList(transformedData);
            setLoadingMeals(false);
        } catch (error) {
            console.error("Error fetching user meals:", error);
        }
    }, [jr_token]);

    useEffect(() => {
        async function getCalendarData() {
            try {
                const res = await fetch(checkUserCalendarTokenUrl + '?jr_token=' + jr_token, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                if (data.jr_token === "valid") {
                    getUserMealsANDNameFromToken();
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error("Error checking calendar token:", error);
            }
        }
        getCalendarData();
    }, [router, jr_token, getUserMealsANDNameFromToken]);

    if (loadingMeals) {
        return <Loading />;
    }

    const currentDate = new Date();
        
    return (
        <main className="site-content">
            <div className="text-center font-bold text-2xl publish-btn-wrapper mt-4">
                <h2>{userDisplayName} Diet Calendar</h2>
            </div>
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
                        min={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0, 0)}
                        max={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 0)}
                        components={{
                            timeGutterWrapper: CustomTimeGutter,
                        }}
                    />
                </div>
            </div>
        </main>
    );
};

export default CalendarPage;
