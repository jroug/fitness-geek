'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useRouter } from 'next/navigation';
import { checkAuthAndRedirect } from "@/lib/checkAuthAndRedirect";
import Header from "@/components/Header";
import Popup from "@/components/Popup";

// Define interfaces for meal data
interface MealSuggestion {
    id: string;
    food_name: string;
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
    category: string;
    serving_size: string;
    comments: string;
}

interface MealInputData {
    datetime_of_meal: string;
    meal_id: string;
    meal_quantity: number;
    meal_quantity_type: string;
    comments: string;
}

const AddMeal: React.FC = () => {
    const router = useRouter();

    const [dateTimeErrorClass, setDateTimeErrorClass] = useState('');
    const [mealTitleErrorClass, setMealTitleErrorClass] = useState('');
    const [mealQuantity, setMealQuantity] = useState<number>(1);
    const [mealQuantityType, setMealQuantityType] = useState<string>('N');
    const [dateTime, setDateTime] = useState<string>('');
    const [mealSelected, setMealSelected] = useState<MealSuggestion>({
        id: "",
        food_name: "",
        calories: "",
        protein: "",
        carbohydrates: "",
        fat: "",
        fiber: "",
        category: "",
        serving_size: "",
        comments: ""
    });
    const [mealComments, setMealComments] = useState<string>('');
    const [suggestionMeals, setSuggestionMeals] = useState<MealSuggestion[]>([]);
    const [popupData, setPopupData] = useState({ title: '', message: '', show_popup: false });

    const getCurrentDateTime = (): string => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/Athens',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        const athensTime = new Intl.DateTimeFormat('en-GB', options).format(now);
        const [datePart, timePart] = athensTime.split(', ');
        const formattedDate = datePart.split('/').reverse().join('-');
        return `${formattedDate}T${timePart.replace(':', ':')}`;
    };

    const getMealSuggestions = async (): Promise<MealSuggestion[]> => {
        const fetchSuggestedMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-all-meals`;
        const res = await fetch(fetchSuggestedMealsUrl);
        const data = await res.json();
        setSuggestionMeals(data);
        return data;
    };

    const addMealToDB = async (input_data: MealInputData) => {
        const addMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-meal`;
        const res = await fetch(addMealsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input_data),
        });
        const data = await res.json();
        if (data.user_meal_added) {
            setPopupData({ title: 'Message', message: data.message, show_popup: true });
            setDateTime('');
            setMealQuantity(1);
            setMealQuantityType('N');
            setMealSelected({
                id: "",
                food_name: "",
                calories: "",
                protein: "",
                carbohydrates: "",
                fat: "",
                fiber: "",
                category: "",
                serving_size: "",
                comments: ""
            });
            setMealComments('');
        } else {
            setPopupData({ title: 'Message', message: 'Something went wrong!', show_popup: false });
        }
    };

    useEffect(() => {
        const getAddMealPageData = async () => {
            const ret = await checkAuthAndRedirect(router); // will redirect to root if no token found on http cookie
            if (ret) getMealSuggestions();
        }
        getAddMealPageData();
    }, [router]);

    const handleSetCurrentDateAndMeal = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setDateTime(getCurrentDateTime());
    };

    const handleMealSuggestionsInputChange = (_: React.SyntheticEvent, newValue: MealSuggestion | null) => {
        if (newValue) setMealSelected(newValue);
    };

    const handleMealComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMealComments(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let doSubmit = true;

        if (!mealSelected.id) {
            doSubmit = false;
            setMealTitleErrorClass("error2");
        } else {
            setMealTitleErrorClass("");
        }

        if (!dateTime) {
            doSubmit = false;
            setDateTimeErrorClass("error");
        } else {
            setDateTimeErrorClass("");
        }

        if (doSubmit) {
            const input_data: MealInputData = {
                datetime_of_meal: dateTime,
                meal_id: mealSelected.id,
                meal_quantity: mealQuantity,
                meal_quantity_type: mealQuantityType,
                comments: mealComments,
            };
            addMealToDB(input_data);
        } else {
            alert('Complete all necessary fields!');
        }
    };

    return (
        <>
            <main className="site-content">
                <Header title="Add Meal" backUrl="/homepage" />
                <div className="verify-email pb-20" id="feedback-main">
                    <div className="container">
                        <div className="feedback-content mt-16">
                            <div className="green-btn mt-4">
                                <Link href="#" onClick={handleSetCurrentDateAndMeal}>Set Current Date & Type</Link>
                            </div>
                            <form className="feedback-form" onSubmit={handleFormSubmit}>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="datetime-local" className="custom-lbl-feedback">Date & Time of meal*</label>
                                    <input 
                                        type="datetime-local" 
                                        id="datetime-local" 
                                        value={dateTime} 
                                        onChange={(e) => setDateTime(e.target.value)} 
                                        className={`border-green-1 ${dateTimeErrorClass}`}
                                    />
                                </div>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="meal-quantity" className="custom-lbl-feedback">Quantity*</label>
                                    <input 
                                        type="number" 
                                        id="meal-quantity" 
                                        min="1" 
                                        value={mealQuantity} 
                                        onChange={(e) => setMealQuantity(Number(e.target.value))} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="quantity-type" className="custom-lbl-feedback">Quantity Type*</label>
                                    <div className="custom-select-subject mt-8">
                                        <select 
                                            id="quantity-type" 
                                            value={mealQuantityType} 
                                            onChange={(e) => setMealQuantityType(e.target.value)}
                                            className="arrow-icon sm-font-sans border-green-1"
                                        >
                                            <option value="N">Number</option>
                                            <option value="GR">Grams</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="meal-short" className="custom-lbl-feedback">What did I eat?*</label>
                                    <Autocomplete
                                        className={`Autocomplete-green ${mealTitleErrorClass}`}
                                        value={mealSelected}
                                        options={suggestionMeals}
                                        getOptionLabel={(option) => (option.food_name ? option.food_name + ' - ' + Math.round(parseInt(option.serving_size)) + 'gr' : '') }
                                        onChange={handleMealSuggestionsInputChange}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                                    />
                                </div>
                                <div className="addmeal-div">
                                    <label htmlFor="meal-details" className="custom-lbl-feedback">Details</label>
                                    <div className="sm-font-sans custom-textarea-div mt-8 border-green-1">
                                        <table>
                                            <tbody>
                                                <tr><td>Category - Size:</td><td>{mealSelected.category} {mealSelected.serving_size && `- ${mealSelected.serving_size}gr`}</td></tr>
                                                <tr><td>Protein:</td><td>{mealSelected.protein && `${mealSelected.protein}gr`}</td></tr>
                                                <tr><td>Carbohydrates:</td><td>{mealSelected.carbohydrates && `${mealSelected.carbohydrates}gr`}</td></tr>
                                                <tr><td>Fat:</td><td>{mealSelected.fat && `${mealSelected.fat}gr`}</td></tr>
                                                <tr><td>Fiber:</td><td>{mealSelected.fiber && `${mealSelected.fiber}gr`}</td></tr>
                                                <tr><td><b>Calories:</b></td><td><b>{mealSelected.calories && `${mealSelected.calories} kcal`}</b></td></tr>
                                                <tr><td>Comments:</td><td>{mealSelected.comments}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="addmeal-div">
                                    <label htmlFor="comments" className="custom-lbl-feedback">Comments</label>
                                    <textarea 
                                        rows={4} 
                                        cols={50} 
                                        placeholder="Write here..." 
                                        className="sm-font-sans custom-textarea mt-8 border-green-1" 
                                        id="comments" 
                                        value={mealComments} 
                                        onChange={handleMealComments}
                                    ></textarea>
                                </div>
                                <div className="green-btn mt-4">
                                    <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-full">ADD</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Popup popupData={popupData} setPopupData={setPopupData} />
        </>
    );
};

export default AddMeal;
