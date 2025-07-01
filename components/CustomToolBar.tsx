import React from "react";
import { Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Link from "next/link";

 
const CustomToolBar: React.FC<CustomToolBarProps> = ({ label, date, onNavigate, onView, calcAverageWeeklyWeight, calcNumberOfWeeklyWorkouts }) => {


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
        <button onClick={() => onNavigate("PREV")}>← Prev</button>
        <button onClick={() => onNavigate("TODAY")}>Today</button>
        <button onClick={() => onNavigate("NEXT")}>Next →</button>
      </span>
      <span className="rbc-btn-group">
        <button onClick={() => onView(Views.WEEK)}>Week</button>
        <button onClick={() => onView(Views.DAY)}>Day</button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>

      {/* Custom Button */}
      <span className="rbc-btn-group mr-[50px]">
        <span className="weight-info" >{calcAverageWeeklyWeight(startOfWeek)} </span>
        <span className="training-info" >{calcNumberOfWeeklyWorkouts(startOfWeek)}</span>
      </span>
      <span className="rbc-btn-group">
            <Link href="/meals" className="green-link-btn"  >
                + Meal
            </Link>
            <Link href="/weighing" className="green-link-btn"  >
                + Weighing  
            </Link>
            <Link href="/workouts" className="green-link-btn" >
                + workouts 
            </Link>
      </span>

    </div>
  );
}

export default CustomToolBar;