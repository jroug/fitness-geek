'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useRouter } from 'next/navigation';
import { checkAuthAndRedirect } from "@/lib/checkAuthAndRedirect";
import Header from "@/components/Header";
// import Popup from "@/components/Popup";
import Toast from "@/components/Toast";

// Define interfaces for meal data
interface WorkoutSuggestion {
    id: string;
    w_title: string;
    w_description: string;
    w_type: string;
    w_calories: string;
    w_time: string;
}

interface WorkoutInputData {
    date_of_workout: string;
    workout_id: string;
    comments: string;
}

const AddWorkout: React.FC = () => {
    
    const router = useRouter();

    const getCurrentDateTime = (): string => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/Athens',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };

        const athensTime = new Intl.DateTimeFormat('en-GB', options).format(now);
        const [datePart, timePart] = athensTime.split(', ');
        const formattedDate = datePart.split('/').reverse().join('-');
        return `${formattedDate}T${timePart.replace(':', ':')}`;
    };
    
    const [dateTimeErrorClass, setDateTimeErrorClass] = useState('');
    const [mealTitleErrorClass, setMealTitleErrorClass] = useState('');

    const [dateTime, setDateTime] = useState(getCurrentDateTime);

    const [workoutSelected, setWorkoutSelected] = useState<WorkoutSuggestion>({
        id: "",
        w_title: "",
        w_description: "",
        w_type: "",
        w_calories: "",
        w_time: ""
    });

    const [workoutComments, setWorkoutComments] = useState('');

    const [suggestionWorkouts, setSuggestionWorkouts] = useState<WorkoutSuggestion[]>([]);
    const [popupData, setPopupData] = useState({ title: '', message: '', time:0, show_popup: false });



    const getWorkoutSuggestions = async (): Promise<WorkoutSuggestion[]> => {
        const fetchSuggestedWorkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-all-workouts`;
        const res = await fetch(fetchSuggestedWorkoutUrl);
        const data = await res.json();
        setSuggestionWorkouts(data);
        return data;
    };

    const addWorkoutToDB = async (input_data: WorkoutInputData) => {
        const addWorkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-workout`;
        const res = await fetch(addWorkoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input_data)
        });
        const data = await res.json();
        if (data.user_workout_added) {
            setPopupData({ title: 'Message', message: data.message, time:1900, show_popup: true });
            setDateTime('');
            setWorkoutSelected({
                id: "",
                w_title: "",
                w_description: "",
                w_type: "",
                w_calories: "",
                w_time: ""
            });
            setWorkoutComments('');
        } else {
            setPopupData({ title: 'Error!', message: 'Something went wrong!', time:4000, show_popup: true });
        }
    };

    useEffect(() => {
        const getAddMealPageData = async () => {
            const ret = await checkAuthAndRedirect(router); // will redirect to root if no token found on http cookie
            if (ret === true){
                getWorkoutSuggestions();
            }
        }
        getAddMealPageData();
    }, [router]);

    // const handleSetCurrentDateAndMeal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    //     e.preventDefault();
    //     setDateTime(getCurrentDateTime());
    // };

    const handleWorkoutSuggestionsInputChange = (event: React.SyntheticEvent, newValue: WorkoutSuggestion | null) => {
        if (newValue) setWorkoutSelected(newValue);
    };

    const handleworkoutComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWorkoutComments(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let doSubmit = true;

        if (!workoutSelected.id) {
            doSubmit = false;
            setMealTitleErrorClass("error2");
        } else {
            setMealTitleErrorClass("");
        }

        if (!dateTime) {
            doSubmit = false;
            setDateTimeErrorClass("error");
        } else {
            setDateTimeErrorClass("");
        }

        if (doSubmit) {
            const input_data: WorkoutInputData = {
                date_of_workout: dateTime,
                workout_id: workoutSelected.id,
                comments: workoutComments
            };
            addWorkoutToDB(input_data);
        } else {
            alert('Complete all necessary fields!');
        }
    };

    return (
        <>
            <main className="site-content">
                <Header title="Add Workout" backUrl="/homepage" />
                <div className="verify-email pb-20" id="feedback-main">
                    <div className="container">
                        <div className="feedback-content mt-16">
                            {/* <div className="green-btn mt-4">
                                <Link href="#" onClick={handleSetCurrentDateAndMeal}>Set Current Date & Type</Link>
                            </div> */}
                            <form className="feedback-form" onSubmit={handleFormSubmit}>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="datetime-local" className="custom-lbl-feedback">Date & Time of meal*</label>
                                    <input 
                                        type="datetime-local" 
                                        id="datetime-local" 
                                        value={dateTime} 
                                        onChange={(e) => setDateTime(e.target.value)} 
                                        className={"border-green-1 " + dateTimeErrorClass}
                                    />
                                </div>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="meal-short" className="custom-lbl-feedback">What did I ate?*</label>
                                    {/* <input type="text" id="meal-short" placeholder="Write here" className="sm-font-sans border mt-8" autoComplete="off" /> */}
                                    <Autocomplete
                                        className={"Autocomplete-green " + mealTitleErrorClass }
                                        value={workoutSelected}
                                        options={suggestionWorkouts}
                                        getOptionLabel={ (option) => ( option.w_title!== '' ? option.w_title + ' - ' + option.w_time + 'h ' : '' ) }
                                        onChange={handleWorkoutSuggestionsInputChange}
                                        isOptionEqualToValue = {(options, value) => options.id === value.id }
                                        renderInput={(params) => (
                                            <TextField {...params} label="" variant="outlined" />
                                        )}
                                    />
                                </div>
                                <div className="addmeal-div">
                                    <label htmlFor="meal-long" className="custom-lbl-feedback">Details</label>
                                    <div className="sm-font-sans custom-textarea-div mt-8 border-green-1" id="meal-long" >
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>Description:</td>
                                                    <td>{ workoutSelected && workoutSelected.w_description !== "" ? workoutSelected.w_description : '' }</td>
                                                </tr>
                                                <tr>
                                                    <td>Type:</td>
                                                    <td>{ workoutSelected && workoutSelected.w_type !== "" ? workoutSelected.w_type : '' }</td>
                                                </tr>
                                                <tr>
                                                    <td>Time:</td>
                                                    <td>{ workoutSelected && workoutSelected.w_time !== "" ? workoutSelected.w_time + 'h' : '' }</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Calories:</b></td>
                                                    <td><b>{ workoutSelected && workoutSelected.w_calories !== "" ? workoutSelected.w_calories + ' kcal' : '' }</b></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="addmeal-div">
                                    <label htmlFor="comments" className="custom-lbl-feedback">Comments</label>
                                    <textarea rows={4} cols={50} placeholder="Write here..." className="sm-font-sans custom-textarea mt-8 border-green-1" id="comments" value={workoutComments} onChange={handleworkoutComments}></textarea>
                                </div>
                                <div className="green-btn mt-4">
                                    <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-full">ADD</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            {/* <Popup popupData={popupData} setPopupData={setPopupData} /> */}
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
};

export default AddWorkout;
