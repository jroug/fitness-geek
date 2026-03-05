'use client';

import React, { useState } from 'react';
import { mutate } from 'swr';
import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';

type AddFoodPayload = {
    food_name: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    category: string;
    serving_size: number;
    comments: string;
};

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

const toNumber = (value: string) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

export default function AddFoodPage() {
    const [foodName, setFoodName] = useState('');
    const [category, setCategory] = useState('');
    const [servingSize, setServingSize] = useState('100');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [fat, setFat] = useState('');
    const [fiber, setFiber] = useState('0');
    const [comments, setComments] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('SAVE');
    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition';
    const inputNormal = 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';

    const resetForm = () => {
        setFoodName('');
        setCategory('');
        setServingSize('100');
        setCalories('');
        setProtein('');
        setCarbohydrates('');
        setFat('');
        setFiber('0');
        setComments('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        if (!foodName.trim() || !category.trim() || !servingSize || !calories || !protein || !carbohydrates || !fat) {
            setPopupData({
                title: 'Error!',
                message: 'Food, category, serving size, calories, protein, carbs and fat are required.',
                time: globalSettings.frmTimeError,
                show_popup: true,
            });
            return;
        }

        const payload: AddFoodPayload = {
            food_name: foodName.trim(),
            category: category.trim(),
            serving_size: toNumber(servingSize),
            calories: toNumber(calories),
            protein: toNumber(protein),
            carbohydrates: toNumber(carbohydrates),
            fat: toNumber(fat),
            fiber: toNumber(fiber),
            comments: comments.trim(),
        };

        setIsSaving(true);
        setSaveBtnText('Saving...');

        try {
            const response = await fetch('/api/add-food', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok || !data?.food_added) {
                setPopupData({
                    title: 'Error!',
                    message: data?.message || 'Could not add food.',
                    time: globalSettings.frmTimeError,
                    show_popup: true,
                });
                return;
            }

            await mutate('/api/get-all-meals');
            resetForm();
            setPopupData({
                title: 'Message',
                message: data?.message || 'Food added successfully.',
                time: globalSettings.frmTimeSuccess,
                show_popup: true,
            });
        } catch {
            setPopupData({
                title: 'Error!',
                message: 'Could not add food.',
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
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Nutrition</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Add Food</h1>
                        <p className="mt-2 text-sm text-cyan-100">Create a new food item in the foods table.</p>
                    </section>

                    <form onSubmit={handleSubmit} className="typical-form mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label htmlFor="food_name" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Food Name*
                                </label>
                                <input
                                    id="food_name"
                                    value={foodName}
                                    onChange={(e) => setFoodName(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                    placeholder="e.g. Chicken Breast"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category*
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                >
                                    <option value="">Select category</option>
                                    {categoryOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="serving_size" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Serving Size (g)*
                                </label>
                                <input
                                    id="serving_size"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={servingSize}
                                    onChange={(e) => setServingSize(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                />
                            </div>

                            <div>
                                <label htmlFor="calories" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Calories (kcal)*
                                </label>
                                <input
                                    id="calories"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={calories}
                                    onChange={(e) => setCalories(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                />
                            </div>

                            <div>
                                <label htmlFor="protein" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Protein (g)*
                                </label>
                                <input
                                    id="protein"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={protein}
                                    onChange={(e) => setProtein(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                />
                            </div>

                            <div>
                                <label htmlFor="carbohydrates" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Carbohydrates (g)*
                                </label>
                                <input
                                    id="carbohydrates"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={carbohydrates}
                                    onChange={(e) => setCarbohydrates(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                />
                            </div>

                            <div>
                                <label htmlFor="fat" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Fat (g)*
                                </label>
                                <input
                                    id="fat"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={fat}
                                    onChange={(e) => setFat(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                />
                            </div>

                            <div>
                                <label htmlFor="fiber" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Fiber (g)
                                </label>
                                <input
                                    id="fiber"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={fiber}
                                    onChange={(e) => setFiber(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="comments" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Comments
                                </label>
                                <textarea
                                    id="comments"
                                    rows={3}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                    placeholder="Optional notes"
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
