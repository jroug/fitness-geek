"use client";

import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { mealTypeOpts, mealTypeOptions } from '@/lib/mealTypeOptions';
// import { globalSettings } from '@/lib/globalSettings';
import { getMealTypeFromTime } from '@/lib/getMealTypeFromTime';
import { geTimeFromMealType } from '@/lib/geTimeFromMealType';
import left_arrow from "../public/svg/black-left-arrow.svg";
import Image from "next/image";
import useSWR from 'swr';
import moment from 'moment';
 
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch meals');
    return res.json();
});

interface PopupFormData {
    title: string;
    dateSelected: Date;
    show_popup: boolean;
}

interface PopupFormProps {
    setPopupFormData: (data: PopupFormData) => void;
    popupFormData: PopupFormData;
    setUserMealsList: React.Dispatch<React.SetStateAction<MealEvent[]>>;
}



const toDate = (d: Date | string): Date => (d instanceof Date ? d : new Date(d));
const PopupForm: React.FC<PopupFormProps> = ({ setPopupFormData, popupFormData, setUserMealsList }) => {

 
   
       const getSelectedDateTime = useCallback(() => {
           const now = popupFormData.dateSelected ? new Date(popupFormData.dateSelected) : new Date();
           return (
               now.getFullYear() +
               '-' + String(now.getMonth() + 1).padStart(2, '0') +
               '-' + String(now.getDate()).padStart(2, '0') +
               'T' + String(now.getHours()).padStart(2, '0') +
               ':' + String(now.getMinutes()).padStart(2, '0')
           );
       }, [popupFormData.dateSelected]);

   
       const selectedDateTime = getSelectedDateTime();
       const [dateTimeErrorClass, setDateTimeErrorClass] = useState('');
       const [mealTitleErrorClass, setMealTitleErrorClass] = useState('');
       const [quantityErrorClass, setQuantityErrorClass] = useState('');

       // lock button on save action to prevent multiple submits while waiting for response and show the right text
       const [isSaving, setIsSaving] = useState(false);
       const [saveBtnText, setSaveBtnText] = useState('SAVE');

       // Local form state (initialised once, then kept in sync via useEffect below)
       const [dateTime, setDateTime] = useState<string>(selectedDateTime);
       const [mealType, setMealType] = useState(getMealTypeFromTime(selectedDateTime));

       // Keep form state in sync when the calendar selects a new slot/date.
       // `useState` initialisers run only once, so without this the modal can show stale values.
       useEffect(() => {
         if (!popupFormData.show_popup) return;

         const nextDT = getSelectedDateTime();
         setDateTime(nextDT);
         setMealType(getMealTypeFromTime(nextDT));

         // Clear any previous validation errors when opening/changing slot
         setDateTimeErrorClass('');
         setMealTitleErrorClass('');
         setQuantityErrorClass('');
       }, [popupFormData.show_popup, getSelectedDateTime]);
       
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
            if (isSaving) return false; // ⛔ already saving
            setIsSaving(true); // 🟢 lock
            setSaveBtnText('Saving...');
                      
            
           const addMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-meal`;
           const res = await fetch(addMealsUrl, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(input_data),
           });
           const data = await res.json();
           if (data.user_meal_added) {
            //    setPopupData({ title: 'Message', message: data.message, time:globalSettings.frmTimeSuccess, show_popup: true });

                // Optimistically add the new meal to the calendar list
                setUserMealsList((prev) => {
                  const newMealId = data.meal_return_object.ID.toString();

                  const start = new Date(dateTime);
                  const end = new Date(start.getTime() + 90 * 60 * 1000); // +1h 30m

                  const title = mealTypeOptions(getMealTypeFromTime(moment(start).format("YYYY-MM-DD HH:mm"))); // e.g. 09:00 am

                  const newMeal = {
                    id: newMealId,
                    f_title: data.meal_return_object.f_title,
                    f_category: data.meal_return_object.f_category,
                    f_comments: data.meal_return_object.f_comments,
                    portion_quantity: Number(mealQuantity) || 0,
                    portion_quantity_type: mealQuantityType,
                    serving_size: Number(mealSelected.serving_size) || 0,
                    calories: (() => {
                        const q = Number(mealQuantity) || 0;
                        const ss = Number(mealSelected.serving_size) || 0;
                        const factor = mealQuantityType === 'GR' ? (ss > 0 ? q / ss : 0) : q;
                        return (Number(mealSelected.calories) || 0) * factor;
                    })(),
                    protein: (() => {
                        const q = Number(mealQuantity) || 0;
                        const ss = Number(mealSelected.serving_size) || 0;
                        const factor = mealQuantityType === 'GR' ? (ss > 0 ? q / ss : 0) : q;
                        return (Number(mealSelected.protein) || 0) * factor;
                    })(),
                    carbohydrates: (() => {
                        const q = Number(mealQuantity) || 0;
                        const ss = Number(mealSelected.serving_size) || 0;
                        const factor = mealQuantityType === 'GR' ? (ss > 0 ? q / ss : 0) : q;
                        return (Number(mealSelected.carbohydrates) || 0) * factor;
                    })(),
                    fat: (() => {
                        const q = Number(mealQuantity) || 0;
                        const ss = Number(mealSelected.serving_size) || 0;
                        const factor = mealQuantityType === 'GR' ? (ss > 0 ? q / ss : 0) : q;
                        return (Number(mealSelected.fat) || 0) * factor;
                    })(),
                    fiber: (() => {
                        const q = Number(mealQuantity) || 0;
                        const ss = Number(mealSelected.serving_size) || 0;
                        const factor = mealQuantityType === 'GR' ? (ss > 0 ? q / ss : 0) : q;
                        return (Number(mealSelected.fiber) || 0) * factor;
                    })(),
                  };

                    const existingIndex = (prev as unknown as MealEventLike[]).findIndex((ev) => {
                    const evStart = toDate(ev.start);
                    return evStart.getTime() === start.getTime();
                });

                // If there is already an event at this exact start time, merge into it
                if (existingIndex !== -1) {
                    const existing = (prev as unknown as MealEventLike[])[existingIndex];
                    const mergedIds = existing?.id
                      ? `${existing.id},${newMealId}`
                      : newMealId;

                    const mergedMeals = Array.isArray(existing?.meals)
                      ? [...existing.meals, newMeal]
                      : [newMeal];

                    const existingEnd = toDate(existing.end);
                    const mergedEnd = existingEnd && !Number.isNaN(existingEnd.getTime())
                      ? new Date(Math.max(existingEnd.getTime(), end.getTime()))
                      : end;

                    const updatedEvent = {
                      ...existing,
                      id: mergedIds,
                      title: existing?.title ?? title,
                      start,
                      end: mergedEnd,
                      meals: mergedMeals,
                    } as unknown as MealEvent;

                    const next = [...prev];
                    next[existingIndex] = updatedEvent;
                    return next;
                  }

                  // Otherwise create a new event
                  const newEvent = {
                    id: newMealId,
                    title,
                    start,
                    end,
                    meals: [newMeal],
                  } as unknown as MealEvent;

                  return [...prev, newEvent];
                });

               // Reset form and close popup
                
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
                setPopupFormData({ title: '', dateSelected: new Date(), show_popup: false });
                setSaveBtnText('Save');
                setIsSaving(false); // 🔓 unlock
                return true;
           } else {
                //    setPopupData({ title: 'Error!', message: 'Something went wrong!', time:globalSettings.frmTimeError, show_popup: true });
                //    setPopupFormData({ title: '', dateSelected: new Date(), show_popup: false });
                alert('Error ?');
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
                    //    setTimeout(() => {
                        //    window.scrollTo(0, 0);
                    //    }, globalSettings.frmTimeSuccess);
               }
           } else {
               // alert('Complete all necessary fields!');
           }
    };

    const handleClosePopupForm = () => {
        setPopupFormData({ title: '', dateSelected: new Date(), show_popup: false });
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
 
        <div className={`modal fade logout-modal popupform-complete-modal ${popupFormData.show_popup ? "show-modal" : ""}`} id="popup-complete-modal" onClick={handleClosePopupForm}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-body"> 
                         <div className="close-popup-left-arrow">
                            <Image src={left_arrow} alt="back-btn-icon" className="scale13" onClick={handleClosePopupForm} />
                        </div>
                        <h1 className="modal-title text-center mb-4 sm-font-zen fw-400 mt-[-21px]">{popupFormData.title}</h1>
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
                                <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-full">{saveBtnText}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupForm;
