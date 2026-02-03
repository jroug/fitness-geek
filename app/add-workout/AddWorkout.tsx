'use client';

import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useSearchParams } from 'next/navigation';
import Toast from "@/components/Toast";
import { globalSettings } from "@/lib/globalSettings";
import { getCurrentDateTime } from '@/lib/getCurrentDateTime';
import useSWR from 'swr';
 
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch workouts');
    return res.json();
});

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
    
    const searchParams = useSearchParams();
    const preselectWorkoutId = searchParams?.get('workoutId') || null;

 
    
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

    const [popupData, setPopupData] = useState({ title: '', message: '', time:0, show_popup: false });

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
            setPopupData({ title: 'Message', message: data.message, time:globalSettings.frmTimeSuccess, show_popup: true });
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
            return true;
        } else {
            setPopupData({ title: 'Error!', message: 'Something went wrong!', time:globalSettings.frmTimeError, show_popup: true });
            return false;
        }
    };

 

    const handleWorkoutSuggestionsInputChange = (event: React.SyntheticEvent, newValue: WorkoutSuggestion | null) => {
        if (newValue) setWorkoutSelected(newValue);
    };

    const handleworkoutComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWorkoutComments(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
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
            const success = await addWorkoutToDB(input_data);
            if (success) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, globalSettings.frmTimeSuccess);
            }
        } else {
            alert('Complete all necessary fields!');
        }
    };

    const {
        data: suggestionWorkouts = [],
        error: workoutsError,
        isLoading,
    } = useSWR<WorkoutSuggestion[]>('/api/get-all-workouts', fetcher, {
        dedupingInterval: 60_000, // 1 minute
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const didPreselectRef = useRef<string | null>(null);

    useEffect(() => {
        if (!preselectWorkoutId) return;
        if (!suggestionWorkouts.length) return;

        // Prevent overwriting user selection on SWR revalidation
        if (didPreselectRef.current === preselectWorkoutId) return;

        const found = suggestionWorkouts.find((w) => w.id === preselectWorkoutId);
        if (found) {
            setWorkoutSelected(found);
            didPreselectRef.current = preselectWorkoutId;
        }
    }, [preselectWorkoutId, suggestionWorkouts]);


 

    if (isLoading || workoutsError) {
        return (
            <></>
        );
    }


    return (
        <>
                <div className="verify-email pb-20" id="feedback-main">
                    <div className="container">
                        <div className="feedback-content mt-16">
                            {/* <div className="green-btn mt-4">
                                <Link href="#" onClick={handleSetCurrentDateAndMeal}>Set Current Date & Type</Link>
                            </div> */}
                            <form className="feedback-form" onSubmit={handleFormSubmit}>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="datetime-local" className="custom-lbl-feedback">Date & Time of workout*</label>
                                    <input 
                                        type="datetime-local" 
                                        id="datetime-local" 
                                        value={dateTime} 
                                        onChange={(e) => setDateTime(e.target.value)} 
                                        className={"border-green-1 " + dateTimeErrorClass}
                                    />
                                </div>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="meal-short" className="custom-lbl-feedback">Workout*</label>
                                    <Autocomplete
                                        className={"Autocomplete-green " + mealTitleErrorClass }
                                        value={workoutSelected}
                                        options={suggestionWorkouts}
                                        getOptionLabel={ (option) => ( option.w_title!== '' ? option.w_type + ': ' + option.w_title  + ' - ' + option.w_time + ' min ' : '' ) }
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
                                                    <td>{ workoutSelected && workoutSelected.w_time !== "" ? workoutSelected.w_time + ' min' : '' }</td>
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
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
};

export default AddWorkout;
