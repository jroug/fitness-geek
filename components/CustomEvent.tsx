import React from 'react';
import { EventProps } from 'react-big-calendar';

 

interface CustomEventProps extends EventProps {
    event: {
        id?:string;
        title?: string;
        meals?: Meals[];
    };
}

const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
    const handleEventDelete = async () => {
        const confirmed = confirm('Are you sure?');
        if (confirmed) {
            if (!event.meals || event.meals.length === 0) return;

            // Extract meal IDs as a comma-separated string
            const mealIds = event.meals.map(meal => meal.id).join(',');

            const deleteMealUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/delete-meal?mids=${mealIds}`;

            try {
                const res = await fetch(deleteMealUrl, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    throw new Error('Failed to delete meals');
                }

                const data = await res.json();
                // console.log('Delete Response:', data);
                location.reload();
            } catch (error) {
                console.error('Error deleting meal:', error);
            }
        }
    };

    return (
        <div key={`${Math.random()}`} className="custom-event">
            {event.id && (
                <div key={`meal-${event.id}-${Math.random()}`} className="absolute right-0 p-[4px] bg-[red] rounded-[35px] leading-[12px]">
                    <button className="block mt-[-2px]" onClick={handleEventDelete}>x</button>
                </div>
            )}
            <h2 className="w-100 text-center">{event.title}</h2>
            {event.meals && event.meals.length > 0 && event.meals.map((meal, idx) => (
                <div key={`meal-${idx}-${Math.random()}`} className={"event-description " + meal.f_category}>
                    {meal.f_title}
                </div>
            ))}
        </div>
    );
};

export default CustomEvent;