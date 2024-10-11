'use client';
import React, { useEffect, useState } from 'react';


import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Header from "../../../components/Header";



const AddMeal = () => {

    const [mealType, setMealType] = useState(''); 
    const [mealTitle, setMealTitle] = useState(''); 
    const [suggestionMeals, setSuggestionMeals] = useState([]);
    const [dateTime, setDateTime] = useState('');

    // Function to determine the meal based on the current time
    const getMealBasedOnTime = () => {
      const currentHour = new Date().getHours();
  
      if (currentHour < 10) {
        return 'Breakfast';
      } else if (currentHour < 12) {
        return 'Morning Snack';
      } else if (currentHour < 16) {
        return 'Lunch';
      } else if (currentHour < 18) {
        return 'Afternoon Snack';
      } else if (currentHour < 23) { 
        return 'Dinner';
      } else {
        return 'Other';
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
        const fetchSuggestedMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp/v2/meal?per_page=100&orderby=date&order=desc&_fields=id,title,content`;
        const res = await fetch(fetchSuggestedMealsUrl);
        const data = await res.json();
        setSuggestionMeals(data);
        return data;
    };

    // Set the meal based on the current time when the component mounts
    useEffect(() => {
        setMealType(getMealBasedOnTime());
        setDateTime(getCurrentDateTime());
        getMealSuggestions();
    }, []);
    
    const handleMealSugestionsInputChange = (event, newValue) => {
        setMealTitle(newValue);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        if (meal === '') {
          alert('Please choose a meal option');
        } else {
          alert(`You selected: ${meal}`);
        }
    };




    
    return (
        <main className="site-content">
            <Header title="Add Meal" backUrl="/homepage" />
            <div className="verify-email pb-20" id="feedback-main">
                <div className="container">
                    <div className="feedback-content  mt-16">
                        <form className="feedback-form" onSubmit={handleSubmit}>
                            <div className="addmeal-div feedback-email">
                                <label htmlFor="datetime-local" className="custom-lbl-feedback">Date & Time of meal</label>
                                <input 
                                    type="datetime-local" 
                                    id="datetime-local" 
                                    value={dateTime} 
                                    onChange={(e) => setDateTime(e.target.value)} 
                                />
                            </div>
                            <div className="addmeal-div">
                                <label htmlFor="meal-type" className="custom-lbl-feedback">Type</label>
                                <div className="custom-select-subject mt-8">
                                    <select 
                                        className="arrow-icon sm-font-sans border"
                                        id="meal-type" 
                                        value={mealType} 
                                        onChange={(e) => setMealType(e.target.value)}
                                    >
                                        <option>-</option>
                                        <option value="Breakfast">Breakfast</option>
                                        <option value="Morning Snack">Morning Snack</option>
                                        <option value="Lunch">Lunch</option>
                                        <option value="Afternoon Snack">Afternoon Snack</option>
                                        <option value="Dinner">Dinner</option> 
                                        <option value="Post Workout">Post Workout</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="addmeal-div feedback-email">
                                <label htmlFor="meal-short" className="custom-lbl-feedback">What did I ate? (Title)</label>
                                {/* <input type="text" id="meal-short" placeholder="Write here" className="sm-font-sans border mt-8" autoComplete="off" /> */}
                                <Autocomplete
                                    freeSolo
                                    options={suggestionMeals.map((option) => option.title.rendered)} // Customize as needed
                                    value={mealTitle}
                                    onInputChange={handleMealSugestionsInputChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Search" variant="outlined" />
                                    )}
                                />
                            </div>
                            <div className="addmeal-div">
                                <label htmlFor="meal-long" className="custom-lbl-feedback">What did I ate? (Description)</label>
                                <textarea rows="4" cols="50" placeholder="Write here..." className="sm-font-sans custom-textarea mt-8" id="meal-long"></textarea>
                            </div>
                            <div className="addmeal-div feedback-email">
                                <label htmlFor="calories" className="custom-lbl-feedback">Calories</label>
                                <input type="text" id="calories" placeholder="Write here" className="sm-font-sans border mt-8" autoComplete="off" />
                            </div>
                            <div className="addmeal-div">
                                <label htmlFor="comments" className="custom-lbl-feedback">Comments</label>
                                <textarea rows="4" cols="50" placeholder="Write here..." className="sm-font-sans custom-textarea mt-8" id="comments"></textarea>
                            </div>
                            <div className="green-btn mt-4">
                                <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-full">ADD</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AddMeal;