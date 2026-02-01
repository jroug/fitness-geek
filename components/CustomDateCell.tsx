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
    // cameFrom?: string;
    isCommentsPublished?: boolean;
    getWeight: (dateKey: string) => string | null;
    getWorkout: (dateKey: string) => UserWorkoutData | null;
    getComment: (dateKey: string) => UserCommentData;
    setUserCommentsList: React.Dispatch<React.SetStateAction<{ [key: string]: UserCommentData }>>;
    jr_token:string;
}

const CustomDateCell: React.FC<CustomDateCellProps> = ({ 
        children, 
        value, 
        // cameFrom, 
        isCommentsPublished, 
        getWeight, 
        getWorkout, 
        getComment, 
        setUserCommentsList, 
        jr_token 
    }) => {

    const dateKey = moment(value).format('YYYY-MM-DD');
    
    const weightValue = getWeight(dateKey);
    const workoutValue = getWorkout(dateKey);
    const commentObjInit = getComment(dateKey);

    const weightText =  weightValue ? weightValue  : '';  
    const workoutTypeText =  workoutValue ? workoutValue.w_type  : '';  
    const workoutTitleText =  workoutValue ? workoutValue.w_title  : '';  

    // console.log('commentObjInit', commentObjInit);

    // only comment is able to change from here
    const [commentObj, setCommentObject] = useState<UserCommentData>( commentObjInit !== undefined ? commentObjInit : {
        id: 0,
        user_id: 0,
        date_of_comment: '', 
        comment: '',
        grade: 0
    });

    useEffect(()=>{
        setCommentObject(commentObjInit);
    },[commentObjInit])

    const handleAddDailyGrade = async (commentObject: UserCommentData, dateKey: string) => {
            
        const grade_new_str = prompt("Add a grade (1-10):", commentObject?.grade > 0 ? commentObject?.grade.toString() : '');
        const grade_new = grade_new_str ? parseInt(grade_new_str) : 0;
        if (grade_new_str!==null){ // null is when canceled
            if (grade_new >=1 && grade_new <=10) {
                const editMealCommentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/save-daily-grade`;
                try {
                    const res = await fetch(editMealCommentUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'update_grade_daily',
                            grade_new: grade_new,
                            user_id : commentObject?.user_id,
                            dateKey: dateKey,
                            comment_id: commentObject?.id,
                            jr_token: jr_token
                        }),
                    });
                    
                    if (!res.ok) {
                        throw new Error('Failed to add grade');
                    }
                    const data = await res.json();
                    if (data.action_suc===true){
                        // setCommentObject({
                        //     id: data.id,
                        //     user_id : commentObject.user_id,
                        //     date_of_comment: commentObject.date_of_comment, 
                        //     grade: grade_new,
                        //     comment: commentObject.comment
                        // });
                        
                        // populate the list on father to keep data corect when rerendering
                        setUserCommentsList((prev) => ({
                            ...prev,
                            [dateKey]: {
                                ...prev[dateKey],
                                grade: grade_new
                            }
                        }));
                    }
                } catch (error) {
                    console.error('Error adding grade:', error);
                }
            }
        }
        
        return false;
}

    const handleAddDailyComment = async (commentObject: UserCommentData, dateKey: string) => {
   
        const comment_new = prompt("Add a comment (200 characters max):", commentObject?.comment);
 
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
                            user_id : commentObject?.user_id,
                            dateKey: dateKey,
                            comment_id: commentObject?.id,
                            jr_token: jr_token
                        }),
                    });

                    if (!res.ok) {
                        throw new Error('Failed to add comment');
                    }

                    const data = await res.json();
                    if (data.action_suc===true){
                        // setCommentObject({
                        //     id: data.id,
                        //     user_id : commentObject.user_id,
                        //     date_of_comment: commentObject.date_of_comment, 
                        //     comment: comment_new
                        // });

                        // populate the list on father to keep data corect when rerendering
                        setUserCommentsList((prev) => ({
                            ...prev,
                            [dateKey]: {
                                ...prev[dateKey],
                                comment: comment_new
                            }
                        }));
                    }else{
                        // console.log('Message: ' + data.message);
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
            { isCommentsPublished && (
                <>
                    <div className="custom-text-cal-header text-center bg-yellow-300 p-[2px] m-[2px] rounded-[4px] custom-grade" >
                        <button className="comment-link-button" onClick={() => handleAddDailyGrade(commentObj, dateKey)} >+ Grade</button>
                        <p className="font-bold leading-[20px] ">{ commentObj?.grade>0 ? commentObj?.grade + '/10' : `-`}</p>
                    </div> 
                    <div className="custom-text-cal-header text-center bg-orange-300 p-[2px] m-[2px] rounded-[4px] custom-comment" >
                        <button className="comment-link-button" onClick={() => handleAddDailyComment(commentObj, dateKey)} >+ Comment</button>
                        <p>{ commentObj?.comment }</p>
                    </div> 
                </>
            )}
            
            {children}

        </div>
    );

};

export default CustomDateCell;
