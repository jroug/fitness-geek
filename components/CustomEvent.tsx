import React from 'react';
import { EventProps } from 'react-big-calendar';


interface Meals{
    f_title: string;
    f_category: string;
}
interface CustomEventProps extends EventProps {
    event: {
        title?: string;
        meals?: Meals[];
    };
}

const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
    return (
        <div className="custom-event">
            <h2 className="w-100 text-center">{event.title}</h2>
            {event.meals && event.meals.length > 0 && event.meals.map((meal, idx) => (
                <div key={`meal-${idx}`} className={"event-description " + meal.f_category}>{meal.f_title}</div>
            ))}
        </div>
    );
};

export default CustomEvent;
