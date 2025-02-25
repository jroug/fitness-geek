'use client';

import React, { useState, useEffect, useCallback, use } from "react";
import { useRouter } from 'next/navigation';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "@/components/Loading";
import CustomDateCell from '@/components/CustomDateCell';
import CustomTimeGutter from '@/components/CustomTimeGutter';
import CustomEvent from '@/components/CustomEvent';
import { adjustTime } from "@/lib/adjustTime";

const localizer = momentLocalizer(moment);

const getPublicCalendarData = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-public-calendar-data`;
const checkUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/check-user-calendar-token`;




// interface CalendarPageProps {
//     params: { jr_token: string };
// }
type Params = Promise<{ jr_token: string }>

export default function CalendarPage(props: { params: Params }) {
    const params = use(props.params);
    const  jr_token  = params.jr_token; // Extract the token from params
 
    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [userWeightList, setUserWeightList] = useState<Record<string, string>>({});
    const [userWorkoutList, setUserWorkoutList] = useState<Record<string, UserWorkoutData>>({});
    
    const [loadingMeals, setLoadingMeals] = useState<boolean>(true);
    const [userDisplayName, setUserDisplayName] = useState<string>('');
    const router = useRouter();

    const getUserMealsANDNameFromToken = useCallback(async (): Promise<void> => {
        try {
            const res = await fetch(`${getPublicCalendarData}?jr_token=${jr_token}`, { method: 'GET' });
            const data: CalendarData = await res.json();

            setUserDisplayName( data.user_display_name ? data.user_display_name : '' );

            if (!data || !data.meals_list || data.meals_list.length === 0) {
                setUserWorkoutList({});
                setUserWeightList({});
                setUserMealsList([]);
                setLoadingMeals(false);
                return;
            }

            const groupedData = data.meals_list.reduce((acc, item) => {
                const mealDateTime = moment(item.datetime_of_meal).format("YYYY-MM-DD hh A");
                if (!acc[mealDateTime]) acc[mealDateTime] = [];
                acc[mealDateTime].push({
                    id:'0',
                    start: moment(item.datetime_of_meal).toDate(),
                    end: moment(item.datetime_of_meal).add(30, 'minutes').toDate(),
                    title: `${item.food_name} ${item.meal_quantity_type === 'GR' ? item.meal_quantity + 'gr' : ' - ' + Math.round(item.meal_quantity * item.serving_size) + 'gr'}`,
                    category: item.category
                });
                return acc;
            }, {} as Record<string, MealGrouped[]>);

            const transformedMealData: MealEvent[] = Object.values(groupedData).map((group) => ({
                id: '',
                title: moment(group[0].start).format("hh:mm a"),
                meals: group.map(event => ({ id: event.id, f_title: event.title, f_category: event.category || "" })),
                start: adjustTime(group[0].start),
                end: group[0].end,
            }));

            const transformedWeightData: Record<string, string> = {};
            data.weight_list.forEach((val) => {
                transformedWeightData[moment(val.date_of_weighing).format("YYYY-MM-DD")] = `${val.weight}kg @${moment(val.date_of_weighing).format("hh:mma")}`;
            });

            const transformedWorkoutData: Record<string, UserWorkoutData> = {};
            data.workout_list.forEach((val) => {
                transformedWorkoutData[moment(val.date_of_workout).format("YYYY-MM-DD")] = {
                    id:0,
                    w_title: val.w_title,
                    w_type: `${val.w_type} @${moment(val.date_of_workout).format("hh:mma")}`,
                    date_of_workout: val.date_of_workout
                };
            });

            setUserWorkoutList(transformedWorkoutData);
            setUserWeightList(transformedWeightData);
            setUserMealsList(transformedMealData);
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
            <div className="fixed w-full left-0 top-10" >
                <h2 className="text-center font-bold text-2xl publish-btn-wrapper mx-auto" >{userDisplayName} Diet Calendar</h2>
            </div>
            <div className="calendar-main-wrapper top-110px" >
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
                            min={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0, 0)}
                            max={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 0)}
                            components={{
                                event: CustomEvent,  
                                dateCellWrapper: (props) => <CustomDateCell {...props} weightData={userWeightList} workoutData={userWorkoutList}/>, 
                                timeGutterWrapper: CustomTimeGutter,  
                            }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

 
