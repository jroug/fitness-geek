'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DateCellWrapperProps } from 'react-big-calendar';
import pen_icon from "../public/images/setting/pencil.svg";  
import save_icon from "../public/svg/saving2.svg";  
import Image from 'next/image';
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
    setUserWeightList: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    setUserCommentsList: React.Dispatch<React.SetStateAction<{ [key: string]: UserCommentData }>>;
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
        setUserWeightList,
        setUserCommentsList,
        onAddWorkout, 
        jr_token 
    }) => {


    const slotDate = value;
    const dateKey = moment(slotDate).format('YYYY-MM-DD');
    

    const weightValue = getWeight(dateKey);
    const workoutValue = getWorkout(dateKey);
    const commentObjInit = getComment(dateKey);

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
                const saveWeightUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/delete-daily-weighing`;
                const res = await fetch(saveWeightUrl, {
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


      const handleWorkoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onAddWorkout?.(slotDate);
      };



    return (
        <div className="rbc-day-bg custom-date-cell" key={"dk-d" + dateKey} >
            {/*********************************************** WEIGHT ***********************************************/}
            <div className="custom-text-cal-header text-center w-100 bg-cyan-400 rounded-[4px] m-[2px] relative">
                {!isEditingWeight ? (
                    <> 
                        <button
                            type="button"
                            className="w-full cursor-pointer bg-transparent p-0 text-inherit "
                            onClick={() => setIsEditingWeight(true)}
                            aria-label="Edit weight"
                        >
                            {weightText ? (<>{weightText}<span className="text-sm"> kg</span></>) : <span className="opacity-placeholder">Weighing</span>}
                        </button>
                        <Image src={pen_icon} alt="Edit" width={16} height={16} className="edit-pencil" onClick={() => setIsEditingWeight(true)} />
                    </>
                ) : (
                    <>
                        <div className="custom-edit-input-wrapper">
                            <input
                                className="custom-edit-input"
                                ref={weightInputRef}
                                type="text"
                                inputMode="decimal"
                                value={weightDraft}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // allow only digits, dot and comma
                                    if (/^[0-9.,-]*$/.test(value)) {
                                        setWeightDraft(value);
                                    }
                                }}
                                onBlur={() => {
                                    setWeightDraft(weightText);
                                    setIsEditingWeight(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        void handleSaveDailyWeight();
                                    }
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        setWeightDraft(weightText);
                                        setIsEditingWeight(false);
                                    }
                                }}
                            />
                            <span className="text-sm">kg</span>
                        </div>
                        <Image src={save_icon} alt="Edit" width={16} height={16} className="edit-pencil" onClick={() => handleSaveDailyWeight()} onMouseDown={e => e.preventDefault()} />
                    </>
                )}
                
            </div>
            {/*********************************************** WEIGHT ***********************************************/}






            {/*********************************************** WORKOUT ***********************************************/}
            <h3 className="custom-text-cal-header text-center w-100 bg-purple-300 rounded-[4px] m-[2px]">
                <button className="w-full block leading-none pt-[3px]" onClick={handleWorkoutClick} >{workoutTypeText ? workoutTypeText : `+Workout`}  </button>
                <span className="small-font-custom w-full">&nbsp;{workoutTitleText ? `(${workoutTitleText})` : ``}&nbsp;</span>
            </h3> 
            {/*********************************************** WORKOUT ***********************************************/}






            { isCommentsPublished && (
                <>
                    {/*********************************************** GRADE GRADE GRADE***********************************************/}
                    <div className="custom-text-cal-header text-center bg-yellow-300 p-[2px] m-[2px] rounded-[4px] relative" >
                        {!isEditingGrade ? (
                            <>
                                <button
                                    type="button"
                                    className="w-full cursor-pointer bg-transparent p-0 text-inherit "
                                    onClick={() => setIsEditingGrade(true)}
                                    aria-label="Edit grade"
                                >
                                    {commentObjInit && commentObjInit.grade > 0 ? (<>{commentObjInit.grade}<span className="text-sm">/10</span></>) : <span className="opacity-placeholder">Grade</span>}
                                </button>
                                <Image src={pen_icon} alt="Edit" width={16} height={16} className="edit-pencil" onClick={() => setIsEditingGrade(true)} />
                            </>
                        ) : (
                            <>
                                <div className="custom-edit-input-wrapper">
                                    <input
                                        className="custom-edit-input"
                                        ref={gradeInputRef}
                                        type="number"
                                        min={0}
                                        max={10}
                                        value={commentObjDraft.grade ? commentObjDraft.grade : ''} // show empty when grade is 0 for better UX
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setCommentObjectDraft(prev => ({
                                                ...prev,
                                                grade: value === '' ? 0 : Number(value) // allow empty string but store as 0
                                            }));
                                        }}
                                        onBlur={() => {
                                            setCommentObjectDraft(commentObjInit);
                                            setIsEditingGrade(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                void handleSaveDailyCommentOrGrade('grade');
                                            }
                                            if (e.key === 'Escape') {
                                                e.preventDefault();
                                                setCommentObjectDraft(commentObjInit);
                                                setIsEditingGrade(false);
                                            }
                                        }}
                                    />
                                    <span className="text-sm">/10</span>
                                </div>
                                <Image src={save_icon} alt="Edit" width={16} height={16} className="edit-pencil" onClick={() => handleSaveDailyCommentOrGrade('grade')} onMouseDown={e => e.preventDefault()}/>
                            </>
                        )}
                        
                    </div> 
                    {/*********************************************** GRADE GRADE GRADE***********************************************/}

                    
                    
                    
                    
                    {/*********************************************** COOOOOOMMMMMMMENT ***********************************************/}
                    <div className="custom-text-cal-header text-center bg-orange-300 p-[2px] m-[2px] rounded-[4px] relative custom-comment" >
                        {!isEditingComment ? (
                            <>
                                <button
                                    type="button"
                                    className="w-full cursor-pointer bg-transparent p-0 text-inherit "
                                    onClick={() => setIsEditingComment(true)}
                                    aria-label="Edit comment"
                                >
                                    {commentObjInit?.comment ? (<>{commentObjInit.comment}</>) : <span className="opacity-placeholder">Comment</span>}
                                </button>
                                <Image src={pen_icon} alt="Edit" width={16} height={16} className="edit-pencil-bottom" onClick={() => setIsEditingComment(true)} />
                            </>
                        ) : (
                            <>
                                <div className="custom-edit-input-wrapper comment-input-wrapper">
                                    <div>
                                        <textarea
                                            className="custom-edit-input"
                                            ref={commentInputRef}
                                            value={commentObjDraft.comment}
                                            onChange={(e) => {
                                                setCommentObjectDraft(prev => ({
                                                    ...prev,
                                                    comment: e.target.value
                                                }));
                                            }}
                                            maxLength={150}
                                            onBlur={() => {
                                                setCommentObjectDraft(commentObjInit);
                                                setIsEditingComment(false);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    void handleSaveDailyCommentOrGrade('comment');
                                                }
                                                if (e.key === 'Escape') {
                                                    e.preventDefault();
                                                    setCommentObjectDraft(commentObjInit);
                                                    setIsEditingComment(false);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <Image src={save_icon} alt="Edit" width={16} height={16} className="edit-pencil-bottom" onClick={() => handleSaveDailyCommentOrGrade('comment') } onMouseDown={e => e.preventDefault()} />
                            </>
                        )}
                        
                    </div> 
                    {/*********************************************** COOOOOOMMMMMMMENT ***********************************************/}
                </>
            )}
            
            {children}

        </div>
    );

};

export default CustomDateCell;
