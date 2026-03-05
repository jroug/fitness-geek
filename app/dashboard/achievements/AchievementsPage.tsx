'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { GoalRow, goalsFetcher, goalsSWRKey } from '../goals/goalsShared';

const formatDateTime = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
};

export default function AchievementsPage() {
    const { data: goals = [], error, isLoading } = useSWR<GoalRow[]>(goalsSWRKey, goalsFetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const completedGoals = goals.filter((goal) => goal.status === 'completed');

    return (
        <div className="mx-auto w-full max-w-[2200px] px-4 pb-24 md:px-8">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Progress</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Achievements</h1>
                        <p className="mt-2 text-sm text-emerald-100">All completed goals are listed here.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/goals/view-goals"
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-100"
                        >
                            View Goals
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mt-6 rounded-2xl bg-white p-4 md:p-7">
                {isLoading ? <p className="text-sm text-slate-500">Loading achievements...</p> : null}
                {error ? <p className="text-sm text-rose-600">Could not load achievements.</p> : null}
                {!isLoading && !error && completedGoals.length === 0 ? (
                    <p className="text-sm text-slate-600">No completed goals yet.</p>
                ) : null}

                {!isLoading && !error && completedGoals.length > 0 ? (
                    <div className="space-y-3">
                        {completedGoals.map((goal) => (
                            <article key={goal.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-lg font-semibold text-slate-900">{goal.title}</h3>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Target: <span className="font-semibold text-slate-900">{goal.target_value} {goal.unit || ''}</span>
                                        </p>
                                    </div>
                                    <div className="text-sm text-slate-700">
                                        <p>
                                            Completed on:{' '}
                                            <span className="font-semibold text-slate-900">{formatDateTime(goal.completed_at)}</span>
                                        </p>
                                    </div>
                                </div>
                                {goal.notes ? <p className="mt-3 text-sm text-slate-700">{goal.notes}</p> : null}
                            </article>
                        ))}
                    </div>
                ) : null}
            </section>
        </div>
    );
}
