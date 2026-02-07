import React from "react";
import { type NavigateAction } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Link from "next/link";

 
const CustomToolBar: React.FC<CustomToolBarProps> = ({ label, date, onNavigate, calcWeeklyGrades, calcAverageWeeklyWeight, calcNumberOfWeeklyWorkouts }) => {
  const nav = (action: NavigateAction) => onNavigate(action);


  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date(date));
  // console.log("Start of the week:", startOfWeek.toISOString().split("T")[0]);

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => nav("PREV")}>← Prev</button>
        <button type="button" onClick={() => nav("TODAY")}>Today</button>
        <button type="button" onClick={() => nav("NEXT")}>Next →</button>
      </span>
      {/* <span className="rbc-btn-group">
        <button type="button" className="show_on_desktop_only" onClick={() => onView(Views.WEEK)}>Week</button>
        <button type="button" className="show_on_mobile_only" onClick={() => onView(Views.DAY)}>Day</button>
      </span> */}
      <span className="rbc-toolbar-label font-bold">{label}</span>

      {/* Custom Button */}
      <span className="rbc-btn-group mr-[50px] show_on_desktop_only">
        <span className="grades-info" >{calcWeeklyGrades(startOfWeek).total} </span>
        <span className="grades-info" >{calcWeeklyGrades(startOfWeek).avg} </span>
        <span className="weight-info" >{calcAverageWeeklyWeight(startOfWeek)} </span>
        <span className="training-info" >{calcNumberOfWeeklyWorkouts(startOfWeek)}</span>
      </span>
      <span className="rbc-btn-group show_on_desktop_only">
            <Link href="/add-meal" className="green-link-btn"  >
                + Meal
            </Link>
            <Link href="/add-weighing" className="green-link-btn"  >
                + Weighing  
            </Link>
            <Link href="/add-workout" className="green-link-btn" >
                + workouts 
            </Link>
      </span>

    </div>
  );
}

export default CustomToolBar;