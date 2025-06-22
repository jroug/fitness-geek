'use client';

import React, {useState, useEffect} from 'react';
import { DateCellWrapperProps } from 'react-big-calendar';
import moment from 'moment';

interface UserWorkoutData {
    date_of_workout: moment.MomentInput;
    w_title: string;
    w_type: string;
}

interface CustomDateCellProps extends DateCellWrapperProps {
    getWeight: (dateKey: string) => string | null;
    getWorkout: (dateKey: string) => UserWorkoutData | null;
    getComment: (dateKey: string) => string | null;
}

const CustomDateCell: React.FC<CustomDateCellProps> = ({ children, value, getWeight, getWorkout, getComment }) => {

    const dateKey = moment(value).format('YYYY-MM-DD');
    
    const weightValue = getWeight(dateKey);
    const workoutValue = getWorkout(dateKey);
  
    const weightText =  weightValue ? weightValue  : '';  
    const workoutTypeText =  workoutValue ? workoutValue.w_type  : '';  
    const workoutTitleText =  workoutValue ? workoutValue.w_title  : '';  

    // only comment is able to change from here
    const commentValue = getComment(dateKey);
    const [commentText, setCommentText] = useState<string>(commentValue ? commentValue : '');


    const handleAddDailyComment = async (comment: string, dateKey: string) => {
   
        const comment_new = prompt("Add a comment (200 characters max):", comment);
 
        if (comment_new!==null){ // null is when canceled
            if ((comment_new && comment_new.length < 200) || (  comment_new.length === 0 )) {
                const editMealCommentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/save-daily-comment`;
                try {
                    const res = await fetch(editMealCommentUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'update_comment_daily',
                            comment_new: comment_new,
                            dateKey: dateKey
                        }),
                    });

                    if (!res.ok) {
                        throw new Error('Failed to add comment');
                    }

                    const data = await res.json();
                    setCommentText(comment_new);
                    if (data.action_suc===false){
                        console.log('Message: ' + data.message);
                    } 

                } catch (error) {
                    console.error('Error adding comment:', error);
                }
            }else{
                alert('Comment too long');
            }
        }

        return false;
    };

    return (
        <div className="rbc-day-bg custom-date-cell">
            <h3 className="custom-text-cal-header text-center w-100 bg-cyan-400 rounded-[4px] m-[2px]">{weightText ? weightText : `-`}</h3>
            <h3 className="custom-text-cal-header text-center w-100 bg-purple-300 rounded-[4px] m-[2px]">
                <span className="w-full block leading-none pt-[3px]" >{workoutTypeText ? workoutTypeText : `-`}  </span>
                <span className="small-font-custom w-full">&nbsp;{workoutTitleText ? `(${workoutTitleText})` : ``}&nbsp;</span>
            </h3> 
             <div className="custom-text-cal-header text-center bg-orange-300 p-[2px] m-[2px] rounded-[4px] custom-comment" >
                <button className="comment-link-button" onClick={() => handleAddDailyComment(commentText, dateKey)} >+ Comment</button>
                <p>{ commentText }</p>
            </div> 
            
            {children}
        </div>
    );

};

export default CustomDateCell;
