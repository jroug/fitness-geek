import React from 'react';
import { EventProps } from 'react-big-calendar';

interface CustomEventProps extends EventProps {
    event: {
        title?: string;
        meals?: string[];
    };
}

const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
    return (
        <div className="custom-event">
            <h2 className="w-100 text-center">{event.title}</h2>
            {event.meals && event.meals.length > 0 && event.meals.map((meal, idx) => (
                <div key={`meal-${idx}`} className="event-description">{meal}</div>
            ))}
        </div>
    );
};

export default CustomEvent;
