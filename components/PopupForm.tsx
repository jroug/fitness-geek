"use client";

import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { mealTypeOpts } from '@/lib/mealTypeOptions';
import { globalSettings } from '@/lib/globalSettings';

import useSWR from 'swr';
 
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

type MealApiItem = {
  id: string;
  f_title: string;
  f_category: string;
  f_comments: string;
};

type MealEventLike = {
  id?: string;
  title?: string;
  start: Date | string;
  end: Date | string;
  meals?: MealApiItem[];
};

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
   
       const getMealTypeFromTime = (pDate:string): string => {
   
           const passedDate = new Date(pDate); // Create a new date based on stTime
    
           const passedHours = passedDate.getHours();
           const passedMinutes = passedDate.getMinutes();
   
           // Check the range and set the target time accordingly
           if ((passedHours >= 7 && passedHours < 11) || (passedHours === 11 && passedMinutes < 30)) {
               // Between 7:00 AM and 11:30 AM
               return "B"; // "Breakfast"
           } else if ((passedHours === 11 && passedMinutes >= 30) || (passedHours >= 12 && passedHours < 14)) {
               // Between 11:30 AM and 2:00 PM
               return "MS"; // "Morning Snack"
           } else if ((passedHours >= 14 && passedHours < 16) || (passedHours === 16 && passedMinutes < 30)) {
               // Between 2:00 PM and 4:30 PM
               return "L"; // "Lunch"
           } else if ((passedHours === 16 && passedMinutes >= 30) || (passedHours >= 17 && passedHours < 19)) {
               // Between 4:30 PM and 7:00 PM
               return "AS"; // "Afternoon Snack"
           } else if ((passedHours >= 19 && passedHours < 21) || (passedHours === 21 && passedMinutes < 30)) {
               // Between 7:00 PM and 9:30 PM
               return "PW"; // "Post Workout"
           } else if ((passedHours === 21 && passedMinutes >= 30) || (passedHours >= 21 && passedHours < 23)) {
               // Between 7:00 PM and 9:30 PM
               return "D"; // "Dinner"
           } else {
               // Any other time
               return "OTH"; // "OTHER"
           }
   
       };
       
       const geTimeFromMealType = (mealT : string): string => {
           let retTime = '';
   
           const currentDate = new Date(); // Create a new date based on stTime
           const currentYear = currentDate.getFullYear();
           const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
           const currentDay = String(currentDate.getDate()).padStart(2, '0');
           
           switch (mealT) {
               case "B":
                   retTime = '09:00';
                   break;
               case "MS":
                   retTime = '11:30';
                   break;
               case "L":
                   retTime = '14:00';
                   break;
               case "AS":
                   retTime = '16:30';
                   break;
               case "PW":
                   retTime = '19:00';
                   break;
               case "D":
                   retTime = '21:30';
                   break;
               default:
                   retTime = '23:00';
           }
   
           return `${currentYear}-${currentMonth}-${currentDay}T${retTime}`;
       }
   
   
   
       const selectedDateTime = getSelectedDateTime();

       const [dateTimeErrorClass, setDateTimeErrorClass] = useState('');
       const [mealTitleErrorClass, setMealTitleErrorClass] = useState('');
       const [quantityErrorClass, setQuantityErrorClass] = useState('');

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
    //    const [suggestionMeals, setSuggestionMeals] = useState<MealSuggestion[]>([]);
    //    const [popupData, setPopupData] = useState({ title: '', message: '', time:0, show_popup: false });
   
    //    const getMealSuggestions = async (): Promise<MealSuggestion[]> => {
    //        const fetchSuggestedMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-all-meals`;
    //        const res = await fetch(fetchSuggestedMealsUrl);
    //        const data = await res.json();
    //        setSuggestionMeals(data);
    //        return data;
    //    };
   
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
            //    setPopupData({ title: 'Message', message: data.message, time:globalSettings.frmTimeSuccess, show_popup: true });

                // Optimistically add the new meal to the calendar list
                setUserMealsList((prev) => {
                  const newMealId = data.meal_return_object.ID.toString();

                  const start = new Date(dateTime);
                  const end = new Date(start.getTime() + 90 * 60 * 1000); // +1h 30m

                  const title = start.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }); // e.g. 09:00 am

                  const newMeal = {
                    id: newMealId,
                    f_title: data.meal_return_object.f_title,
                    f_category: data.meal_return_object.f_category,
                    f_comments: data.meal_return_object.f_comments,
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
                setPopupFormData({ title: '', dateSelected: new Date(), show_popup: false });
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
                //    setPopupData({ title: 'Error!', message: 'Something went wrong!', time:globalSettings.frmTimeError, show_popup: true });
                //    setPopupFormData({ title: '', dateSelected: new Date(), show_popup: false });
                alert('Error ?');
               return false;
           }
       };
   
    //    useEffect(() => {
    //        const getAddMealPageData = async () => {
    //            getMealSuggestions();
    //        }
    //        getAddMealPageData();
    //    }, [router]);
   
       // const handleSetCurrentDateAndMeal = (e: React.MouseEvent<HTMLAnchorElement>) => {
       //     e.preventDefault();
       //     setDateTime(getSelectedDateTime());
       // };
   
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
                        <h1 className="modal-title text-center mb-4 sm-font-zen fw-400">{popupFormData.title}</h1>
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
                                    <table className="meal-details-table">
                                        <tbody>
                                            <tr><td>Category: </td><td>{mealSelected.category}</td></tr>
                                            <tr>
                                                <td>Size(gr): </td>
                                                <td>
                                                    {mealSelected.serving_size &&
                                                        (mealQuantity !== 1
                                                            ? <>{`${Number(mealSelected.serving_size).toFixed(0)} x ${mealQuantity} = `} <b>{(Number(mealSelected.serving_size) * mealQuantity).toFixed(0)}</b></>
                                                            : <b>{Number(mealSelected.serving_size).toFixed(0)}</b>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Protein(gr): </td>
                                                <td>
                                                    {mealSelected.protein &&
                                                        (mealQuantity !== 1
                                                            ? <>{`${Number(mealSelected.protein).toFixed(0)} x ${mealQuantity} = `} <b>{(Number(mealSelected.protein) * mealQuantity).toFixed(0)}</b></>
                                                            : <b>{Number(mealSelected.protein).toFixed(0)}</b>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Carbs(gr): </td>
                                                <td>
                                                    {mealSelected.carbohydrates &&
                                                        (mealQuantity !== 1
                                                            ? <>{`${Number(mealSelected.carbohydrates).toFixed(0)} x ${mealQuantity} = `} <b>{(Number(mealSelected.carbohydrates) * mealQuantity).toFixed(0)}</b></>
                                                            : <b>{Number(mealSelected.carbohydrates).toFixed(0)}</b>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Fat(gr): </td>
                                                <td>
                                                    {mealSelected.fat &&
                                                        (mealQuantity !== 1
                                                            ? <>{`${Number(mealSelected.fat).toFixed(0)} x ${mealQuantity} = `} <b>{(Number(mealSelected.fat) * mealQuantity).toFixed(0)}</b></>
                                                            : <b>{Number(mealSelected.fat).toFixed(0)}</b>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Fiber(gr): </td>
                                                <td>
                                                    {mealSelected.fiber &&
                                                        (mealQuantity !== 1
                                                            ? <>{`${Number(mealSelected.fiber).toFixed(0)} x ${mealQuantity} = `} <b>{(Number(mealSelected.fiber) * mealQuantity).toFixed(0)}</b></>
                                                            : <b>{Number(mealSelected.fiber).toFixed(0)}</b>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><i>Calories(kcal): </i></td>
                                                <td>
                                                    {mealSelected.calories &&
                                                        (mealQuantity !== 1
                                                            ? <>{`${Number(mealSelected.calories).toFixed(0)} x ${mealQuantity} = `} <b>{(Number(mealSelected.calories) * mealQuantity).toFixed(0)}</b></>
                                                            : <b>{Number(mealSelected.calories).toFixed(0)}</b>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr><td>Comments: </td><td>{mealSelected.comments}</td></tr>
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
                                    className="sm-font-sans custom-textarea border-green-1" 
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
        </div>
    );
}

export default PopupForm;
