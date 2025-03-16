import React from "react";
import { NavigateAction, Views, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Link from "next/link";

interface CustomToolBarProps {
    label: string;
    onNavigate: (action: NavigateAction) => void;
    onView: (view: View) => void;
  }

const CustomToolBar: React.FC<CustomToolBarProps> = ({ label, onNavigate, onView }) => {

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