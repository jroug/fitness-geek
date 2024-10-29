 
'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Header from "../../../components/Header";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "../../../components/Loading";


const localizer = momentLocalizer(moment);

const checkAuthFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/check-auth`;
const userMealsFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-user-meals`;

interface MealEvent extends Event {
    start: Date;
    end: Date;
    title: string;
}

const Calendar_page = () => {

    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {

        // Fetch user authentication status from an API endpoint (session, cookies)
        async function getUserMeals() {
            
            // alert(checkAuthFetchUrl);
            const res = await fetch(checkAuthFetchUrl, {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });
 
            if (res.ok) {
                // User is authenticated, allow access to the page
                await fetch(userMealsFetchUrl, {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                })
                .then((res) => res.json())
                .then((data) => {
                    const transformedData = data.map((item: { datetime_of_meal: moment.MomentInput; food_name: string; }) => ({
                        start: moment(item.datetime_of_meal).toDate(),
                        end: moment(item.datetime_of_meal).add(70, 'minutes').toDate(),
                        title: item.food_name,
                    })) as MealEvent[]; // Cast transformedData as MealEvent[]
                    // console.log(transformedData);
                    setUserMealsList(transformedData)
                    setLoading(false)
                });

            } else {
                // User is not authenticated, redirect to login
                router.push('/');
            }
        }

        getUserMeals();
    }, [router]);

    if (loading) {
        return <Loading />; // Display a loading state while checking authentication
    }

    return (
        <main className="site-content">
            <Header title="Meals Calendar" backUrl="/homepage" />
            <div className="verify-email pb-20" id="calendar-main">
                <div className="container">
                <Calendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="week"
                    events={ userMealsList }
                />
                </div>
            </div>
        </main>
    )
}
 

export default Calendar_page;