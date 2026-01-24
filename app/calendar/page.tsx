'use client';

import React, { useState, useEffect, useRef } from "react";
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
import CustomToolBar from '@/components/CustomToolBar';
import Link from "next/link";
import { adjustTime } from "@/lib/adjustTime";


moment.updateLocale("en", { week: { dow: 1 } }); // Set Monday as the first day

const localizer = momentLocalizer(moment);

const calendarDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-calendar-data`;
const getUserCalendarTokensUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-user-calendar-tokens`;
const createUserCalendarTokensUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/create-user-calendar-tokens`;
const deleteUserCalendarTokensUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/delete-user-calendar-tokens`;

 
interface TokenResponse {
    jr_token: string;
    login_token: string;
    deleted?: string;
    message?: string;
}

const CalendarHomePage: React.FC = () => {
    const calendarMainRef = useRef<HTMLDivElement | null>(null);
    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [userCommentsList, setUserCommentsList] = useState<Record<string, UserCommentData>>({});
    const [userWeightList, setUserWeightList] = useState<Record<string, string>>({});
    const [userWorkoutList, setUserWorkoutList] = useState<Record<string, UserWorkoutData>>({});

    const [loadingMeals, setLoadingMeals] = useState<boolean>(true);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
    const [isPublished, setIsPublished] = useState<boolean>(false);
    const [jrTokenFromDb, setJrTokenFromDb] = useState<string>('');
    const [jrLoginTokenFromDb, setJrLoginTokenFromDb] = useState<string>('');

    const router = useRouter();

    const handlePublishingCalendar = async (): Promise<void> => {
        if (isPublished) {
            await unpublishCalendar();
        } else {
            await publishCalendar();
        }
    };

    const unpublishCalendar = async (): Promise<void> => {
        const response = await fetch(deleteUserCalendarTokensUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const data: TokenResponse = await response.json();
        if (data.deleted === 'ok') {
            setIsPublished(false);
            setJrTokenFromDb('');
            setJrLoginTokenFromDb('');
        } else if (data.message) {
            alert(data.message);
        }
    };

    const publishCalendar = async (): Promise<void> => {
        const response = await fetch(createUserCalendarTokensUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const data: TokenResponse = await response.json();
        if (data.jr_token) {
            setIsPublished(true);
            setJrTokenFromDb(data.jr_token);
            setJrLoginTokenFromDb(data.login_token);
        } else {
            alert("Error publishing calendar");
        }
    };

    const getCalendarStatus = async (): Promise<void> => {
        const response = await fetch(getUserCalendarTokensUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (data?.jr_token) {
            setIsPublished(true);
            setJrTokenFromDb(data.jr_token);
            setJrLoginTokenFromDb(data.login_token);
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
            setUserCommentsList({});
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
                title: `${item.meal_quantity_type === 'GR' ? item.meal_quantity + 'gr' : item.meal_quantity + 'x'} ${item.food_name} `,
                // title: `${ item.meal_quantity > 1 ? item.meal_quantity+' x ':'' } ${item.food_name }`,
                category: item.category,
                comments: item.comments,
            });
            return acc;
        }, {} as Record<string, MealGrouped[]>);
        // console.log(groupedData);
        const transformedMealData: MealEvent[] = Object.values(groupedData).map((group) => ({
            id: group.map(event => event.id).join(','), 
            title: moment(group[0].start).format("hh:mm a"),
            meals: group.map(event => ({ id: event.id, f_title: event.title, f_category: event.category, f_comments: event.comments || "" })),
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

        // User comment data
        const transformedCommentsData: Record<string, UserCommentData> = {};
        data.comments_list.forEach((val) => {
            transformedCommentsData[moment(val.date_of_comment).format("YYYY-MM-DD")] = { 
                id:val.id, 
                user_id:val.user_id, 
                date_of_comment:val.date_of_comment,
                comment:val.comment 
            };
        });

        // console.log('transformedCommentsData', transformedCommentsData);
        // console.log('transformedMealData', transformedMealData);

        setUserCommentsList(transformedCommentsData);
        setUserWorkoutList(transformedWorkoutData);
        setUserWeightList(transformedWeightData);
        setUserMealsList(transformedMealData);
        setLoadingMeals(false);
    };

    // fix calendar width according to viewport width
    useEffect(() => {
        if (loadingMeals || loadingStatus) return;

        const main = calendarMainRef.current ?? document.querySelector<HTMLElement>(".calendar-main");
        if (!main) return;

        const update = () => {
            const vw = window.innerWidth;
            const scale = Math.min(1, vw / 2250); // don’t upscale beyond 1
            main.style.setProperty("--cal-scale", String(scale));
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [loadingMeals, loadingStatus]);

    useEffect(() => {
        const prepareCalendar = async () => {
            const ret = await checkAuthAndRedirect(router, false);
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

    const handleCopyLink = (link:string) => {
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    const calcAverageWeeklyWeight = (startDate: Date): string => {
        // console.log(startDate);
        let sumWeight = 0;
        let counter = 0;
        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(startDate);
            nextDate.setDate(startDate.getDate() + i);
            // Format as YYYY-MM-DD
            const formatted = nextDate.toISOString().split('T')[0];
            if (userWeightList[formatted] !== undefined ){
                sumWeight += getValueFromWeightText(userWeightList[formatted]);
                counter ++;
            }
        }
        return counter > 0 ? 'AVG. ' + (sumWeight / counter).toFixed(1) + 'Kg' : 'N/A';
    };

    const getValueFromWeightText = (text: string): number => {
        const arr = text.split('kg');
        return parseFloat(arr[0]);
    };

    const calcNumberOfWeeklyWorkouts = (startDate: Date) => {

        let counter = 0;
        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(startDate);
            nextDate.setDate(startDate.getDate() + i);
            // Format as YYYY-MM-DD
            const formatted = nextDate.toISOString().split('T')[0];
            // console.log('formatted', formatted);

            if (userWorkoutList[formatted] !== undefined ){
                counter ++;
            }
        }
 

        return counter > 0 ? counter + "x Training" : 'N/A';
    }




    const calendarPageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/calendar/${jrTokenFromDb}`;
    const magicLoginForContributorUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/users/magic-login/${encodeURIComponent(jrLoginTokenFromDb)}`;

 
 

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
                {isPublished && (
                    <div>
                        <p>
                            <span>Public URL: </span>
                            <Link href={calendarPageUrl} target="_blank" className="underline">
                                click here!
                            </Link>
                        </p>
                        <p>
                            <span>Contributor URL: </span>
                            <Link href={magicLoginForContributorUrl} target="_blank" className="underline" >
                                click here!
                            </Link>
                             &nbsp; - OR - &nbsp;
                            <button onClick={() => handleCopyLink(magicLoginForContributorUrl)} className="underline" >Copy to Clipboard</button>
                        </p>
                    </div>

                )}
            </div>
            <div className="calendar-main-wrapper top-175px" >
                <div ref={calendarMainRef} className="pb-20 calendar-main mx-auto" id="calendar-main">
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
                            formats={{
                                dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
                                  const startFormat = localizer?.format(start, 'MMMM D', culture)
                                  const endFormat = localizer?.format(end, 'D, YYYY', culture)
                                  return `${startFormat} – ${endFormat}`
                                }
                            }}
                            components={{
                                event: (props) => <CustomEvent {...props} cameFrom="private" isCommentsPublished={true} setUserMealsList={setUserMealsList} />,  
                                dateCellWrapper: (props) => <CustomDateCell {...props} 
                                    cameFrom="private"
                                    isCommentsPublished={true}
                                    getWeight={(date) => userWeightList[moment(date).format("YYYY-MM-DD")] } 
                                    getWorkout={(date) => userWorkoutList[moment(date).format("YYYY-MM-DD")] } 
                                    getComment={(date) => userCommentsList[moment(date).format("YYYY-MM-DD")] }
                                    setUserCommentsList = {setUserCommentsList}
                                    jr_token = {''}
                                />, 
                                // dateCellWrapper: getDateCellWrapper(userCommentsList, userWeightList, userWorkoutList),
                                timeGutterWrapper: CustomTimeGutter, 
                                toolbar: (props) => <CustomToolBar {...props} calcAverageWeeklyWeight={calcAverageWeeklyWeight} calcNumberOfWeeklyWorkouts={calcNumberOfWeeklyWorkouts} />
                            }}

 

                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CalendarHomePage;
