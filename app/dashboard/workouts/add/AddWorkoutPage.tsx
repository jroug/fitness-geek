'use client';

import React, { useState } from 'react';
import { mutate } from 'swr';
import Link from 'next/link';
import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';

type AddWorkoutPayload = {
    w_title: string;
    w_description: string;
    w_type: string;
    w_calories: number;
    w_time: number;
};

const toNumber = (value: string) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

export default function AddWorkoutPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [calories, setCalories] = useState('');
    const [time, setTime] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('SAVE');
    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const [requiredErrors, setRequiredErrors] = useState({
        title: false,
        type: false,
        calories: false,
        time: false,
    });

    const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition';
    const inputNormal = 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';
    const inputError = 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-200';

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setType('');
        setCalories('');
        setTime('');
        setRequiredErrors({
            title: false,
            type: false,
            calories: false,
            time: false,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        const nextErrors = {
            title: title.trim() === '',
            type: type.trim() === '',
            calories: calories === '',
            time: time === '',
        };
        setRequiredErrors(nextErrors);
        if (Object.values(nextErrors).some(Boolean)) {
            return;
        }

        const payload: AddWorkoutPayload = {
            w_title: title.trim(),
            w_description: description.trim(),
            w_type: type.trim(),
            w_calories: toNumber(calories),
            w_time: toNumber(time),
        };

        setIsSaving(true);
        setSaveBtnText('Saving...');

        try {
            const response = await fetch('/api/add-workout-item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok || !data?.workout_added) {
                setPopupData({
                    title: 'Error!',
                    message: data?.message || 'Could not add workout.',
                    time: globalSettings.frmTimeError,
                    show_popup: true,
                });
                return;
            }

            await mutate('/api/get-all-workouts');
            resetForm();
            setPopupData({
                title: 'Message',
                message: data?.message || 'Workout added successfully.',
                time: globalSettings.frmTimeSuccess,
                show_popup: true,
            });
        } catch {
            setPopupData({
                title: 'Error!',
                message: 'Could not add workout.',
                time: globalSettings.frmTimeError,
                show_popup: true,
            });
        } finally {
            setIsSaving(false);
            setSaveBtnText('SAVE');
        }
    };

    return (
        <>
            <div className="min-h-[calc(100vh-120px)] pb-24">
                <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
                    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Workout</p>
                                <h1 className="mt-2 text-2xl font-bold md:text-3xl">Add Workout</h1>
                                <p className="mt-2 text-sm text-cyan-100">Create a new workout item in the workouts table.</p>
                            </div>
                            <div className="inline-flex rounded-xl bg-white/10 p-1">
                                <Link
                                    href="/dashboard/workouts/add"
                                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                                >
                                    Add Workout
                                </Link>
                                <Link
                                    href="/dashboard/workouts/list"
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 hover:text-white"
                                >
                                    Workout List
                                </Link>
                            </div>
                        </div>
                    </section>

                    <form onSubmit={handleSubmit} className="typical-form mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label htmlFor="w_title" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Title*
                                </label>
                                <input
                                    id="w_title"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (requiredErrors.title) setRequiredErrors((prev) => ({ ...prev, title: false }));
                                    }}
                                    className={`${inputBase} ${requiredErrors.title ? inputError : inputNormal}`}
                                    placeholder="e.g. Full Body HIIT"
                                />
                            </div>

                            <div>
                                <label htmlFor="w_type" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Type*
                                </label>
                                <input
                                    id="w_type"
                                    value={type}
                                    onChange={(e) => {
                                        setType(e.target.value);
                                        if (requiredErrors.type) setRequiredErrors((prev) => ({ ...prev, type: false }));
                                    }}
                                    className={`${inputBase} ${requiredErrors.type ? inputError : inputNormal}`}
                                    placeholder="e.g. Cardio"
                                />
                            </div>

                            <div>
                                <label htmlFor="w_calories" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Calories (kcal)*
                                </label>
                                <input
                                    id="w_calories"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={calories}
                                    onChange={(e) => {
                                        setCalories(e.target.value);
                                        if (requiredErrors.calories) setRequiredErrors((prev) => ({ ...prev, calories: false }));
                                    }}
                                    className={`${inputBase} ${requiredErrors.calories ? inputError : inputNormal}`}
                                />
                            </div>

                            <div>
                                <label htmlFor="w_time" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Time (min)*
                                </label>
                                <input
                                    id="w_time"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={time}
                                    onChange={(e) => {
                                        setTime(e.target.value);
                                        if (requiredErrors.time) setRequiredErrors((prev) => ({ ...prev, time: false }));
                                    }}
                                    className={`${inputBase} ${requiredErrors.time ? inputError : inputNormal}`}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="w_description" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Description
                                </label>
                                <textarea
                                    id="w_description"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                    placeholder="Optional workout notes"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saveBtnText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {popupData.show_popup ? <Toast popupData={popupData} setPopupData={setPopupData} /> : null}
        </>
    );
}
