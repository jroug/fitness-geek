'use client';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Toast from '@/components/Toast';
import { mealTypeOpts } from '@/lib/mealTypeOptions';
import { globalSettings } from '@/lib/globalSettings';
import { getCurrentDateTime } from '@/lib/getCurrentDateTime';
import { getMealTypeFromTime } from '@/lib/getMealTypeFromTime';
import { geTimeFromMealType } from '@/lib/geTimeFromMealType';
import useSWR from 'swr';

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch meals');
        return res.json();
    });

const AddMeal: React.FC = () => {
    const currentDateTime = getCurrentDateTime();

    const [dateTimeErrorClass, setDateTimeErrorClass] = useState('');
    const [mealTitleErrorClass, setMealTitleErrorClass] = useState('');
    const [quantityErrorClass, setQuantityErrorClass] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('SAVE');

    const [dateTime, setDateTime] = useState<string>(currentDateTime);
    const [mealType, setMealType] = useState(getMealTypeFromTime(currentDateTime));
    const [mealQuantity, setMealQuantity] = useState<number>(1) || '';
    const [mealQuantityType, setMealQuantityType] = useState<string>('N');
    const [mealSelected, setMealSelected] = useState<MealSuggestion>({
        id: '',
        food_name: '',
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        fiber: '',
        category: '',
        serving_size: '',
        comments: '',
    });
    const [mealComments, setMealComments] = useState<string>('');
    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const handleMealTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mealT = e.target.value;
        const mealD = geTimeFromMealType(mealT);

        setDateTime(mealD);
        setMealType(mealT);
    };

    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const mealD = e.target.value;
        const mealT = getMealTypeFromTime(mealD);

        setDateTime(mealD);
        setMealType(mealT);
    };

    const addMealToDB = async (input_data: MealInputData) => {
        if (isSaving) return false;
        setIsSaving(true);
        setSaveBtnText('Saving...');

        const addMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-meal`;
        const res = await fetch(addMealsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input_data),
        });
        const data = await res.json();
        if (data.user_meal_added) {
            setPopupData({ title: 'Message', message: data.message, time: globalSettings.frmTimeSuccess, show_popup: true });
            setDateTime('');
            setMealQuantity(1);
            setMealQuantityType('N');
            setMealSelected({
                id: '',
                food_name: '',
                calories: '',
                protein: '',
                carbohydrates: '',
                fat: '',
                fiber: '',
                category: '',
                serving_size: '',
                comments: '',
            });
            setMealComments('');
            setMealType('');
            setSaveBtnText('Save');
            setIsSaving(false);
            return true;
        } else {
            setPopupData({ title: 'Error!', message: 'Something went wrong!', time: globalSettings.frmTimeError, show_popup: true });
            return false;
        }
    };

    const handleMealSuggestionsInputChange = (_: React.SyntheticEvent, newValue: MealSuggestion | null) => {
        if (newValue) setMealSelected(newValue);
    };

    const handleMealComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMealComments(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let doSubmit = true;

        if (!mealSelected.id) {
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

        if (!mealQuantity) {
            doSubmit = false;
            setQuantityErrorClass('error');
        } else {
            setQuantityErrorClass('');
        }

        if (doSubmit) {
            const input_data: MealInputData = {
                datetime_of_meal: dateTime,
                meal_id: mealSelected.id,
                meal_quantity: mealQuantity,
                meal_quantity_type: mealQuantityType,
                comments: mealComments,
            };
            const success = await addMealToDB(input_data);
            if (success) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, globalSettings.frmTimeSuccess);
            }
        }
    };

    const {
        data: suggestionMeals = [],
        error,
        isLoading,
    } = useSWR<MealSuggestion[]>('/api/get-all-meals', fetcher, {
        dedupingInterval: 60_000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    if (isLoading || error) {
        return <></>;
    }

    const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition';
    const inputNormal = 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';
    const inputError = 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-200';

    const qty = typeof mealQuantity === 'number' ? mealQuantity : Number(mealQuantity || 0);

    return (
        <>
            <div className="min-h-[calc(100vh-120px)] pb-24">
                <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
                    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Form</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Add Meal</h1>
                        <p className="mt-2 text-sm text-cyan-100">Log meals quickly with automatic nutrient calculations.</p>
                    </section>

                    <form onSubmit={handleFormSubmit} className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="meal-type" className="mb-2 block text-sm font-semibold text-slate-700">
                                    What type?
                                </label>
                                <select
                                    id="meal-type"
                                    value={mealType}
                                    onChange={handleMealTypeChange}
                                    className={`${inputBase} ${inputNormal}`}
                                >
                                    <option key="00" value="">
                                        ...
                                    </option>
                                    {mealTypeOpts.map((meal) => (
                                        <option key={meal.key} value={meal.key}>
                                            {meal.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="datetime-local" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Date & Time of meal*
                                </label>
                                <input
                                    type="datetime-local"
                                    id="datetime-local"
                                    value={dateTime}
                                    onChange={handleDateTimeChange}
                                    className={`${inputBase} ${dateTimeErrorClass ? inputError : inputNormal}`}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="meal-short" className="mb-2 block text-sm font-semibold text-slate-700">
                                What did I eat?*
                            </label>
                            <Autocomplete
                                value={mealSelected}
                                options={suggestionMeals}
                                getOptionLabel={(option) =>
                                    option.food_name ? `${option.food_name} - ${Math.round(parseInt(option.serving_size, 10))}gr` : ''
                                }
                                onChange={handleMealSuggestionsInputChange}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        id="meal-short"
                                        variant="outlined"
                                        placeholder="Select meal"
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

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="quantity-type" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Type*
                                </label>
                                <select
                                    id="quantity-type"
                                    value={mealQuantityType}
                                    onChange={(e) => setMealQuantityType(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                >
                                    <option value="N">Number</option>
                                    <option value="GR">Grams</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="meal-quantity" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Quantity*
                                </label>
                                <input
                                    type="number"
                                    id="meal-quantity"
                                    value={mealQuantity}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setMealQuantity(value === '' ? ('' as unknown as number) : Number(value));
                                    }}
                                    className={`${inputBase} ${quantityErrorClass ? inputError : inputNormal}`}
                                />
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-700">Details</p>
                            <div className="mt-2 text-sm text-slate-700">
                                {!mealSelected.id && <span>-</span>}

                                {mealSelected.category && <span>Category: {mealSelected.category}, </span>}

                                {mealSelected.serving_size && (
                                    <>
                                        <span>Size:</span>
                                        <b>
                                            {' '}
                                            {qty !== 1
                                                ? `${Number(mealSelected.serving_size).toFixed(0)} x ${qty} = ${(
                                                      Number(mealSelected.serving_size) * qty
                                                  ).toFixed(0)}`
                                                : Number(mealSelected.serving_size).toFixed(0)}
                                            gr,&nbsp;
                                        </b>
                                    </>
                                )}

                                {mealSelected.protein && (
                                    <>
                                        <span>Protein:</span>
                                        <b>
                                            {' '}
                                            {qty !== 1
                                                ? `${Number(mealSelected.protein).toFixed(0)} x ${qty} = ${(
                                                      Number(mealSelected.protein) * qty
                                                  ).toFixed(0)}`
                                                : Number(mealSelected.protein).toFixed(0)}
                                            gr,&nbsp;
                                        </b>
                                    </>
                                )}

                                {mealSelected.carbohydrates && (
                                    <>
                                        <span>Carbs:</span>
                                        <b>
                                            {' '}
                                            {qty !== 1
                                                ? `${Number(mealSelected.carbohydrates).toFixed(0)} x ${qty} = ${(
                                                      Number(mealSelected.carbohydrates) * qty
                                                  ).toFixed(0)}`
                                                : Number(mealSelected.carbohydrates).toFixed(0)}
                                            gr,&nbsp;
                                        </b>
                                    </>
                                )}

                                {mealSelected.fat && (
                                    <>
                                        <span>Fat:</span>
                                        <b>
                                            {' '}
                                            {qty !== 1
                                                ? `${Number(mealSelected.fat).toFixed(0)} x ${qty} = ${(Number(mealSelected.fat) * qty).toFixed(0)}`
                                                : Number(mealSelected.fat).toFixed(0)}
                                            gr,&nbsp;
                                        </b>
                                    </>
                                )}

                                {mealSelected.fiber && (
                                    <>
                                        <span>Fiber:</span>
                                        <b>
                                            {' '}
                                            {qty !== 1
                                                ? `${Number(mealSelected.fiber).toFixed(0)} x ${qty} = ${(Number(mealSelected.fiber) * qty).toFixed(0)}`
                                                : Number(mealSelected.fiber).toFixed(0)}
                                            gr,&nbsp;
                                        </b>
                                    </>
                                )}

                                {mealSelected.calories && (
                                    <>
                                        <span>Calories:</span>
                                        <b>
                                            {' '}
                                            {qty !== 1
                                                ? `${Number(mealSelected.calories).toFixed(0)} x ${qty} = ${(Number(mealSelected.calories) * qty).toFixed(0)}`
                                                : Number(mealSelected.calories).toFixed(0)}
                                            kcal
                                        </b>
                                    </>
                                )}

                                {mealSelected.comments && <span>, Comments: {mealSelected.comments}</span>}
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
                                value={mealComments}
                                onChange={handleMealComments}
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

export default AddMeal;
