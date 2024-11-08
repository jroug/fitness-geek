import React, { ReactNode } from 'react';

const customTimeslots = [
    "Breakfast",
    "Mor. Snack",
    "Lunch",
    "Aft. Snack",
    "Post Work.",
    "Dinner"
];

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

interface CustomTimeGutterProps {
    children?: ReactNode; // Make children optional
}

const CustomTimeGutter: React.FC<CustomTimeGutterProps> = ({ children }) => {
    const childrenArray = React.Children.toArray(children) as React.ReactElement[];

    return (
        <div className="rbc-time-gutter">
            {childrenArray[0]?.props.children.map((slot: React.ReactElement, index: number) => {
                const timeSlotDate = slot.props.group[0];

                return (
                    <div key={index} className="rbc-time-slot custom-time-slot">
                        <strong>{customTimeslots[index] || ''}</strong>
                        <span>{formatTime(new Date(timeSlotDate))}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default CustomTimeGutter;