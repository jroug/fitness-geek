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


const CalendarHomePage:React.FC = () => {

    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [loadingMeals, setLoadingMeals] = useState<boolean>(true);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
    const [isPublished, setIsPublished] = useState<boolean>(false);
    const [jrTokenFromDb, setJrTokenFromDb] = useState<string>('');
    const router = useRouter();

    const handlePublishingCalendar = async (): Promise<void> => {

        // if isPublished then delete token
        // if unpublished then create token
        // console.log('isPublished', isPublished);
        if (isPublished) {
            unpublishCalendar();
        }else{
            publishCalendar();
        }
    }

    const unpublishCalendar = async (): Promise<void> => {
        // private page needs status of public page (exist or not)
        await fetch(deleteUserCalendarTokenUrl, {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        })
        .then((res) => res.json())
        .then((data) => {
            // console.log('unpublishCalendar - data', data);
            if ( data.deleted == 'ok' ) {
                setIsPublished(false); 
                setJrTokenFromDb( '' );
            }else{
                alert(data.message);
                // console.log(data.message);
            }
        });
    }

    const publishCalendar = async (): Promise<void> => {
        // private page needs status of public page (exist or not)
        await fetch(createUserCalendarTokenUrl, {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        })
        .then((res) => res.json())
        .then((data) => {
            // console.log('publishCalendar - data', data);
            if ( data.jr_token != '' ) {
                setIsPublished(true); 
                setJrTokenFromDb( data.jr_token );
            }else{
                alert(data.message);
                // console.log(data.message);
            }
        });
    }

    const getCalendarStatus = async (): Promise<void> => {

          // private page needs status of public page (exist or not)
          await fetch(getUserCalendarTokenUrl, {
              method: 'GET',
              credentials: 'include', // Include cookies in the request
          })
          .then((res) => res.json())
          .then((data) => {
              if ( data[0] && data[0].jr_token ) {
                  setIsPublished(true); 
                  setJrTokenFromDb( data[0].jr_token );
              }else{
                  setIsPublished(false); 
              }
              setLoadingStatus(false);
          });
    

    }

    const getUserMeals = async (): Promise<void> => {
        await fetch(userMealsFetchUrl, {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        })
        .then((res) => res.json())
        .then((data) => {

            // Check if data exists and is not empty
            if (!data || data.length === 0) {
                setUserMealsList([]); // Set an empty list if no meals are found
                setLoadingMeals(false); // Stop loading
                return;
            }

            const transformedData: MealEvent[] = data.map((item: { datetime_of_meal: moment.MomentInput; food_name: string; }) => ({
                start: moment(item.datetime_of_meal).toDate(),
                end: moment(item.datetime_of_meal).add(30, 'minutes').toDate(),
                title: item.food_name,
            }));

            setUserMealsList(transformedData);
            setLoadingMeals(false);
        });
    }


    useEffect(() => {
        // Fetch user authentication status from an API endpoint (session, cookies)
        async function getCalendarData() {
            const res = await fetch(checkAuthFetchUrl, {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });
    
            if (res.ok) {
                getUserMeals()
                getCalendarStatus()
            } else {
                // User is not authenticated, redirect to login
                router.push('/');
            }
        }
        getCalendarData();
    }, [router]);

    if (loadingMeals || loadingStatus) {
        return <Loading />;
    }

    const currentDate = new Date();
    const calendarPageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/meals/calendar/${jrTokenFromDb}`;
        
    return (
        <main className="site-content">
            <Header title="Meals Calendar" backUrl="/homepage" />
            <div className="flex items-center publish-btn-wrapper mt-4">
                <div className="flex-auto" >
                    <h2 className="" >Status:  <b>{isPublished ? ' Published' : 'Not Published'}</b></h2>
                    
                </div>
                <button type="button" className="green-btn" onClick={handlePublishingCalendar}>
                    {isPublished ? 'Unpublish' : 'Publish'}
                </button>
            </div>
            <br/>
            <p>{
                  isPublished 
                  ? 
                    <>
                      <span>Public URL: </span>
                      <Link href={calendarPageUrl} target="_blank" style={{ textDecoration: "underline" }} >{calendarPageUrl}</Link> 
                    </>
                  : 
                    ''
            }</p>
            <div className="pb-20 mt-5" id="calendar-main">
                <div className="container">
                    <Calendar
                        localizer={localizer}
                        defaultDate={new Date()}
                        defaultView="week"
                        events={userMealsList}
                        views={{ day: true, week: true }}
                        step={150}  // 150 minutes per slot
                        timeslots={1}  // 1 slot per interval
                        min={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0, 0)}  // Start time: 9 AM
                        max={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 0)}  // End time: 11:59 PM
                        components={{
                            timeGutterWrapper: CustomTimeGutter, // Custom gutter component
                        }}
                    />
                </div>
            </div>
        </main>
    );
};

export default CalendarHomePage;
