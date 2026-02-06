'use client';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Toast from "@/components/Toast";
import { mealTypeOpts } from '@/lib/mealTypeOptions';
import { globalSettings } from '@/lib/globalSettings';
import { getCurrentDateTime } from '@/lib/getCurrentDateTime';
import { getMealTypeFromTime } from '@/lib/getMealTypeFromTime';
import { geTimeFromMealType } from '@/lib/geTimeFromMealType';
import useSWR from 'swr';
 
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch meals');
    return res.json();
});

const AddMeal: React.FC = () => {
    
    // const fetchSuggestedMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-all-meals`;


    const currentDateTime = getCurrentDateTime();

    const [dateTimeErrorClass, setDateTimeErrorClass] = useState('');
    const [mealTitleErrorClass, setMealTitleErrorClass] = useState('');
    const [quantityErrorClass, setQuantityErrorClass] = useState('');

    

    const [dateTime, setDateTime] = useState<string>(currentDateTime);
    const [mealType, setMealType] = useState(getMealTypeFromTime(currentDateTime));
    const [mealQuantity, setMealQuantity] = useState<number>(1) || '';
    const [mealQuantityType, setMealQuantityType] = useState<string>('N');
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
    // const [suggestionMeals, setSuggestionMeals] = useState<MealSuggestion[]>([]);
    const [popupData, setPopupData] = useState({ title: '', message: '', time:0, show_popup: false });



    const handleMealTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mealT = e.target.value;
        const mealD = geTimeFromMealType(mealT);

        setDateTime(mealD);
        setMealType(mealT);
    }

    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const mealD = e.target.value;
        const mealT = getMealTypeFromTime(mealD);

        setDateTime(mealD);
        setMealType(mealT);
    }

    const addMealToDB = async (input_data: MealInputData) => {
        const addMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-meal`;
        const res = await fetch(addMealsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input_data),
        });
        const data = await res.json();
        if (data.user_meal_added) {
            setPopupData({ title: 'Message', message: data.message, time:globalSettings.frmTimeSuccess, show_popup: true });
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
            setMealType('');
            return true;
        } else {
            setPopupData({ title: 'Error!', message: 'Something went wrong!', time:globalSettings.frmTimeError, show_popup: true });
            return false;
        }
    };

    
    // useEffect(() => {

    //     const getMealSuggestions = async (): Promise<void> => {    
    //         const res = await fetch(fetchSuggestedMealsUrl);
    //         const data = await res.json();
    //         setSuggestionMeals(data);
    //     };
    //     getMealSuggestions();
 
    // }, [fetchSuggestedMealsUrl]);

 

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

        if (!mealQuantity) {
            doSubmit = false;
            setQuantityErrorClass("error");
        } else {
            setQuantityErrorClass("");
        }

        if (doSubmit) {
            const input_data: MealInputData = {
                datetime_of_meal: dateTime,
                meal_id: mealSelected.id,
                meal_quantity: mealQuantity,
                meal_quantity_type: mealQuantityType,
                comments: mealComments,
            };
            // Wait for addMealToDB to complete and return true before scrolling
            const success = await addMealToDB(input_data);
            if (success) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, globalSettings.frmTimeSuccess);
            }
        } else {
            // alert('Complete all necessary fields!');
        }
    };

    // get the data of the page
    const { data: suggestionMeals = [], error, isLoading } = useSWR<MealSuggestion[]>('/api/get-all-meals', fetcher,
        {
            dedupingInterval: 60_000, // 1 minute
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    if (isLoading || error) {
        return (
            <></>
        );
    }

    return (
        <>
            <div className="verify-email pb-20" id="feedback-main">
                <div className="container">
                    <div className="feedback-content">
                        {/* <div className="green-btn mt-4">
                            <Link href="#" onClick={handleSetCurrentDateAndMeal}>Set Current Date & Type</Link>
                        </div> */}
                        <form className="feedback-form" onSubmit={handleFormSubmit}>

                            <div className="grid grid-cols-2 gap-3" >
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="quantity-type" className="custom-lbl-feedback">What type?</label>
                                    <div className="custom-select-subject">
                                        <select 
                                            id="quantity-type" 
                                            value={mealType} 
                                            onChange={handleMealTypeChange}
                                            className="arrow-icon sm-font-sans border-green-1"
                                        >
                                            <option key={"00"} value="" >...</option>
                                            {
                                                mealTypeOpts.map((meal) => {
                                                    return (
                                                        <option key={meal.key} value={meal.key} >{meal.label}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="datetime-local" className="custom-lbl-feedback">Date & Time of meal*</label>
                                    <input 
                                        type="datetime-local" 
                                        id="datetime-local" 
                                        value={dateTime} 
                                        onChange={handleDateTimeChange} 
                                        className={`border-green-1 ${dateTimeErrorClass}`}
                                    />
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
                            
                            <div className="grid grid-cols-2 gap-3" >
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="quantity-type" className="custom-lbl-feedback">Type*</label>
                                    <div className="custom-select-subject">
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
                                    <label htmlFor="meal-quantity" className="custom-lbl-feedback">Quan.*</label>
                                    <div className="custom-select-subject">
                                        <input 
                                            type="number"
                                            id="meal-quantity" 
                                            value={mealQuantity} 
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setMealQuantity(value === '' ? ('' as unknown as number) : Number(value));
                                                }}
                                                className={`sm-font-sans border-green-1 ${quantityErrorClass}`}
                                        />
                                    </div>
                                </div>
                            </div>



                            <div className="addmeal-div">
                                <label htmlFor="meal-details" className="custom-lbl-feedback">Details</label>
                                <div className="sm-font-sans custom-textarea-div border-green-1">
                                    <div className="meal-details-inline sm-font-sans">

                              
                                      {!mealSelected.id && <span>-</span>}

                                      {mealSelected.category && <span>Category: {mealSelected.category}, </span>}

                                      {mealSelected.serving_size && (
                                        <>
                                            <span> Size:</span>
                                            <b>
                                            {mealQuantity !== 1
                                                ? `${Number(mealSelected.serving_size).toFixed(0)} x ${mealQuantity} = ${(
                                                    Number(mealSelected.serving_size) * mealQuantity
                                                ).toFixed(0)}`
                                                : Number(mealSelected.serving_size).toFixed(0)
                                            }gr,&nbsp;
                                            </b>
                                        </>
                                      )}

                                      {mealSelected.protein && (
                                        <>
                                            <span> Protein:</span>
                                            <b>
                                            {mealQuantity !== 1
                                                ? `${Number(mealSelected.protein).toFixed(0)} x ${mealQuantity} = ${(
                                                    Number(mealSelected.protein) * mealQuantity
                                                ).toFixed(0)}`
                                                : Number(mealSelected.protein).toFixed(0)
                                            }gr,&nbsp;
                                            </b>
                                        </>
                                      )}

                                      {mealSelected.carbohydrates && (
                                        <>
                                            <span> Carbs:</span>
                                            <b>
                                            {mealQuantity !== 1
                                                ? `${Number(mealSelected.carbohydrates).toFixed(0)} x ${mealQuantity} = ${(
                                                    Number(mealSelected.carbohydrates) * mealQuantity
                                                ).toFixed(0)}`
                                                : Number(mealSelected.carbohydrates).toFixed(0)}
                                            gr,&nbsp;
                                            </b>
                                        </>
                                      )}

                                      {mealSelected.fat && (
                                        <>
                                            <span> Fat:</span>
                                            <b>
                                            {mealQuantity !== 1
                                                ? `${Number(mealSelected.fat).toFixed(0)} x ${mealQuantity} = ${(
                                                    Number(mealSelected.fat) * mealQuantity
                                                ).toFixed(0)}`
                                                : Number(mealSelected.fat).toFixed(0)}
                                            gr,&nbsp;
                                            </b>
                                        </>
                                      )}

                                      {mealSelected.fiber && (
                                        <>
                                            <span> Fiber:</span>
                                            <b>
                                            {mealQuantity !== 1
                                                ? `${Number(mealSelected.fiber).toFixed(0)} x ${mealQuantity} = ${(
                                                    Number(mealSelected.fiber) * mealQuantity
                                                ).toFixed(0)}`
                                                : Number(mealSelected.fiber).toFixed(0)}
                                            gr,&nbsp;
                                            </b>
                                        </>
                                      )}

                                      {mealSelected.calories && (
                                        <>
                                            <span> Calories:</span>
                                            <b>
                                            {mealQuantity !== 1
                                                ? `${Number(mealSelected.calories).toFixed(0)} x ${mealQuantity} = ${(
                                                    Number(mealSelected.calories) * mealQuantity
                                                ).toFixed(0)}`
                                                : Number(mealSelected.calories).toFixed(0)}
                                            kcal
                                            </b>
                                        </>
                                      )}

                                      {mealSelected.comments && <span>, Comments: {mealSelected.comments}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="addmeal-div">
                                <label htmlFor="comments" className="custom-lbl-feedback">Comments</label>
                                <textarea 
                                    rows={4} 
                                    cols={50} 
                                    placeholder="Write here..." 
                                    className="sm-font-sans custom-textarea border-green-1" 
                                    id="comments" 
                                    value={mealComments} 
                                    onChange={handleMealComments}
                                ></textarea>
                            </div>
                            <div className="green-btn mt-4">
                                <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-full">SAVE</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
};

export default AddMeal;
