'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "@/components/Loading";
import CustomTimeGutter from '@/components/CustomTimeGutter';
import { adjustTime } from "@/lib/adjustTime";

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
    };
}

interface MealData {
    datetime_of_meal: string;
    food_name: string;
}

interface CalendarData {
    user_display_name: string;
    meals_list: MealData[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ params }) => {
    const { jr_token } = params;

    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [loadingMeals, setLoadingMeals] = useState<boolean>(true);
    const [userDisplayName, setUserDisplayName] = useState<string>('');
    const router = useRouter();

    const getUserMealsANDNameFromToken = useCallback(async (): Promise<void> => {
        try {
            const res = await fetch(`${getPublicCalendarData}?jr_token=${jr_token}`, { method: 'GET' });
            const data: CalendarData = await res.json();

            setUserDisplayName(data.user_display_name);

            if (!data.meals_list || data.meals_list.length === 0) {
                setUserMealsList([]);
                setLoadingMeals(false);
                return;
            }

            const groupedData = data.meals_list.reduce((acc, item) => {
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
                title: ' ----- ' + moment(group[0].start).format("h:mm a") + ' ----- ' + group.map(event => event.title).join(' '),
                start: adjustTime(group[0].start),
                end: group[0].end,
            }));

            setUserMealsList(transformedData);
            setLoadingMeals(false);
        } catch (error) {
            console.error("Error fetching user meals:", error);
        }
    }, [jr_token]);

    useEffect(() => {
        const getCalendarData = async () => {
            try {
                const res = await fetch(`${checkUserCalendarTokenUrl}?jr_token=${jr_token}`, {
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
        };
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
