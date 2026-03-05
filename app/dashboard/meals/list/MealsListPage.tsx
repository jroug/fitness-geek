'use client';

import React, { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch meals');
        return res.json();
    });

const categoryOptions = [
    'Meat',
    'Fish',
    'Seafood',
    'Chicken',
    'Fruit',
    'Vegitables',
    'Dessert',
    'Junk',
    'Pastry',
    'Nuts',
    'Alcohol',
    'Eggs',
    'Protein',
];

const formatMacro = (value: string) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '-';
    return `${Math.round(num)} g`;
};

const formatCalories = (value: string) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '-';
    return `${Math.round(num)} kcal`;
};

const formatServing = (value: string) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '-';
    return `${Math.round(num)} g`;
};

type EditableFoodForm = {
    food_name: string;
    category: string;
    serving_size: string;
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
    comments: string;
};

const toNumber = (value: string) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

const isSystemFood = (meal: MealSuggestion) => Number(meal.user_id || 0) === 0;

export default function MealsListPage() {
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [editForm, setEditForm] = useState<EditableFoodForm>({
        food_name: '',
        category: '',
        serving_size: '',
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        fiber: '',
        comments: '',
    });
    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const {
        data: meals = [],
        error,
        isLoading,
    } = useSWR<MealSuggestion[]>('/api/get-all-meals', fetcher, {
        dedupingInterval: 60_000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const filteredMeals = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();
        if (!searchTerm) return meals;

        return meals.filter((meal) => {
            return (
                meal.food_name.toLowerCase().includes(searchTerm) ||
                meal.category.toLowerCase().includes(searchTerm) ||
                meal.comments.toLowerCase().includes(searchTerm)
            );
        });
    }, [meals, search]);

    const startEdit = (meal: MealSuggestion) => {
        setEditingId(meal.id);
        setEditForm({
            food_name: meal.food_name || '',
            category: meal.category || '',
            serving_size: meal.serving_size || '',
            calories: meal.calories || '',
            protein: meal.protein || '',
            carbohydrates: meal.carbohydrates || '',
            fat: meal.fat || '',
            fiber: meal.fiber || '0',
            comments: meal.comments || '',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({
            food_name: '',
            category: '',
            serving_size: '',
            calories: '',
            protein: '',
            carbohydrates: '',
            fat: '',
            fiber: '',
            comments: '',
        });
    };

    const handleDelete = async (foodId: string) => {
        const confirmed = window.confirm('Delete this food item?');
        if (!confirmed) return;

        setDeletingId(foodId);
        try {
            const response = await fetch(`/api/delete-food?fid=${foodId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok || !data?.deleted) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not delete food.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }

            await mutate('/api/get-all-meals');
            setPopupData({ title: 'Message', message: data?.message || 'Food deleted.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not delete food.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingId || isSavingEdit) return;
        if (!editForm.food_name.trim() || !editForm.category.trim() || !editForm.serving_size || !editForm.calories || !editForm.protein || !editForm.carbohydrates || !editForm.fat) {
            setPopupData({
                title: 'Error!',
                message: 'Food, category, serving size, calories, protein, carbs and fat are required.',
                time: globalSettings.frmTimeError,
                show_popup: true,
            });
            return;
        }

        setIsSavingEdit(true);
        try {
            const response = await fetch(`/api/update-food?fid=${editingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    food_name: editForm.food_name.trim(),
                    category: editForm.category.trim(),
                    serving_size: toNumber(editForm.serving_size),
                    calories: toNumber(editForm.calories),
                    protein: toNumber(editForm.protein),
                    carbohydrates: toNumber(editForm.carbohydrates),
                    fat: toNumber(editForm.fat),
                    fiber: toNumber(editForm.fiber),
                    comments: editForm.comments.trim(),
                }),
            });
            const data = await response.json();
            if (!response.ok || !data?.updated) {
                setPopupData({ title: 'Error!', message: data?.message || 'Could not update food.', time: globalSettings.frmTimeError, show_popup: true });
                return;
            }

            await mutate('/api/get-all-meals');
            cancelEdit();
            setPopupData({ title: 'Message', message: data?.message || 'Food updated.', time: globalSettings.frmTimeSuccess, show_popup: true });
        } catch {
            setPopupData({ title: 'Error!', message: 'Could not update food.', time: globalSettings.frmTimeError, show_popup: true });
        } finally {
            setIsSavingEdit(false);
        }
    };

    return (
        <>
            <div className="mx-auto w-full max-w-[2200px] px-4 pb-24 md:px-8">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Nutrition</p>
                            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Food List</h1>
                            <p className="mt-2 text-sm text-cyan-100">System foods and your personal foods.</p>
                        </div>
                        <div className="inline-flex rounded-xl bg-white/10 p-1">
                            <Link
                                href="/dashboard/meals/add"
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 hover:text-white"
                            >
                                Add Food
                            </Link>
                            <Link
                                href="/dashboard/meals/list"
                                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                            >
                                Food List
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl bg-white p-4 md:p-7">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by food, category, or comments"
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 md:max-w-sm"
                        />
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-semibold text-slate-900">{filteredMeals.length}</span> of{' '}
                            <span className="font-semibold text-slate-900">{meals.length}</span>
                        </p>
                    </div>

                    {editingId ? (
                        <div className="mb-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
                            <p className="text-sm font-semibold text-cyan-900">Edit Food</p>
                            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                                <input
                                    value={editForm.food_name}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, food_name: e.target.value }))}
                                    placeholder="Food name"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <select
                                    value={editForm.category}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                >
                                    <option value="">Select category</option>
                                    {categoryOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    value={editForm.serving_size}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, serving_size: e.target.value }))}
                                    placeholder="Serving size"
                                    type="number"
                                    step="0.01"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.calories}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, calories: e.target.value }))}
                                    placeholder="Calories"
                                    type="number"
                                    step="0.01"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.protein}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, protein: e.target.value }))}
                                    placeholder="Protein"
                                    type="number"
                                    step="0.01"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.carbohydrates}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, carbohydrates: e.target.value }))}
                                    placeholder="Carbs"
                                    type="number"
                                    step="0.01"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.fat}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, fat: e.target.value }))}
                                    placeholder="Fat"
                                    type="number"
                                    step="0.01"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.fiber}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, fiber: e.target.value }))}
                                    placeholder="Fiber"
                                    type="number"
                                    step="0.01"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    value={editForm.comments}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, comments: e.target.value }))}
                                    placeholder="Comments"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
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

                    {isLoading ? <p className="text-sm text-slate-500">Loading meals...</p> : null}
                    {error ? <p className="text-sm text-rose-600">Could not load meals.</p> : null}
                    {!isLoading && !error && filteredMeals.length === 0 ? <p className="text-sm text-slate-600">No meals found.</p> : null}

                    {!isLoading && !error && filteredMeals.length > 0 ? (
                        <>
                            <div className="space-y-3 md:hidden">
                                {filteredMeals.map((meal) => {
                                    const canEdit = !isSystemFood(meal);
                                    return (
                                        <article key={meal.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-base font-semibold text-slate-900">{meal.food_name || '-'}</h3>
                                                <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{meal.category || '-'}</span>
                                            </div>
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                User: {canEdit ? 'Current User' : 'System'}
                                            </p>
                                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
                                                <p><span className="font-semibold text-slate-900">Serving:</span> {formatServing(meal.serving_size)}</p>
                                                <p><span className="font-semibold text-slate-900">Calories:</span> {formatCalories(meal.calories)}</p>
                                                <p><span className="font-semibold text-slate-900">Protein:</span> {formatMacro(meal.protein)}</p>
                                                <p><span className="font-semibold text-slate-900">Carbs:</span> {formatMacro(meal.carbohydrates)}</p>
                                                <p><span className="font-semibold text-slate-900">Fat:</span> {formatMacro(meal.fat)}</p>
                                                <p><span className="font-semibold text-slate-900">Fiber:</span> {formatMacro(meal.fiber)}</p>
                                            </div>
                                            <p className="mt-3 text-sm text-slate-700">
                                                <span className="font-semibold text-slate-900">Comments:</span> {meal.comments?.trim() ? meal.comments : '-'}
                                            </p>
                                            {canEdit ? (
                                                <div className="mt-3 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(meal)}
                                                        className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(meal.id)}
                                                        disabled={deletingId === meal.id}
                                                        className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-60"
                                                    >
                                                        {deletingId === meal.id ? 'Deleting...' : 'Delete'}
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
                                            <th className="px-4 py-3 font-semibold">Food</th>
                                            <th className="px-4 py-3 font-semibold">User</th>
                                            <th className="px-4 py-3 font-semibold">Category</th>
                                            <th className="px-4 py-3 font-semibold">Serving</th>
                                            <th className="px-4 py-3 font-semibold">Calories</th>
                                            <th className="px-4 py-3 font-semibold">Protein</th>
                                            <th className="px-4 py-3 font-semibold">Carbs</th>
                                            <th className="px-4 py-3 font-semibold">Fat</th>
                                            <th className="px-4 py-3 font-semibold">Fiber</th>
                                            <th className="px-4 py-3 font-semibold">Comments</th>
                                            <th className="px-4 py-3 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                                        {filteredMeals.map((meal) => {
                                            const canEdit = !isSystemFood(meal);
                                            return (
                                                <tr key={meal.id} className="hover:bg-slate-50/70">
                                                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">{meal.food_name || '-'}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{canEdit ? 'Current User' : 'System'}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{meal.category || '-'}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{formatServing(meal.serving_size)}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{formatCalories(meal.calories)}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{formatMacro(meal.protein)}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{formatMacro(meal.carbohydrates)}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{formatMacro(meal.fat)}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">{formatMacro(meal.fiber)}</td>
                                                    <td className="min-w-[220px] px-4 py-3">{meal.comments?.trim() ? meal.comments : '-'}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">
                                                        {canEdit ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => startEdit(meal)}
                                                                    className="rounded-lg border border-cyan-300 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(meal.id)}
                                                                    disabled={deletingId === meal.id}
                                                                    className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 disabled:opacity-60"
                                                                >
                                                                    {deletingId === meal.id ? 'Deleting...' : 'Delete'}
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
