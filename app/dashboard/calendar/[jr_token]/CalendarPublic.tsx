'use client';
 
import React, { useState, useEffect, useCallback, use, useRef } from "react";
import { useRouter } from 'next/navigation';
import { checkAuthAndRedirect } from "@/lib/checkAuthAndRedirect";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "@/components/Loading";
import CustomDateCell from '@/components/CustomDateCell';
import CustomTimeGutter from '@/components/CustomTimeGutter';
import CustomEvent from '@/components/CustomEvent';
import { adjustTime } from "@/lib/adjustTime";
import CustomToolBarPublic from '@/components/CustomToolBarPublic';

 


const getPublicCalendarData = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-public-calendar-data`;
const checkUserCalendarTokenUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/check-user-calendar-token`;
const calendarCommentsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/dashboard/calendar-comments`;
// const checkWhoIsWatchingCalendarUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/check-calendar-who-is-watching`;


// interface CalendarPageProps {
//     params: { jr_token: string };
// }

type Params = Promise<{ jr_token: string }>

export default function CalendarPublic(props: { params: Params }) {

    moment.updateLocale("en", { week: { dow: 1 } }); // Set Monday as the first day
    const localizer = momentLocalizer(moment);
    
    const params = use(props.params);
    const jr_token  = params.jr_token; // Extract the token from params
 
    const calendarMainRef = useRef<HTMLDivElement | null>(null);

    // calendar view depending on viewport width (mobile vs desktop)
    const [view, setView] = useState<"week" | "day">("week");

    const [userMealsList, setUserMealsList] = useState<MealEvent[]>([]);

    const [userCommentsList, setUserCommentsList] = useState<Record<string, UserCommentData>>({});
    const [userWeightList, setUserWeightList] = useState<Record<string, string>>({});
    const [userWorkoutList, setUserWorkoutList] = useState<Record<string, UserWorkoutData>>({});
    
    const [loadingMeals, setLoadingMeals] = useState<boolean>(true);
    const [userDisplayName, setUserDisplayName] = useState<string>('');

    const [isCommentsPublished, setIsCommentsPublished] = useState<boolean>(false);
    const [isCurrentUserViewing, setIsCurrentUserViewing] = useState<boolean>(false);

    const router = useRouter();

    const getUserMealsANDNameFromToken = useCallback(async (): Promise<void> => {
        try {
            const res = await fetch(`${getPublicCalendarData}?jr_token=${jr_token}`, { method: 'GET' });
            const data: CalendarData = await res.json();
            // console.log('data from public calendar API:', data);
            setUserDisplayName( data.user_display_name ? data.user_display_name : '' );

            if (!data || !data.meals_list || data.meals_list.length === 0) {
                setUserCommentsList({});
                setUserWorkoutList({});
                setUserWeightList({});
                setUserMealsList([]);
                setLoadingMeals(false);
                return;
            }

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
                    comments: item.comments
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
            data.weight_list.forEach((val) => {
                transformedWeightData[moment(val.date_of_weighing).format("YYYY-MM-DD")] = `${val.weight}kg @${moment(val.date_of_weighing).format("hh:mma")}`;
            });

            const transformedWorkoutData: Record<string, UserWorkoutData> = {};
            data.workout_list.forEach((val) => {
                transformedWorkoutData[moment(val.date_of_workout).format("YYYY-MM-DD")] = {
                    id: val.id,
                    w_title: val.w_title,
                    w_type: `${val.w_type} @${moment(val.date_of_workout).format("hh:mma")}`,
                    date_of_workout: val.date_of_workout
                };
            });

            // User comment data
            const transformedCommentsData: Record<string, UserCommentData> = {};
            data.comments_list.forEach((val) => {
                transformedCommentsData[moment(val.date_of_comment).format("YYYY-MM-DD")] = { 
                    id:val.id, 
                    user_id: val.user_id,
                    date_of_comment:val.date_of_comment,
                    comment:val.comment,
                    grade: val.grade
                };
            });

            setUserCommentsList(transformedCommentsData);
            setUserWorkoutList(transformedWorkoutData);
            setUserWeightList(transformedWeightData);
            setUserMealsList(transformedMealData);
            setLoadingMeals(false);
        } catch (error) {
            console.error("Error fetching user meals:", error);
        }
    }, [jr_token]);

    const handlePublishingCommentsForCalendar = async () => {
        const action = isCommentsPublished ? 'closeComments' : 'openComments';
        try {
            const res = await fetch(`${calendarCommentsUrl}?action=${action}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();

            if (data.action_suc === true) {
                setIsCommentsPublished(data.status);
            } else {
                console.error("Error :", data.message);
                setIsCommentsPublished(false);
            }
        } catch (error) {
            console.error("Error checking calendar token:", error);
        }
    }

    useEffect(() => {
        const getCalendarCommentsStatus = async () => {
            try {
                const res = await fetch(`${calendarCommentsUrl}?action=getCommentsStatus&jr_token=${jr_token}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                if (data.action_suc === true) {
                    setIsCommentsPublished(data.status);
                } else {
                    console.error("Error :", data.message);
                    setIsCommentsPublished(false);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }


        const getCalendarData = async () => {
            try {
                const res = await fetch(`${checkUserCalendarTokenUrl}?jr_token=${jr_token}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();

                if (data.jr_token === "valid") {
                    setIsCurrentUserViewing(!data.is_guest_watching);
                    getUserMealsANDNameFromToken();
                } else {
                    router.push('/404');
                }
            } catch (error) {
                console.error("Error checking calendar token:", error);
            }
        };



        const prepareCalendar = async () => {
            const ret = await checkAuthAndRedirect(router, true);
            if (ret === true) {
                await getCalendarData();
                await getCalendarCommentsStatus();
            }
        };
        prepareCalendar();

 
    }, [router, jr_token, getUserMealsANDNameFromToken]);

    useEffect(() => {
        const updateView = () => {
            const isMobile = window.innerWidth <= 1024;
            setView(isMobile ? "day" : "week");
        };

        updateView(); // initial
        window.addEventListener("resize", updateView);

        return () => window.removeEventListener("resize", updateView);
    }, []);

 
    if (loadingMeals) {
        return <Loading />;
    }

    const currentDate = new Date();

    return (
        <main className="site-content full-width bg-slate-50">
            <section className="calendar-link-wrapper mx-auto mt-4 w-full max-w-7xl px-4 md:px-8">
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-center text-2xl font-bold text-slate-900">{userDisplayName} Diet Calendar</h2>
                    <div className="mt-2 text-center text-sm text-slate-700">
                        {isCurrentUserViewing ? (
                            <>
                                <span>
                                    Comments are{' '}
                                    <b className={isCommentsPublished ? 'text-emerald-700' : 'text-amber-700'}>
                                        {isCommentsPublished ? 'Open' : 'Closed'}
                                    </b>
                                </span>
                                {' · '}
                                <button
                                    type="button"
                                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                                    onClick={handlePublishingCommentsForCalendar}
                                >
                                    {isCommentsPublished ? 'Close Comments' : 'Open Comments'}
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </section>

            <section className="calendar-modern mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
                <div className="mt-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 md:p-4">
                    <div className="calendar-modern-shell overflow-x-auto">
                        <div ref={calendarMainRef} className="min-w-[920px]">
                            <Calendar
                            localizer={localizer}
                            defaultDate={new Date()}
                            // defaultView="week"
                            events={userMealsList}
                            view={view}
                            onView={(v) => setView(v as "week" | "day")}
                            step={150}
                            timeslots={1}
                            min={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0, 0)}
                            max={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 0)}
                            formats={{
                                dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
                                  const startFormat = localizer?.format(start, 'MMMM D', culture)
                                  const endFormat = localizer?.format(end, 'D, YYYY', culture)
                                  return `${startFormat} – ${endFormat}`
                                }
                            }}
                            components={{
                                event: (props) => <CustomEvent {...props} cameFrom="public" isCommentsPublished={isCommentsPublished} setUserMealsList={setUserMealsList} />,  
                                dateCellWrapper: (props) => <CustomDateCell {...props} 
                                    // cameFrom="public"
                                    isCommentsPublished={isCommentsPublished}
                                    getWeight={(date) => userWeightList[moment(date).format("YYYY-MM-DD")] || null} 
                                    getWorkout={(date) => userWorkoutList[moment(date).format("YYYY-MM-DD")] || null} 
                                    getComment={(date) => userCommentsList[moment(date).format("YYYY-MM-DD")] || null}
                                    setUserCommentsList = {setUserCommentsList}
                                    jr_token = {jr_token}
                                />, 
                                timeGutterWrapper: CustomTimeGutter,    
                                toolbar: CustomToolBarPublic
                            }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

 
