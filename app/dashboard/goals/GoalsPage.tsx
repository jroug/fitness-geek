'use client';

import React, { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';

interface GoalRow {
    id: number;
    title: string;
    goal_type: string;
    target_value: string | number;
    current_value: string | number;
    unit: string;
    period_type: string;
    start_date: string;
    end_date: string | null;
    status: string;
    notes: string | null;
}

type GoalTypeOption = { value: string; label: string };

const goalTypeOptions: GoalTypeOption[] = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'body_fat', label: 'Body Fat' },
    { value: 'steps', label: 'Steps' },
    { value: 'workouts', label: 'Workouts' },
    { value: 'strength', label: 'Strength' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'calories_burned', label: 'Calories Burned' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'protein', label: 'Protein' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'hydration', label: 'Hydration' },
    { value: 'habit_streak', label: 'Habit Streak' },
    { value: 'event_prep', label: 'Event Prep' },
    { value: 'custom', label: 'Custom' },
];

const periodTypeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' },
];

const goalsFetcher = async (url: string): Promise<GoalRow[]> => {
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch goals');
    return response.json();
};

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function GoalsPage() {
    const [title, setTitle] = useState('');
    const [goalType, setGoalType] = useState('custom');
    const [targetValue, setTargetValue] = useState('');
    const [unit, setUnit] = useState('');
    const [periodType, setPeriodType] = useState('custom');
    const [startDate, setStartDate] = useState(getTodayDate);
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('SAVE');
    const [deletingGoalId, setDeletingGoalId] = useState<number | null>(null);
    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const swrKey = '/api/get-goals';
    const { data: goals = [], error, isLoading } = useSWR<GoalRow[]>(swrKey, goalsFetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const goalTypeMap = useMemo(() => {
        const map: Record<string, string> = {};
        goalTypeOptions.forEach((opt) => {
            map[opt.value] = opt.label;
        });
        return map;
    }, []);

    const periodTypeMap = useMemo(() => {
        const map: Record<string, string> = {};
        periodTypeOptions.forEach((opt) => {
            map[opt.value] = opt.label;
        });
        return map;
    }, []);

    const resetForm = () => {
        setTitle('');
        setGoalType('custom');
        setTargetValue('');
        setUnit('');
        setPeriodType('custom');
        setStartDate(getTodayDate());
        setEndDate('');
        setNotes('');
    };

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !targetValue || !startDate) {
            setPopupData({ title: 'Error!', message: 'Title, target value and start date are required.', time: globalSettings.frmTimeError, show_popup: true });
            return;
        }

        if (isSaving) return;
        setIsSaving(true);
        setSaveBtnText('Saving...');

        try {
            const response = await fetch('/api/add-goal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    goal_type: goalType,
                    target_value: targetValue,
                    unit: unit.trim(),
                    period_type: periodType,
                    start_date: startDate,
                    end_date: endDate || null,
                    notes: notes.trim(),
                }),
            });

            const data = await response.json();
            if (!response.ok || !data?.goal_added) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not save goal.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }

            await mutate(swrKey);
            resetForm();
            setPopupData({ title: 'Message', message: data.message || 'Goal added successfully.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not save goal.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setIsSaving(false);
            setSaveBtnText('SAVE');
        }
    };

    const handleDeleteGoal = async (goalId: number) => {
        const confirmed = window.confirm('Delete this goal?');
        if (!confirmed) return;

        setDeletingGoalId(goalId);
        try {
            const response = await fetch(`/api/delete-goal?gid=${goalId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok || !data?.deleted) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not delete goal.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }
            await mutate(swrKey);
            setPopupData({ title: 'Message', message: data.message || 'Goal deleted.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not delete goal.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setDeletingGoalId(null);
        }
    };

    const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition';
    const inputNormal = 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';

    return (
        <>
            <div className="min-h-[calc(100vh-120px)] pb-24">
                <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
                    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Goals</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Track Your Targets</h1>
                        <p className="mt-2 text-sm text-cyan-100">Create, view and remove your fitness goals.</p>
                    </section>

                    <form onSubmit={handleAddGoal} className="typical-form mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label htmlFor="goal-title" className="mb-2 block text-sm font-semibold text-slate-700">Title*</label>
                                <input id="goal-title" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputBase} ${inputNormal}`} placeholder="e.g. Lose 5kg in 12 weeks" />
                            </div>
                            <div>
                                <label htmlFor="goal-type" className="mb-2 block text-sm font-semibold text-slate-700">Goal Type</label>
                                <select id="goal-type" value={goalType} onChange={(e) => setGoalType(e.target.value)} className={`${inputBase} ${inputNormal}`}>
                                    {goalTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="period-type" className="mb-2 block text-sm font-semibold text-slate-700">Period</label>
                                <select id="period-type" value={periodType} onChange={(e) => setPeriodType(e.target.value)} className={`${inputBase} ${inputNormal}`}>
                                    {periodTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="target-value" className="mb-2 block text-sm font-semibold text-slate-700">Target Value*</label>
                                <input id="target-value" type="number" step="0.01" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} className={`${inputBase} ${inputNormal}`} placeholder="e.g. 5" />
                            </div>
                            <div>
                                <label htmlFor="goal-unit" className="mb-2 block text-sm font-semibold text-slate-700">Unit</label>
                                <input id="goal-unit" value={unit} onChange={(e) => setUnit(e.target.value)} className={`${inputBase} ${inputNormal}`} placeholder="kg, steps, workouts..." />
                            </div>
                            <div>
                                <label htmlFor="goal-start" className="mb-2 block text-sm font-semibold text-slate-700">Start Date*</label>
                                <input id="goal-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="goal-end" className="mb-2 block text-sm font-semibold text-slate-700">End Date</label>
                                <input id="goal-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="goal-notes" className="mb-2 block text-sm font-semibold text-slate-700">Notes</label>
                                <textarea id="goal-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputBase} ${inputNormal}`} placeholder="Optional details..." />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button type="submit" disabled={isSaving} className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70">
                                {saveBtnText}
                            </button>
                        </div>
                    </form>

                    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">My Goals</h2>
                        </div>

                        {isLoading ? <p className="text-sm text-slate-500">Loading goals...</p> : null}
                        {error ? <p className="text-sm text-rose-600">Could not load goals.</p> : null}
                        {!isLoading && !error && goals.length === 0 ? <p className="text-sm text-slate-500">No goals yet.</p> : null}

                        {!isLoading && !error && goals.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {goals.map((goal) => (
                                    <article key={goal.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-base font-semibold text-slate-900">{goal.title}</h3>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    Target: <strong>{goal.target_value}</strong> {goal.unit || ''} | Type: {goalTypeMap[goal.goal_type] || goal.goal_type} | Period: {periodTypeMap[goal.period_type] || goal.period_type}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {goal.start_date}{goal.end_date ? ` -> ${goal.end_date}` : ''} | Status: {goal.status}
                                                </p>
                                                {goal.notes ? <p className="mt-2 text-sm text-slate-700">{goal.notes}</p> : null}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteGoal(goal.id)}
                                                disabled={deletingGoalId === goal.id}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Delete goal"
                                                title="Delete goal"
                                            >
                                                <img src="/svg/trashbin.svg" alt="Delete" className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : null}
                    </section>
                </div>
            </div>
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
}
