'use client';

import React, { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';

type WorkoutItem = {
    id: string;
    w_title: string;
    w_description: string;
    w_type: string;
    w_calories: string;
    w_time: string;
    user_id?: number | string;
};

type EditableWorkoutForm = {
    w_title: string;
    w_description: string;
    w_type: string;
    w_calories: string;
    w_time: string;
};

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch workouts');
        return res.json();
    });

const toNumber = (value: string) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

const isSystemWorkout = (workout: WorkoutItem) => Number(workout.user_id || 0) === 0;

export default function WorkoutListPage() {
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [editForm, setEditForm] = useState<EditableWorkoutForm>({
        w_title: '',
        w_description: '',
        w_type: '',
        w_calories: '',
        w_time: '',
    });
    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const {
        data: workouts = [],
        error,
        isLoading,
    } = useSWR<WorkoutItem[]>('/api/get-all-workouts', fetcher, {
        dedupingInterval: 60_000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const filteredWorkouts = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();
        if (!searchTerm) return workouts;
        return workouts.filter((workout) => {
            return (
                workout.w_title.toLowerCase().includes(searchTerm) ||
                workout.w_type.toLowerCase().includes(searchTerm) ||
                workout.w_description.toLowerCase().includes(searchTerm)
            );
        });
    }, [workouts, search]);

    const startEdit = (workout: WorkoutItem) => {
        setEditingId(workout.id);
        setEditForm({
            w_title: workout.w_title || '',
            w_description: workout.w_description || '',
            w_type: workout.w_type || '',
            w_calories: workout.w_calories || '',
            w_time: workout.w_time || '',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({
            w_title: '',
            w_description: '',
            w_type: '',
            w_calories: '',
            w_time: '',
        });
    };

    const handleDelete = async (workoutId: string) => {
        const confirmed = window.confirm('Delete this workout?');
        if (!confirmed) return;

        setDeletingId(workoutId);
        try {
            const response = await fetch(`/api/delete-workout-item?wid=${workoutId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok || !data?.deleted) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not delete workout.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }

            await mutate('/api/get-all-workouts');
            setPopupData({ title: 'Message', message: data?.message || 'Workout deleted.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not delete workout.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingId || isSavingEdit) return;
        if (!editForm.w_title.trim() || !editForm.w_type.trim() || !editForm.w_calories || !editForm.w_time) {
            setPopupData({
                title: 'Error!',
                message: 'Title, type, calories and time are required.',
                time: globalSettings.frmTimeError,
                show_popup: true,
            });
            return;
        }

        setIsSavingEdit(true);
        try {
            const response = await fetch(`/api/update-workout-item?wid=${editingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    w_title: editForm.w_title.trim(),
                    w_description: editForm.w_description.trim(),
                    w_type: editForm.w_type.trim(),
                    w_calories: toNumber(editForm.w_calories),
                    w_time: toNumber(editForm.w_time),
                }),
            });
            const data = await response.json();
            if (!response.ok || !data?.updated) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not update workout.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }

            await mutate('/api/get-all-workouts');
            cancelEdit();
            setPopupData({ title: 'Message', message: data?.message || 'Workout updated.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not update workout.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setIsSavingEdit(false);
        }
    };

    return (
        <>
            <div className="mx-auto w-full max-w-[2200px] px-4 pb-24 md:px-8">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Workout</p>
                    <h1 className="mt-2 text-2xl font-bold md:text-3xl">Workout List</h1>
                    <p className="mt-2 text-sm text-cyan-100">System workouts and your personal workouts.</p>
                </section>

                <section className="mt-6 rounded-2xl bg-white p-4 md:p-7">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, type, or description"
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 md:max-w-sm"
                        />
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-semibold text-slate-900">{filteredWorkouts.length}</span> of{' '}
                            <span className="font-semibold text-slate-900">{workouts.length}</span>
                        </p>
                    </div>

                    {editingId ? (
                        <div className="mb-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
                            <p className="text-sm font-semibold text-cyan-900">Edit Workout</p>
                            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                <input
                                    value={editForm.w_title}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, w_title: e.target.value }))}
                                    placeholder="Title"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.w_type}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, w_type: e.target.value }))}
                                    placeholder="Type"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.w_calories}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, w_calories: e.target.value }))}
                                    placeholder="Calories"
                                    type="number"
                                    step="0.01"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.w_time}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, w_time: e.target.value }))}
                                    placeholder="Time (min)"
                                    type="number"
                                    step="0.01"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <textarea
                                    value={editForm.w_description}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, w_description: e.target.value }))}
                                    placeholder="Description"
                                    rows={3}
                                    className="md:col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    disabled={isSavingEdit}
                                    className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                                >
                                    {isSavingEdit ? 'Saving...' : 'Save'}
                                </button>
                                <button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : null}

                    {isLoading ? <p className="text-sm text-slate-500">Loading workouts...</p> : null}
                    {error ? <p className="text-sm text-rose-600">Could not load workouts.</p> : null}
                    {!isLoading && !error && filteredWorkouts.length === 0 ? <p className="text-sm text-slate-600">No workouts found.</p> : null}

                    {!isLoading && !error && filteredWorkouts.length > 0 ? (
                        <>
                            <div className="space-y-3 md:hidden">
                                {filteredWorkouts.map((workout) => {
                                    const canEdit = !isSystemWorkout(workout);
                                    return (
                                        <article key={workout.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-base font-semibold text-slate-900">{workout.w_title || '-'}</h3>
                                                <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{workout.w_type || '-'}</span>
                                            </div>
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                User: {canEdit ? 'Current User' : 'System'}
                                            </p>
                                            <p className="mt-2 text-sm text-slate-700">
                                                <span className="font-semibold text-slate-900">Calories:</span> {workout.w_calories || '-'} kcal
                                            </p>
                                            <p className="mt-1 text-sm text-slate-700">
                                                <span className="font-semibold text-slate-900">Time:</span> {workout.w_time || '-'} min
                                            </p>
                                            <p className="mt-3 text-sm text-slate-700">
                                                <span className="font-semibold text-slate-900">Description:</span> {workout.w_description?.trim() ? workout.w_description : '-'}
                                            </p>
                                            {canEdit ? (
                                                <div className="mt-3 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(workout)}
                                                        className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(workout.id)}
                                                        disabled={deletingId === workout.id}
                                                        className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-60"
                                                    >
                                                        {deletingId === workout.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            ) : null}
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                            <th className="px-4 py-3 font-semibold">Title</th>
                                            <th className="px-4 py-3 font-semibold">User</th>
                                            <th className="px-4 py-3 font-semibold">Type</th>
                                            <th className="px-4 py-3 font-semibold">Calories</th>
                                            <th className="px-4 py-3 font-semibold">Time</th>
                                            <th className="px-4 py-3 font-semibold">Description</th>
                                            <th className="px-4 py-3 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                                        {filteredWorkouts.map((workout) => {
                                            const canEdit = !isSystemWorkout(workout);
                                            return (
                                                <tr key={workout.id} className="hover:bg-slate-50/70">
                                                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">{workout.w_title || '-'}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{canEdit ? 'Current User' : 'System'}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{workout.w_type || '-'}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{workout.w_calories || '-'} kcal</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{workout.w_time || '-'} min</td>
                                                    <td className="min-w-[260px] px-4 py-3">{workout.w_description?.trim() ? workout.w_description : '-'}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">
                                                        {canEdit ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => startEdit(workout)}
                                                                    className="rounded-lg border border-cyan-300 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(workout.id)}
                                                                    disabled={deletingId === workout.id}
                                                                    className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 disabled:opacity-60"
                                                                >
                                                                    {deletingId === workout.id ? 'Deleting...' : 'Delete'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : null}
                </section>
            </div>

            {popupData.show_popup ? <Toast popupData={popupData} setPopupData={setPopupData} /> : null}
        </>
    );
}
