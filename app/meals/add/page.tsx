'use client';
import React, { use, useEffect, useState } from 'react';
import Link from "next/link";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Header from "../../../components/Header";
import Popup from "../../../components/Popup";



const AddMeal = () => {

 
    const [dateTimeErrorClass, setDateTimeErrorClass] = useState('');
    const [mealTypeErrorClass, setMealTypeErrorClass] = useState('');
    const [mealTitleErrorClass, setMealTitleErrorClass] = useState('');

    const [dateTime, setDateTime] = useState('');
    const [mealType, setMealType] = useState(''); 
    const [mealSelected, setMealSelected] = useState({
        "id": "",
        "title": {
            "rendered": ""
        },
        "content": {
            "rendered": "",
            "protected": false
        },
        "calories": ""
    }); 
    const [mealComments, setMealComments] = useState(''); 

    const [suggestionMeals, setSuggestionMeals] = useState([]);
    
    const [popupData, setPopupData] = useState({title:'', message:''});

    // Function to determine the meal based on the current time
    const getMealBasedOnTime = () => {
      const currentHour = new Date().getHours();
  
      if (currentHour < 10) {
        return 'B'; // Breakfast
      } else if (currentHour < 12) {
        return 'MS'; // Morning Snack
      } else if (currentHour < 16) {
        return 'L'; // Lunch
      } else if (currentHour < 18) {
        return 'AS'; // Afternoon Snack
      } else if (currentHour < 23) { 
        return 'D'; // Dinner
      } else {
        return 'OTH'; // 
      }

    };

    const getCurrentDateTime = () => {
        // Create a new date for the current time
        const now = new Date();

        // Convert to Athens time using toLocaleString
        const options = {
            timeZone: 'Europe/Athens',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };

        // Format the date and time
        const athensTime = new Intl.DateTimeFormat('en-GB', options).format(now);
        const [datePart, timePart] = athensTime.split(', ');
        
        // Convert from DD/MM/YYYY to YYYY-MM-DD
        const formattedDate = datePart.split('/').reverse().join('-');
        const formattedDateTime = `${formattedDate}T${timePart.replace(':', ':')}`;
        return formattedDateTime;
    }

    const getMealSuggestions = async () => {
        // Example: fetch data from an API or local data
        const fetchSuggestedMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-all-meals`;
        const res = await fetch(fetchSuggestedMealsUrl);
        const data = await res.json();
        setSuggestionMeals(data);
        return data;
    };

    const addMealToDB = async (input_data) => {

        // Example: fetch data from an API or local data
        const addMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-meal`;
        const res = await fetch(addMealsUrl, {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(input_data) // Converts the data object to a JSON string
        });
        const data = await res.json();
        if(data.user_meal_added) {
            setPopupData({
                title: 'Message',
                message: data.message,
                show_popup: true
            });
            setDateTime('');
            setMealType(''); 
            setMealSelected({
                "id": "",
                "title": {
                    "rendered": ""
                },
                "content": {
                    "rendered": "",
                    "protected": false
                },
                "calories": ""
            }); 
            setMealComments(''); 
        }else{
            setPopupData({
                title: 'Message',
                message: 'Something went wrong!',
                show_popup: false
            });
        }



        return;
    };

    // Set the meal based on the current time when the component mounts
    useEffect(() => {
        getMealSuggestions();
    }, []);
    
    const handleSetCurrentDateAndMeal = (e) => {
        e.preventDefault();
        setMealType(getMealBasedOnTime());
        setDateTime(getCurrentDateTime());
    }

    const handleMealSugestionsInputChange = (event, newValue) => {
        console.log(newValue);
        setMealSelected(newValue);
    };

    const handleMealComments = (e) => {
        setMealComments(e.target.value);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // check if nessesary fields are completed
        let doSubmit = true;
 
        if (mealSelected.id === undefined || mealSelected.id === ''){
            doSubmit = false;
            setMealTitleErrorClass("error2");
        }else{
            setMealTypeErrorClass("");
        }

        if (mealType===''){
            doSubmit = false;
            setMealTypeErrorClass("error");
        }else{
            setMealTypeErrorClass("");
        }

        if (dateTime===''){
            doSubmit = false;
            setDateTimeErrorClass("error");
        }else{
            setDateTimeErrorClass("")
        }

        if (doSubmit){
            let input_data = {
                "datetime_of_meal": dateTime,
                "meal_id": mealSelected.id,
                "meal_type": mealType,
                "comments": mealComments
            }
            
            addMealToDB(input_data);
        }else{
            alert('Complete all nesessary fields!');
        }
 
        return false;
    };




    
    return (
        <>
            <main className="site-content">
                <Header title="Add Meal" backUrl="/homepage" />
                <div className="verify-email pb-20" id="feedback-main">
                    <div className="container">
                        <div className="feedback-content  mt-16">
                            <div className="green-btn mt-4">
                                <Link href="#" onClick={handleSetCurrentDateAndMeal} >set Current Date & Meal</Link>
                            </div>
                            <form className="feedback-form" onSubmit={handleFormSubmit}>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="datetime-local" className="custom-lbl-feedback">Date & Time of meal*</label>
                                    <input 
                                        type="datetime-local" 
                                        id="datetime-local" 
                                        value={dateTime} 
                                        onChange={(e) => setDateTime(e.target.value)} 
                                        className={"border-green-1 " + dateTimeErrorClass}
                                    />
                                </div>
                                <div className="addmeal-div">
                                    <label htmlFor="meal-type" className="custom-lbl-feedback">Type*</label>
                                    <div className="custom-select-subject mt-8">
                                        <select 
                                            className={"arrow-icon sm-font-sans border-green-1 " + mealTypeErrorClass}
                                            id="meal-type" 
                                            value={mealType} 
                                            onChange={(e) => setMealType(e.target.value)}
                                        >
                                            <option value="" >-</option>
                                            <option value="B">Breakfast</option>
                                            <option value="MS">Morning Snack</option>
                                            <option value="L">Lunch</option>
                                            <option value="AS">Afternoon Snack</option>
                                            <option value="D">Dinner</option> 
                                            <option value="PW">Post Workout</option>
                                            <option value="OTH">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="meal-short" className="custom-lbl-feedback">What did I ate?*</label>
                                    {/* <input type="text" id="meal-short" placeholder="Write here" className="sm-font-sans border mt-8" autoComplete="off" /> */}
                                    <Autocomplete
                                        className={"Autocomplete-green " + mealTitleErrorClass }
                                        value={mealSelected}
                                        options={suggestionMeals}
                                        getOptionLabel={ (option) => option.title.rendered }
                                        onChange={handleMealSugestionsInputChange}
                                        isOptionEqualToValue = {(options, value) => options.id === value.id }
                                        renderInput={(params) => (
                                            <TextField {...params} label="" variant="outlined" />
                                        )}
                                    />
                                </div>
                                <div className="addmeal-div">
                                    <label htmlFor="meal-long" className="custom-lbl-feedback">Description</label>
                                    <div className="sm-font-sans custom-textarea-div mt-8 border-green-1" id="meal-long" >{mealSelected.content.rendered}</div>
                                </div>
                                <div className="addmeal-div feedback-email">
                                    <label htmlFor="calories" className="custom-lbl-feedback">Calories</label>
                                    <div className="sm-font-sans custom-div mt-8 border-green-1" id="calories" >{mealSelected.calories}</div>
                                </div>
                                <div className="addmeal-div">
                                    <label htmlFor="comments" className="custom-lbl-feedback">Comments</label>
                                    <textarea rows={4} cols={50} placeholder="Write here..." className="sm-font-sans custom-textarea mt-8 border-green-1" id="comments" value={mealComments} onChange={handleMealComments}></textarea>
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