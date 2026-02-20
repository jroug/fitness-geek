'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DateCellWrapperProps } from 'react-big-calendar';
import moment from 'moment';
import { mutate } from 'swr';
import WeightCell from './customDateCellPrivate/WeightCell';
import WorkoutCell from './customDateCellPrivate/WorkoutCell';
import GradeCell from './customDateCellPrivate/GradeCell';
import CommentCell from './customDateCellPrivate/CommentCell';
import MacrosCell from './customDateCellPrivate/MacrosCell';
import { profileDataSWRKey } from '@/lib/profileDataSWR';

interface MacroTotals {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
}
 
interface CustomDateCellProps extends DateCellWrapperProps {
    // cameFrom?: string;
    isCommentsPublished?: boolean;
    getWeight: (dateKey: string) => string | null;
    getWorkout: (dateKey: string) => UserWorkoutData | null;
    getComment: (dateKey: string) => UserCommentData;
    getMacros: (dateKey: string) => MacroTotals | null;
    setUserWeightList: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    setUserCommentsList: React.Dispatch<React.SetStateAction<{ [key: string]: UserCommentData }>>;
    setUserWorkoutList: React.Dispatch<React.SetStateAction<Record<string, UserWorkoutData>>>;
    onAddWorkout?: (date: Date) => void;
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
        getMacros,
        setUserWeightList,
        setUserCommentsList,
        setUserWorkoutList,
        onAddWorkout, 
        jr_token 
    }) => {


    const slotDate = value;
    const dateKey = moment(slotDate).format('YYYY-MM-DD');
    

    const weightValue = getWeight(dateKey);
    const workoutValue = getWorkout(dateKey);
    const commentObjInit = getComment(dateKey);
    const macrosValue = getMacros(dateKey);

    const weightText =  weightValue ? weightValue  : '';  
    const workoutTypeText =  workoutValue ? workoutValue.w_type  : '';  
    const workoutTitleText =  workoutValue ? workoutValue.w_title  : '';  

    // console.log('commentObjInit', commentObjInit);
    const weightInputRef = useRef<HTMLInputElement>(null);
    const gradeInputRef = useRef<HTMLInputElement>(null);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [isEditingGrade, setIsEditingGrade] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(false);

    const [weightDraft, setWeightDraft] = useState(weightText);
    const [commentObjDraft, setCommentObjectDraft] = useState<UserCommentData>( commentObjInit !== undefined ? commentObjInit : {
        id: 0,
        user_id: 0,
        date_of_comment: dateKey, 
        comment: '',
        grade: 0
    });
 
     useEffect(() => {

        // console.log('useEffect->'+dateKey);


        if (isEditingWeight && weightInputRef.current) {
            weightInputRef.current.focus();
        }
        else if (isEditingGrade && gradeInputRef.current) {
            gradeInputRef.current.focus();
        }
        else if (isEditingComment && commentInputRef.current) {
            commentInputRef.current.focus();
        }
 

    }, [isEditingWeight, isEditingGrade, isEditingComment, gradeInputRef, weightInputRef, commentInputRef]);

 
    const handleSaveDailyWeight = async () => {
        // delete action
        if (weightDraft === '-') {

            
            
            try {
                const deleteWeightUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/delete-daily-weighing`;
                const res = await fetch(deleteWeightUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'delete_weight_daily',
                        datetime_of_weighing:dateKey,
                        jr_token,
                    }),
                });

                if (!res.ok) {
                    throw new Error('Failed to save weight');
                }
                // Optimistically update parent list if provided on success
                setUserWeightList?.((prev) => ({
                    ...prev,
                    [dateKey]: '',
                }));
                await mutate(profileDataSWRKey);
            } catch (error) {
                console.error('Error saving weight:', error);
            }  finally {
                setIsEditingWeight(false);
            }
            return;
        }



        const raw = weightDraft.trim().replace(',', '.');
        if (!raw) {
            // Treat empty as cancel (no change)
            setIsEditingWeight(false);
            return;
        }

        const weightNumber = Number(raw);
        if (!Number.isFinite(weightNumber) || weightNumber <= 0 || weightNumber > 500) {
            alert('Please enter a valid weight (e.g. 82.4)');
            return;
        }

        

        // Persist (adjust endpoint/action names if your API differs)
        try {
            const saveWeightUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/save-daily-weighing`;
            const res = await fetch(saveWeightUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save_weight_daily',
                    weight: weightNumber,
                    datetime_of_weighing:dateKey,
                    jr_token,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to save weight');
            }

            // Optimistically update parent list if provided - on success
            setUserWeightList?.((prev) => ({
                ...prev,
                [dateKey]: weightNumber.toString(),
            }));
            await mutate(profileDataSWRKey);

        } catch (error) {
            console.error('Error saving weight:', error);
        }  finally {
            setIsEditingWeight(false);
        }
    };




    const handleSaveDailyCommentOrGrade = async (what: string) => {



        const saveDailyCommentORGradeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/save-daily-comment-or-grade`;
        try {
            const res = await fetch(saveDailyCommentORGradeUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save_daily_comment_or_grade',
                    what,
                    jr_token,
                    ...commentObjDraft
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to add comment');
            }

            const data = await res.json();
            if (data.action_suc===true){
            
                // populate the list on father to keep data corect when rerendering
                setUserCommentsList((prev) => ({
                    ...prev,
                    [dateKey]: {
                        ...prev[dateKey],
                        comment: commentObjDraft.comment,
                        grade: commentObjDraft.grade
                    }
                }));
                if (what === 'grade') {
                    await mutate(profileDataSWRKey);
                }

            }else{
                // console.log('Message: ' + data.message);
            } 
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            if (what === 'grade') {
                setIsEditingGrade(false);
            } else if (what === 'comment') {
                setIsEditingComment(false);
            }
        }

     

        return false;
    }


      const handleWorkoutClick = (e: React.MouseEvent<HTMLImageElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onAddWorkout?.(slotDate);
      };

      const handleDeleteWorkoutClick = async () => {
            try {
                const deleteWorkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/delete-daily-workout`;
                const res = await fetch(deleteWorkoutUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'delete_workout_daily',
                        date_of_workout: dateKey,
                    }),
                });

                if (!res.ok) {
                    throw new Error('Failed to save weight');
                }
                // Optimistically update parent list if provided on success
                    setUserWorkoutList((prev) => {
                        const next = { ...prev };
                        delete next[dateKey];
                        return next;
                    });
                    await mutate(profileDataSWRKey);
            } catch (error) {
                console.error('Error saving weight:', error);
            }   
            return;
      }




    return (
        <div className="rbc-day-bg custom-date-cell" key={"dk-d" + dateKey} >
            {/*********************************************** WEIGHT ***********************************************/}
            <WeightCell
                isEditingWeight={isEditingWeight}
                weightText={weightText}
                weightDraft={weightDraft}
                weightInputRef={weightInputRef}
                setWeightDraft={setWeightDraft}
                setIsEditingWeight={setIsEditingWeight}
                onSaveWeight={handleSaveDailyWeight}
            />
            {/*********************************************** WEIGHT ***********************************************/}






            {/*********************************************** WORKOUT ***********************************************/}
            <WorkoutCell
                workoutTypeText={workoutTypeText}
                workoutTitleText={workoutTitleText}
                onWorkoutClick={handleWorkoutClick}
                onDeleteWorkoutClick={handleDeleteWorkoutClick}
            />
            {/*********************************************** WORKOUT ***********************************************/}

            {/*********************************************** MACROS ***********************************************/}
            <MacrosCell macros={macrosValue} />
            {/*********************************************** MACROS ***********************************************/}






            { isCommentsPublished && (
                <>
                    {/*********************************************** GRADE GRADE GRADE***********************************************/}
                    <GradeCell
                        isEditingGrade={isEditingGrade}
                        commentObjInit={commentObjInit}
                        commentObjDraft={commentObjDraft}
                        gradeInputRef={gradeInputRef}
                        setIsEditingGrade={setIsEditingGrade}
                        setCommentObjectDraft={setCommentObjectDraft}
                        onSaveGrade={() => handleSaveDailyCommentOrGrade('grade')}
                    />
                    {/*********************************************** GRADE GRADE GRADE***********************************************/}

                    
                    
                    
                    
                    {/*********************************************** COOOOOOMMMMMMMENT ***********************************************/}
                    <CommentCell
                        isEditingComment={isEditingComment}
                        commentObjInit={commentObjInit}
                        commentObjDraft={commentObjDraft}
                        commentInputRef={commentInputRef}
                        setIsEditingComment={setIsEditingComment}
                        setCommentObjectDraft={setCommentObjectDraft}
                        onSaveComment={() => handleSaveDailyCommentOrGrade('comment')}
                    />
                    {/*********************************************** COOOOOOMMMMMMMENT ***********************************************/}
                </>
            )}
            
            {children}

        </div>
    );

};

export default CustomDateCell;
