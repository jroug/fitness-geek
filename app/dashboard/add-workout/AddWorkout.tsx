'use client';

import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useSearchParams } from 'next/navigation';
import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';
import { getCurrentDateTime } from '@/lib/getCurrentDateTime';
import useSWR, { mutate } from 'swr';
import { profileDataSWRKey } from '@/lib/profileDataSWR';

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch workouts');
        return res.json();
    });

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
        id: '',
        w_title: '',
        w_description: '',
        w_type: '',
        w_calories: '',
        w_time: '',
    });

    const [workoutComments, setWorkoutComments] = useState('');

    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const [isSaving, setIsSaving] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('SAVE');

    const addWorkoutToDB = async (input_data: WorkoutInputData) => {
        if (isSaving) return false;
        setIsSaving(true);
        setSaveBtnText('Saving...');

        const addWorkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-workout`;
        const res = await fetch(addWorkoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input_data),
        });
        const data = await res.json();
        if (data.user_workout_added) {
            await mutate(profileDataSWRKey);
            setPopupData({ title: 'Message', message: data.message, time: globalSettings.frmTimeSuccess, show_popup: true });
            setDateTime('');
            setWorkoutSelected({
                id: '',
                w_title: '',
                w_description: '',
                w_type: '',
                w_calories: '',
                w_time: '',
            });
            setWorkoutComments('');

            setSaveBtnText('Save');
            setIsSaving(false);

            return true;
        } else if (data.code === 'workout_exists') {
            setPopupData({ title: 'Error!', message: data.message, time: globalSettings.frmTimeError, show_popup: true });
            setSaveBtnText('Save');
            setIsSaving(false);
            return false;
        } else {
            setPopupData({ title: 'Error!', message: 'Something went wrong!', time: globalSettings.frmTimeError * 2, show_popup: true });
            return false;
        }
    };

    const handleWorkoutSuggestionsInputChange = (_event: React.SyntheticEvent, newValue: WorkoutSuggestion | null) => {
        if (newValue) setWorkoutSelected(newValue);
    };

    const handleWorkoutComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWorkoutComments(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let doSubmit = true;

        if (!workoutSelected.id) {
            doSubmit = false;
            setMealTitleErrorClass('error2');
        } else {
            setMealTitleErrorClass('');
        }

        if (!dateTime) {
            doSubmit = false;
            setDateTimeErrorClass('error');
        } else {
            setDateTimeErrorClass('');
        }

        if (doSubmit) {
            const input_data: WorkoutInputData = {
                date_of_workout: dateTime,
                workout_id: workoutSelected.id,
                comments: workoutComments,
            };
            const success = await addWorkoutToDB(input_data);
            if (success) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, globalSettings.frmTimeSuccess);
            }
        }
    };

    const {
        data: suggestionWorkouts = [],
        error: workoutsError,
        isLoading,
    } = useSWR<WorkoutSuggestion[]>('/api/get-all-workouts', fetcher, {
        dedupingInterval: 60_000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const didPreselectRef = useRef<string | null>(null);

    useEffect(() => {
        if (!preselectWorkoutId) return;
        if (!suggestionWorkouts.length) return;
        if (didPreselectRef.current === preselectWorkoutId) return;

        const found = suggestionWorkouts.find((w) => w.id === preselectWorkoutId);
        if (found) {
            setWorkoutSelected(found);
            didPreselectRef.current = preselectWorkoutId;
        }
    }, [preselectWorkoutId, suggestionWorkouts]);

    if (isLoading || workoutsError) {
        return <></>;
    }

    const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition';
    const inputNormal = 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';
    const inputError = 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-200';

    return (
        <>
            <div className="min-h-[calc(100vh-120px)] pb-24">
                <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
                    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Form</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Add Workout</h1>
                        <p className="mt-2 text-sm text-cyan-100">Choose a workout template, review details, then log it.</p>
                    </section>

                    <form onSubmit={handleFormSubmit} className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="datetime-local" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Date & Time of Workout*
                                </label>
                                <input
                                    type="datetime-local"
                                    id="datetime-local"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    className={`${inputBase} ${dateTimeErrorClass ? inputError : inputNormal}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="workout" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Workout*
                                </label>
                                <Autocomplete
                                    value={workoutSelected}
                                    options={suggestionWorkouts}
                                    getOptionLabel={(option) =>
                                        option.w_title !== '' ? `${option.w_type}: ${option.w_title} - ${option.w_time} min` : ''
                                    }
                                    onChange={handleWorkoutSuggestionsInputChange}
                                    isOptionEqualToValue={(options, value) => options.id === value.id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            id="workout"
                                            variant="outlined"
                                            placeholder="Select workout"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    backgroundColor: '#ffffff',
                                                    '& fieldset': {
                                                        borderColor: mealTitleErrorClass ? '#f43f5e' : '#cbd5e1',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: mealTitleErrorClass ? '#f43f5e' : '#06b6d4',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: mealTitleErrorClass ? '#f43f5e' : '#06b6d4',
                                                        borderWidth: 1,
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-700">Workout Details</p>
                            <div className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Description</p>
                                    <p className="mt-1 text-slate-800">{workoutSelected.w_description || '-'}</p>
                                </div>
                                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Type</p>
                                    <p className="mt-1 text-slate-800">{workoutSelected.w_type || '-'}</p>
                                </div>
                                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Time</p>
                                    <p className="mt-1 text-slate-800">{workoutSelected.w_time ? `${workoutSelected.w_time} min` : '-'}</p>
                                </div>
                                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Calories</p>
                                    <p className="mt-1 font-semibold text-slate-900">
                                        {workoutSelected.w_calories ? `${workoutSelected.w_calories} kcal` : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="comments" className="mb-2 block text-sm font-semibold text-slate-700">
                                Comments
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Write here..."
                                className={`${inputBase} ${inputNormal}`}
                                id="comments"
                                value={workoutComments}
                                onChange={handleWorkoutComments}
                            ></textarea>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {saveBtnText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
};

export default AddWorkout;
