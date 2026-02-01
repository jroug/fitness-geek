import React from "react";
import { Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";




const CustomToolBarPublic: React.FC<CustomPublicToolBarProps> = ({ label, onNavigate, onView }) => {


  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button onClick={() => onNavigate("PREV")}>← Prev</button>
        <button onClick={() => onNavigate("TODAY")}>Today</button>
        <button onClick={() => onNavigate("NEXT")}>Next →</button>
      </span>
 
      <span className="rbc-toolbar-label">{label}</span>

      {/* Custom Button */}
      <span className="rbc-btn-group">
            <button onClick={() => onView(Views.WEEK)}>Week</button>
            <button onClick={() => onView(Views.DAY)}>Day</button>
      </span>

    </div>
  );
}

export default CustomToolBarPublic;