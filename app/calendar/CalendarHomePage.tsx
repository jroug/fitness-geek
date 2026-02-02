'use client';

import React, { useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
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
import { TimeSlotWrapper } from "@/components/TimeSlotWrapper";
import PopupForm from "@/components/PopupForm";

moment.updateLocale("en", { week: { dow: 1 } }); // Set Monday as the first day

const localizer = momentLocalizer(moment);

// Use relative API routes on the client
const calendarDataFetchUrl = `/api/get-calendar-data`;
const getUserCalendarTokensUrl = `/api/get-user-calendar-tokens`;
const createUserCalendarTokensUrl = `/api/create-user-calendar-tokens`;
const deleteUserCalendarTokensUrl = `/api/delete-user-calendar-tokens`;

interface TokenResponse {
    jr_token: string;
    login_token: string;
    deleted?: string;
    message?: string;
}

const fetcher = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url, { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch data');
    return (await res.json()) as T;
};

const CalendarHomePage: React.FC = () => {
    const calendarMainRef = useRef<HTMLDivElement | null>(null);

    const [popupFormData, setPopupFormData] = useState({ title: '', dateSelected: new Date(), show_popup: false });
    const [calendarDate, setCalendarDate] = useState<Date>(new Date());

    // Local state lists are still kept because other components (PopupForm / CustomEvent)
    // mutate them optimistically.
    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [userCommentsList, setUserCommentsList] = useState<Record<string, UserCommentData>>({});
    const [userWeightList, setUserWeightList] = useState<Record<string, string>>({});
    const [userWorkoutList, setUserWorkoutList] = useState<Record<string, UserWorkoutData>>({});

    // SWR: calendar data
    const {
        data: calendarData,
        error: calendarError,
        isLoading: isCalendarLoading,
    } = useSWR<CalendarData>(calendarDataFetchUrl, (url) => fetcher<CalendarData>(url), {
        dedupingInterval: 0,          // no dedupe cache
        revalidateOnMount: true,      // always refetch on mount
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        keepPreviousData: false,      // do not keep cached data
    });

    // SWR: publish status
    const {
        data: tokenData,
        error: tokenError,
        isLoading: isTokenLoading,
    } = useSWR<TokenResponse>(getUserCalendarTokensUrl, (url) => fetcher<TokenResponse>(url), {
        dedupingInterval: 0,          // no dedupe cache
        revalidateOnMount: true,      // always refetch on mount
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        keepPreviousData: false,      // do not keep cached data
    });


    const isPublished = Boolean(tokenData?.jr_token);
    const jrTokenFromDb = tokenData?.jr_token ?? '';
    const jrLoginTokenFromDb = tokenData?.login_token ?? '';

    const isLoading = isCalendarLoading || isTokenLoading;

    // Transform SWR calendar data into the local lists used by the calendar/components.
    useEffect(() => {
        if (!calendarData) return;

        if (!calendarData.meals_list || calendarData.meals_list.length === 0) {
            setUserCommentsList({});
            setUserWorkoutList({});
            setUserWeightList({});
            setUserMealsList([]);
            return;
        }

        // User meal data
        const groupedData = calendarData.meals_list.reduce((acc, item) => {
            const hour = Number(moment(item.datetime_of_meal).format("HHmm"));
            let mealDateTime = moment(item.datetime_of_meal).format("YYYY-MM-DD");

            if (hour < 900) {
                mealDateTime += "9 AM";
            } else if (hour < 1130) {
                mealDateTime += "9 AM";
            } else if (hour < 1400) {
                mealDateTime += "12 PM";
            } else if (hour < 1630) {
                mealDateTime += "2 PM";
            } else if (hour < 1900) {
                mealDateTime += "5 PM";
            } else if (hour < 2130) {
                mealDateTime += "7 PM";
            } else {
                mealDateTime += "10 PM";
            }

            if (!acc[mealDateTime]) acc[mealDateTime] = [];
            acc[mealDateTime].push({
                id: String(item.ID),
                start: moment(item.datetime_of_meal).toDate(),
                end: moment(item.datetime_of_meal).add(30, 'minutes').toDate(),
                title: `${item.meal_quantity_type === 'GR' ? item.meal_quantity + 'gr ' : item.meal_quantity + 'x'} ${item.food_name} `,
                category: item.category,
                comments: item.comments,
            });
            return acc;
        }, {} as Record<string, MealGrouped[]>);

        const transformedMealData: MealEvent[] = Object.values(groupedData).map((group) => ({
            id: group.map(event => event.id).join(','),
            title: moment(group[0].start).format("hh:mm a"),
            meals: group.map(event => ({ id: event.id, f_title: event.title, f_category: event.category, f_comments: event.comments || "" })),
            start: adjustTime(group[0].start),
            end: group[0].end,
        }));

        const transformedWeightData: Record<string, string> = {};
        calendarData.weight_list.forEach((val) => {
            transformedWeightData[moment(val.date_of_weighing).format("YYYY-MM-DD")] = `${val.weight}kg @${moment(val.date_of_weighing).format("hh:mma")}`;
        });

        const transformedWorkoutData: Record<string, UserWorkoutData> = {};
        calendarData.workout_list.forEach((val) => {
            transformedWorkoutData[moment(val.date_of_workout).format("YYYY-MM-DD")] = {
                id: val.id,
                w_title: val.w_title,
                w_type: `${val.w_type} @${moment(val.date_of_workout).format("hh:mma")}`,
                date_of_workout: val.date_of_workout,
            };
        });

        const transformedCommentsData: Record<string, UserCommentData> = {};
        calendarData.comments_list.forEach((val) => {
            transformedCommentsData[moment(val.date_of_comment).format("YYYY-MM-DD")] = {
                id: val.id,
                user_id: val.user_id,
                date_of_comment: val.date_of_comment,
                comment: val.comment,
                grade: val.grade,
            };
        });

        setUserCommentsList(transformedCommentsData);
        setUserWorkoutList(transformedWorkoutData);
        setUserWeightList(transformedWeightData);
        setUserMealsList(transformedMealData);
    }, [calendarData]);

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
            await mutate(getUserCalendarTokensUrl);
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
            await mutate(getUserCalendarTokensUrl);
        } else {
            alert("Error publishing calendar");
        }
    };

    // fix calendar width according to viewport width
    useEffect(() => {
        if (isLoading) return;

        const main = calendarMainRef.current ?? document.querySelector<HTMLElement>(".calendar-main");
        if (!main) return;

        const update = () => {
            const vw = window.innerWidth;

            // run ONLY on desktop (>= 1024px)
            if (vw < 1024) {
                main.style.removeProperty("--cal-scale");
                return;
            }

            const scale = Math.max(0.672, Math.min(1, vw / 2250));
            main.style.setProperty("--cal-scale", String(scale));
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [isLoading]);

    if (isLoading) {
        return <Loading />;
    }

    if (calendarError || tokenError) {
        return <></>;
    }

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const calcWeeklyGrades = (startDate: Date): { avg: string; total: string; } => {
        console.log(userCommentsList);
        let sumGrades = 0;
        let counter = 0;
        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(startDate);
            nextDate.setDate(startDate.getDate() + i);
            const formatted = nextDate.toISOString().split('T')[0];
            // is number between 1 and 10
            // if (userCommentsList[formatted].grade !== ) {
            const grade = Number(userCommentsList[formatted]?.grade);
            console.log('grade', grade);
            if (typeof grade === 'number' && grade >= 1 && grade <= 10) {
                sumGrades += Number(grade);
                counter++;
            }
        }
        const grAvg = Math.round((sumGrades / counter) * 10);
        if (counter===0){
            return {
                avg: 'N/A', 
                total:'N/A'
            };   
        }

        return {
            avg: 'AVG: ' + grAvg.toString() + '%', 
            total:'Score: ' + sumGrades.toString() + '/' + counter*10 + ' (MAX 70)'
        };     
    };

    const calcAverageWeeklyWeight = (startDate: Date): string => {
        let sumWeight = 0;
        let counter = 0;
        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(startDate);
            nextDate.setDate(startDate.getDate() + i);
            const formatted = nextDate.toISOString().split('T')[0];
            if (userWeightList[formatted] !== undefined) {
                sumWeight += getValueFromWeightText(userWeightList[formatted]);
                counter++;
            }
        }
        return counter > 0 ? 'AVG. ' + Math.round((sumWeight / counter) * 10) / 10 + 'Kg' : 'N/A';
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
            const formatted = nextDate.toISOString().split('T')[0];
            if (userWorkoutList[formatted] !== undefined) {
                counter++;
            }
        }
        return counter > 0 ? counter + "x Training" : 'N/A';
    };

    const calendarPageUrl = `/calendar/${jrTokenFromDb}`;
    const magicLoginForContributorUrl = `/users/magic-login/${encodeURIComponent(jrLoginTokenFromDb)}`;

    function openFoodModal(arg0: { start: Date; end: Date; }) {
        setPopupFormData({ title: 'Add Meal', dateSelected: arg0.start, show_popup: true });
    }


   

    return (
        <>
            <div className="calendar-link-wrapper" >
                <div className="flex items-center publish-btn-wrapper mt-4">
                    <div className="flex-auto">
                        <h2>Status: <b>{isPublished ? 'Published' : 'Not Published'}</b></h2>
                    </div>
                    <button type="button" className="green-btn" onClick={handlePublishingCalendar}>
                        {isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="fixed custom_margin" >
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
                            <button type="button" onClick={() => handleCopyLink(magicLoginForContributorUrl)} className="underline" >
                                Copy to Clipboard
                            </button>
                        </p>
                    </div>
                )}
            </div>

            <div className="calendar-main-wrapper top-140px" >
                <div ref={calendarMainRef} className="pb-20 calendar-main mx-auto" id="calendar-main">
                    <div className="padding-wrapper" >
                   
                        <Calendar
                            localizer={localizer}
                            date={calendarDate}
                            onNavigate={(newDate) => setCalendarDate(newDate)}
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
                                dateCellWrapper: (props) => (
                                    <CustomDateCell
                                        {...props}
                                        isCommentsPublished={true}
                                        getWeight={(date) => userWeightList[moment(date).format("YYYY-MM-DD")]}
                                        getWorkout={(date) => userWorkoutList[moment(date).format("YYYY-MM-DD")]}
                                        getComment={(date) => userCommentsList[moment(date).format("YYYY-MM-DD")]}
                                        setUserCommentsList={setUserCommentsList}
                                        jr_token={''}
                                    />
                                ),
                                event: (props) => (
                                    <CustomEvent
                                        {...props}
                                        cameFrom="private"
                                        isCommentsPublished={true}
                                        setUserMealsList={setUserMealsList}
                                    />
                                ),
                                timeGutterWrapper: CustomTimeGutter,
                                toolbar: (props) => (
                                    <CustomToolBar
                                        {...props}
                                        calcWeeklyGrades={calcWeeklyGrades}
                                        calcAverageWeeklyWeight={calcAverageWeeklyWeight}
                                        calcNumberOfWeeklyWorkouts={calcNumberOfWeeklyWorkouts}
                                    />
                                ),
                                timeSlotWrapper: (props) => (
                                    <TimeSlotWrapper
                                        {...props}
                                        onAddFood={(date) => {
                                            openFoodModal({ start: date, end: date });
                                        }}
                                    />
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>

            <PopupForm
                setPopupFormData={setPopupFormData}
                popupFormData={popupFormData}
                setUserMealsList={setUserMealsList}
            />
        </>
    );
};

export default CalendarHomePage;
