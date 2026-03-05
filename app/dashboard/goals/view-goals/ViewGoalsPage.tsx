'use client';

import React, { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';
import { goalTypeOptions, goalsFetcher, goalsSWRKey, GoalRow, periodTypeOptions } from '../goalsShared';

export default function ViewGoalsPage() {
    const [deletingGoalId, setDeletingGoalId] = useState<number | null>(null);
    const [updatingStatusGoalId, setUpdatingStatusGoalId] = useState<number | null>(null);
    const [updatingVisibilityGoalId, setUpdatingVisibilityGoalId] = useState<number | null>(null);
    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const { data: goals = [], error, isLoading } = useSWR<GoalRow[]>(goalsSWRKey, goalsFetcher, {
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
            await mutate(goalsSWRKey);
            setPopupData({ title: 'Message', message: data.message || 'Goal deleted.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not delete goal.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setDeletingGoalId(null);
        }
    };

    const handleUpdateGoalStatus = async (goalId: number, status: 'active' | 'completed' | 'canceled' | 'paused') => {
        setUpdatingStatusGoalId(goalId);
        try {
            const response = await fetch('/api/update-goal-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gid: goalId, status }),
            });
            const data = await response.json();
            if (!response.ok || !data?.updated) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not update goal status.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }
            await mutate(goalsSWRKey);
            setPopupData({ title: 'Message', message: data.message || 'Goal status updated.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not update goal status.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setUpdatingStatusGoalId(null);
        }
    };

    const formatCompletionDate = (completedAt?: string | null) => {
        if (!completedAt) return '-';
        const date = new Date(completedAt);
        if (Number.isNaN(date.getTime())) return completedAt;
        return date.toLocaleString();
    };

    const isTruthyVisibility = (value?: boolean | number) => value === true || Number(value) === 1;

    const handleUpdateGoalVisibility = async (goalId: number, showInCalendar: boolean, showInDashboard: boolean) => {
        setUpdatingVisibilityGoalId(goalId);
        try {
            const response = await fetch('/api/update-goal-visibility', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gid: goalId,
                    show_in_calendar: showInCalendar,
                    show_in_dashboard: showInDashboard,
                }),
            });

            const data = await response.json();
            if (!response.ok || !data?.updated) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not update goal visibility.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }

            await mutate(goalsSWRKey);
            setPopupData({ title: 'Message', message: data.message || 'Goal visibility updated.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not update goal visibility.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setUpdatingVisibilityGoalId(null);
        }
    };

    return (
        <>
            <div className="mx-auto w-full max-w-[2200px] px-4 pb-24 md:px-8">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                    <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Data</p>
                            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Goals History</h1>
                            <p className="mt-2 text-sm text-cyan-100">Review and manage your goals.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/dashboard/goals/add-goal"
                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
                            >
                                Add Goal
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl bg-white p-4 md:p-7">
                    {isLoading ? <p className="text-sm text-slate-500">Loading goals...</p> : null}
                    {error ? <p className="text-sm text-rose-600">Could not load goals.</p> : null}
                    {!isLoading && !error && goals.length === 0 ? <p className="text-sm text-slate-600">No goals found.</p> : null}

                    {!isLoading && !error && goals.length > 0 ? (
                        <div className="space-y-3">
                            {goals.map((goal) => {
                                const isCompleted = goal.status === 'completed';
                                const isCanceled = goal.status === 'canceled';
                                const isPaused = goal.status === 'paused';
                                const isDeleting = deletingGoalId === goal.id;
                                const isUpdatingStatus = updatingStatusGoalId === goal.id;
                                const isUpdatingVisibility = updatingVisibilityGoalId === goal.id;
                                const showInCalendar = isTruthyVisibility(goal.show_in_calendar);
                                const showInDashboard = isTruthyVisibility(goal.show_in_dashboard);
                                return (
                                    <article
                                        key={goal.id}
                                        className={`rounded-2xl border p-4 shadow-sm transition ${
                                            isCompleted
                                                ? 'border-emerald-200 bg-emerald-50/40'
                                                : isCanceled
                                                    ? 'border-amber-200 bg-amber-50/40'
                                                    : isPaused
                                                        ? 'border-indigo-200 bg-indigo-50/40'
                                                    : 'border-slate-200 bg-white'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="truncate text-lg font-semibold text-slate-900">{goal.title}</h3>
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                                            isCompleted
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : isCanceled
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : isPaused
                                                                        ? 'bg-indigo-100 text-indigo-700'
                                                                    : 'bg-cyan-100 text-cyan-700'
                                                        }`}
                                                    >
                                                        {isCompleted ? 'Completed' : isCanceled ? 'Canceled' : isPaused ? 'Paused' : 'Active'}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-600">{goalTypeMap[goal.goal_type] || goal.goal_type}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5 lg:min-w-[560px]">
                                                <div className="rounded-xl bg-slate-50 p-2.5">
                                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Target</p>
                                                    <p className="mt-0.5 font-semibold text-slate-900">{goal.target_value} {goal.unit || ''}</p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 p-2.5">
                                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Period</p>
                                                    <p className="mt-0.5 font-semibold text-slate-900">{periodTypeMap[goal.period_type] || goal.period_type}</p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 p-2.5">
                                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Start</p>
                                                    <p className="mt-0.5 font-semibold text-slate-900">{goal.start_date}</p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 p-2.5">
                                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">End</p>
                                                    <p className="mt-0.5 font-semibold text-slate-900">{goal.end_date || '-'}</p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 p-2.5">
                                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Completed On</p>
                                                    <p className="mt-0.5 font-semibold text-slate-900">{formatCompletionDate(goal.completed_at)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={goal.status === 'completed' ? 'completed' : goal.status === 'canceled' ? 'canceled' : goal.status === 'paused' ? 'paused' : 'active'}
                                                    onChange={(e) => handleUpdateGoalStatus(goal.id, e.target.value as 'active' | 'completed' | 'canceled' | 'paused')}
                                                    disabled={isUpdatingStatus}
                                                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="canceled">Canceled</option>
                                                    <option value="paused">Paused</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                    disabled={isDeleting}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                    aria-label="Delete goal"
                                                    title="Delete goal"
                                                >
                                                    <img src="/svg/trashbin.svg" alt="" className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {goal.notes ? <p className="mt-3 text-sm text-slate-700">{goal.notes}</p> : null}
                                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                                            <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={showInCalendar}
                                                    disabled={isUpdatingVisibility}
                                                    onChange={(e) => handleUpdateGoalVisibility(goal.id, e.target.checked, showInDashboard)}
                                                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 disabled:cursor-not-allowed"
                                                />
                                                Appear in Calendar
                                            </label>
                                            <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={showInDashboard}
                                                    disabled={isUpdatingVisibility}
                                                    onChange={(e) => handleUpdateGoalVisibility(goal.id, showInCalendar, e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 disabled:cursor-not-allowed"
                                                />
                                                Appear in Dashboard
                                            </label>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : null}
                </section>
            </div>
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
}
