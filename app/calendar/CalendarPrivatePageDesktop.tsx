'use client';

import React, { useEffect, useMemo, useState } from "react";
// import React, { useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "@/components/Loader";
import CustomDateCell from '@/components/CustomDateCellPrivate';
import CustomTimeGutter from '@/components/CustomTimeGutter';
import CustomEvent from '@/components/CustomEvent';
import CustomToolBar from '@/components/CustomToolBar';
import { adjustTime } from "@/lib/adjustTime";
import { TimeSlotWrapper } from "@/components/TimeSlotWrapper";
import { getMealTypeFromTime } from "@/lib/getMealTypeFromTime";   
import { mealTypeOptions } from "@/lib/mealTypeOptions";
import PopupFormAddMeal from "@/components/PopupFormAddMeal";
import PopupFormAddWorkout from "@/components/PopupFormAddWorkout";
import TopBar from "./TopBar";
import SettingsBar from "./SettingsBar";

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

interface MacroTotals {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
}

const fetcher = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url, { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch data');
    return (await res.json()) as T;
};

const CalendarHomePage: React.FC = () => {
    // const calendarMainRef = useRef<HTMLDivElement | null>(null);

    const [popupFormData, setPopupFormData] = useState({ title: '', dateSelected: new Date(), show_popup: false });
    const [popupWorkoutFormData, setPopupWorkoutFormData] = useState({ title: '', dateSelected: new Date(), show_popup: false });
    
    const [calendarDate, setCalendarDate] = useState<Date>(new Date());
    const [settingsVisible, setSettingsVisible] = useState(false);
    // Local state lists are still kept because other components (PopupForm / CustomEvent)
    // mutate them optimistically.
    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);
    const [userCommentsList, setUserCommentsList] = useState<Record<string, UserCommentData>>({});
    const [userWeightList, setUserWeightList] = useState<Record<string, string>>({});
    const [userWorkoutList, setUserWorkoutList] = useState<Record<string, UserWorkoutData>>({});

    // calendar view depending on viewport width (mobile vs desktop)
    const [view, setView] = useState<"week" | "day">("week");


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

    // SWR: foods catalog (macros per serving)
    const { data: foodCatalog = [] } = useSWR<MealSuggestion[]>('/api/get-all-meals', (url) => fetcher<MealSuggestion[]>(url), {
        dedupingInterval: 60_000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

 


    const isPublished = Boolean(tokenData?.jr_token);
    const jrTokenFromDb = tokenData?.jr_token ?? '';
    const jrLoginTokenFromDb = tokenData?.login_token ?? '';

    const isLoading = isCalendarLoading || isTokenLoading;

    const foodByName = useMemo(() => {
        return foodCatalog.reduce((acc, food) => {
            const key = food.food_name.trim().toLowerCase();
            acc[key] = food;
            return acc;
        }, {} as Record<string, MealSuggestion>);
    }, [foodCatalog]);

    const macroTotalsByDate = useMemo<Record<string, MacroTotals>>(() => {
        if (!userMealsList.length) return {};

        return userMealsList.reduce((acc, event) => {
            const dateKey = moment(event.start).format("YYYY-MM-DD");
            if (!acc[dateKey]) {
                acc[dateKey] = { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 };
            }

            (event.meals || []).forEach((meal) => {
                acc[dateKey].calories += Number(meal.calories || 0);
                acc[dateKey].protein += Number(meal.protein || 0);
                acc[dateKey].carbohydrates += Number(meal.carbohydrates || 0);
                acc[dateKey].fat += Number(meal.fat || 0);
                acc[dateKey].fiber += Number(meal.fiber || 0);
            });

            return acc;
        }, {} as Record<string, MacroTotals>);
    }, [userMealsList]);

    // Transform SWR calendar data into the local lists used by the calendar/components.
    useEffect(() => {
        // console.log("useEffect");
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

            const food = foodByName[item.food_name.trim().toLowerCase()];
            const quantity = Number(item.meal_quantity) || 0;
            const servingSize = Number(food?.serving_size) || 0;
            const factor = item.meal_quantity_type === 'GR'
                ? (servingSize > 0 ? quantity / servingSize : 0)
                : quantity;

            acc[mealDateTime].push({
                id: String(item.ID),
                start: moment(item.datetime_of_meal).toDate(),
                end: moment(item.datetime_of_meal).add(30, 'minutes').toDate(),
                title: `${item.meal_quantity_type === 'GR' ? item.meal_quantity + 'gr ' : item.meal_quantity + 'x'} ${item.food_name} `,
                category: item.category,
                comments: item.comments,
                portion_quantity: Number(item.meal_quantity) || 0,
                portion_quantity_type: item.meal_quantity_type,
                serving_size: Number(food?.serving_size) || 0,
                calories: ((Number(food?.calories) || 0) * factor),
                protein: ((Number(food?.protein) || 0) * factor),
                carbohydrates: ((Number(food?.carbohydrates) || 0) * factor),
                fat: ((Number(food?.fat) || 0) * factor),
                fiber: ((Number(food?.fiber) || 0) * factor),
            });
            return acc;
        }, {} as Record<string, MealGrouped[]>);

        const transformedMealData: MealEvent[] = Object.values(groupedData).map((group) => ({
            id: group.map(event => event.id).join(','),
            // title: moment(group[0].start).format("hh:mm a"),
            title: mealTypeOptions(getMealTypeFromTime(moment(group[0].start).format("YYYY-MM-DD HH:mm"))),
            meals: group.map(event => ({
                id: event.id,
                f_title: event.title,
                f_category: event.category,
                f_comments: event.comments || "",
                portion_quantity: event.portion_quantity,
                portion_quantity_type: event.portion_quantity_type,
                serving_size: event.serving_size,
                calories: event.calories,
                protein: event.protein,
                carbohydrates: event.carbohydrates,
                fat: event.fat,
                fiber: event.fiber,
            })),
            start: adjustTime(group[0].start),
            end: group[0].end,
        }));

        // console.log('transformedMealData', transformedMealData);

        const transformedWeightData: Record<string, string> = {};
        calendarData.weight_list.forEach((val) => {
            // transformedWeightData[moment(val.date_of_weighing).format("YYYY-MM-DD")] = `${val.weight}kg @${moment(val.date_of_weighing).format("hh:mma")}`;
            transformedWeightData[moment(val.date_of_weighing).format("YYYY-MM-DD")] = val.weight;
        });

        const transformedWorkoutData: Record<string, UserWorkoutData> = {};
        calendarData.workout_list.forEach((val) => {
            transformedWorkoutData[moment(val.date_of_workout).format("YYYY-MM-DD")] = {
                id: val.id,
                w_title: val.w_title,
                // w_type: `${val.w_type} @${moment(val.date_of_workout).format("hh:mma")}`,
                w_type: val.w_type,
                date_of_workout: moment(val.date_of_workout).format("YYYY-MM-DD"),
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
    }, [calendarData, foodByName]);

    useEffect(() => {
        const updateView = () => {
            const isMobile = window.innerWidth <= 1024;
            setView(isMobile ? "day" : "week");
        };

        updateView(); // initial
        window.addEventListener("resize", updateView);

        return () => window.removeEventListener("resize", updateView);
    }, []);


    
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
        // console.log(userCommentsList);
        let sumGrades = 0;
        let counter = 0;
        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(startDate);
            nextDate.setDate(startDate.getDate() + i);
            const formatted = nextDate.toISOString().split('T')[0];
            // is number between 1 and 10
            // if (userCommentsList[formatted].grade !== ) {
            const grade = Number(userCommentsList[formatted]?.grade);
            // console.log('grade', grade);
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
        return counter > 0 ? 'AVG. ' + Math.round((sumWeight / counter) * 100) / 100+ 'Kg' : 'N/A';
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

    const generateWeeklyExportData = (startDate: Date) => {
        const weekStart = moment(startDate).startOf("day");
        const weekEnd = moment(startDate).add(6, "days").startOf("day");

        const weekTitle = `${weekStart.format("MMMM D, YYYY")} - ${weekEnd.format("MMMM D, YYYY")}`;
        const summaryGrades = calcWeeklyGrades(startDate);
        const summary = {
            score: summaryGrades.total,
            avgGrade: summaryGrades.avg,
            avgWeight: calcAverageWeeklyWeight(startDate),
            workouts: calcNumberOfWeeklyWorkouts(startDate),
        };

        const days = Array.from({ length: 7 }, (_, dayOffset) => {
            const dayMoment = moment(startDate).add(dayOffset, "days").startOf("day");
            const dateKey = dayMoment.format("YYYY-MM-DD");
            const dayMeals = userMealsList
                .filter((event) => moment(event.start).format("YYYY-MM-DD") === dateKey)
                .map((event) => ({
                    slot: event.title || "",
                    items: (event.meals || []).map((meal) =>
                        meal.f_comments ? `${meal.f_title} (${meal.f_comments})` : meal.f_title
                    ),
                }));

            return {
                date: dayMoment.format("dddd, MMMM D, YYYY"),
                grade: userCommentsList[dateKey]?.grade ? String(userCommentsList[dateKey].grade) : "N/A",
                comment: userCommentsList[dateKey]?.comment || "N/A",
                weight: userWeightList[dateKey] ? `${userWeightList[dateKey]} kg` : "N/A",
                workout: userWorkoutList[dateKey]
                    ? `${userWorkoutList[dateKey].w_title} (${userWorkoutList[dateKey].w_type})`
                    : "N/A",
                meals: dayMeals,
            };
        });

        return {
            weekTitle,
            summary,
            days,
        };
    };

    const calendarPageUrl = `/calendar/${jrTokenFromDb}`;
    const magicLoginForContributorUrl = `${location.origin}/users/magic-login/${encodeURIComponent(jrLoginTokenFromDb)}`;

    const openFoodModal = (arg0: { start: Date; end: Date; }) => {
        setPopupFormData({ title: 'Add Meal', dateSelected: arg0.start, show_popup: true });
    }

    const openWorkoutModal = (arg0: { start: Date; end: Date; }) => {
        setPopupWorkoutFormData({ title: 'Add Workout', dateSelected: arg0.start, show_popup: true });
    }

    const handleSettingsClick = (e?: React.MouseEvent<HTMLElement>) => {
        e?.preventDefault?.();
        setSettingsVisible((prev) => !prev);
    };
   

    return (
        <>
            <TopBar clickHandler={handleSettingsClick} isPublished={isPublished} />
            <SettingsBar settingsVisible={settingsVisible} handleSettingsClick={handleSettingsClick} isPublished={isPublished} handlePublishingCalendar={handlePublishingCalendar} calendarPageUrl={calendarPageUrl} magicLoginForContributorUrl={magicLoginForContributorUrl} handleCopyLink={handleCopyLink} />
            <div className="calendar-wrapper" >
                <div className="calendar-main-wrapper" >
                    {/* <div ref={calendarMainRef} className="pb-20 calendar-main mx-auto" id="calendar-main"> */}
                    <div className="pb-20 calendar-main mx-auto" id="calendar-main">
                        <div className="padding-wrapper" >
                            <Calendar
                                localizer={localizer}
                                date={calendarDate}
                                onNavigate={(newDate) => setCalendarDate(newDate)}
                                // defaultView="week"
                                view={view}
                                onView={(v) => setView(v as "week" | "day")}
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
                                            getMacros={(date) => macroTotalsByDate[moment(date).format("YYYY-MM-DD")] || null}
                                            setUserWeightList={setUserWeightList}
                                            setUserCommentsList={setUserCommentsList}
                                            setUserWorkoutList={setUserWorkoutList}
                                            onAddWorkout={(date) => {
                                                openWorkoutModal({ start: date, end: date });
                                            }}
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
                                            generateWeeklyExportData={generateWeeklyExportData}
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
            </div>
            <PopupFormAddMeal
                setPopupFormData={setPopupFormData}
                popupFormData={popupFormData}
                setUserMealsList={setUserMealsList}
            />
            <PopupFormAddWorkout
                setPopupFormData={setPopupWorkoutFormData}
                popupFormData={popupWorkoutFormData}
                setUserWorkoutList={setUserWorkoutList}
            />
        </>
    );
};

export default CalendarHomePage;
