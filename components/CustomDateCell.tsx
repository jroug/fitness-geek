import React from 'react';
import { DateCellWrapperProps } from 'react-big-calendar';
import moment from 'moment';

interface UserWorkoutData {
    date_of_workout: moment.MomentInput;
    w_title: string;
    w_type: string;
}

interface CustomDateCellProps extends DateCellWrapperProps {
    weightData: Record<string, string>;
    workoutData: Record<string, UserWorkoutData>;
}

const CustomDateCell: React.FC<CustomDateCellProps> = ({ children, value, weightData, workoutData }) => {

    const dateKey = moment(value).format('YYYY-MM-DD');
    const weightText =  weightData[dateKey] ? weightData[dateKey]  : '';  
    const workoutTypeText =  workoutData[dateKey] ? workoutData[dateKey].w_type  : '';  
    const workoutTitleText =  workoutData[dateKey] ? workoutData[dateKey].w_type  : '';  
 

    return (
        <div className="rbc-day-bg custom-date-cell">
            {weightText && <h3 className="custom-text-cal-header text-center w-100">{weightText}</h3>}
            
            {workoutTypeText && <h3 className="custom-text-cal-header text-center w-100">{workoutTypeText}</h3>}
            {workoutTitleText && <h3 className="custom-text-cal-header text-center w-100 small-font-custom">({workoutTitleText})</h3>}
            {children}
        </div>
    );
};

export default CustomDateCell;
