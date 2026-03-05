'use client';

import React, { useState } from 'react';
import { mutate } from 'swr';
import Link from 'next/link';
import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';
import { goalTypeOptions, goalsSWRKey, periodTypeOptions, getTodayDate } from '../goalsShared';

export default function AddGoalPage() {
    const [title, setTitle] = useState('');
    const [goalType, setGoalType] = useState('custom');
    const [targetValue, setTargetValue] = useState('');
    const [unit, setUnit] = useState('');
    const [periodType, setPeriodType] = useState('custom');
    const [startDate, setStartDate] = useState(getTodayDate);
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');
    const [showInCalendar, setShowInCalendar] = useState(true);
    const [showInDashboard, setShowInDashboard] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('SAVE');
    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const resetForm = () => {
        setTitle('');
        setGoalType('custom');
        setTargetValue('');
        setUnit('');
        setPeriodType('custom');
        setStartDate(getTodayDate());
        setEndDate('');
        setNotes('');
        setShowInCalendar(true);
        setShowInDashboard(true);
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
                    show_in_calendar: showInCalendar,
                    show_in_dashboard: showInDashboard,
                }),
            });

            const data = await response.json();
            if (!response.ok || !data?.goal_added) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not save goal.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }

            await mutate(goalsSWRKey);
            resetForm();
            setPopupData({ title: 'Message', message: data.message || 'Goal added successfully.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not save goal.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setIsSaving(false);
            setSaveBtnText('SAVE');
        }
    };

    const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition';
    const inputNormal = 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';

    return (
        <>
            <div className="mx-auto w-full max-w-[2200px] px-4 pb-24 md:px-8">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                    <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Data</p>
                            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Add Goal</h1>
                            <p className="mt-2 text-sm text-cyan-100">Create a new fitness target.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/dashboard/goals/view-goals"
                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
                            >
                                View Goals
                            </Link>
                        </div>
                    </div>
                </section>

                <form onSubmit={handleAddGoal} className="typical-form mt-6 rounded-2xl bg-white p-4 md:p-7">
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
                            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-3 text-sm font-semibold text-slate-700">Visibility</p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={showInCalendar}
                                            onChange={(e) => setShowInCalendar(e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                                        />
                                        Appear in Calendar
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={showInDashboard}
                                            onChange={(e) => setShowInDashboard(e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                                        />
                                        Appear in Dashboard
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button type="submit" disabled={isSaving} className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70">
                                {saveBtnText}
                            </button>
                        </div>
                </form>
            </div>
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
}
