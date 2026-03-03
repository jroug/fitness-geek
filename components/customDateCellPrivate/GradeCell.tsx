'use client';

import React from 'react';
import Image from 'next/image';
import pen_icon from "../../public/images/setting/pencil.svg";
import save_icon from "../../public/svg/saving.svg";
import grade_icon from "../../public/svg/grade.svg";

interface GradeCellProps {
    isEditingGrade: boolean;
    commentObjInit: UserCommentData;
    commentObjDraft: UserCommentData;
    gradeInputRef: React.RefObject<HTMLInputElement>;
    setIsEditingGrade: React.Dispatch<React.SetStateAction<boolean>>;
    setCommentObjectDraft: React.Dispatch<React.SetStateAction<UserCommentData>>;
    getGradeStarClick: () => Promise<number | undefined>;
    onSaveGrade: () => Promise<boolean>;
}

const GradeCell: React.FC<GradeCellProps> = ({
    isEditingGrade,
    commentObjInit,
    commentObjDraft,
    gradeInputRef,
    setIsEditingGrade,
    setCommentObjectDraft,
    getGradeStarClick,
    onSaveGrade
}) => {

    const handleGradeStarClick = async () => {
        const gradeFromAI = await getGradeStarClick();
        console.log(commentObjDraft);
        setCommentObjectDraft(prev => ({
            ...prev,
            grade: gradeFromAI ?? 0
        }));   
    
        setIsEditingGrade(true);
    }

    // console.log('commentObjInit - GRADE CELL');
    // console.log(commentObjInit);
    // console.log('commentObjDraft - GRADE CELL');
    // console.log(commentObjDraft);

    return (
        <div className="custom-text-cal-header text-center bg-yellow-300 p-[2px] m-[2px] rounded-[4px] relative grade-wrap" >
            {!isEditingGrade ? (
                commentObjInit && commentObjInit.grade > 0 ?
                    <>
                        <button
                            type="button"
                            className="w-full cursor-pointer bg-transparent p-0 text-inherit "
                            onClick={() => setIsEditingGrade(true)}
                            aria-label="Edit grade"
                        >
                            {commentObjInit.grade}<span className="text-sm">/10</span>
                        </button>
                        <Image src={pen_icon} alt="Edit" width={16} height={16} className="edit-pencil" onClick={() => setIsEditingGrade(true)} />
                    </>
                    :
                    <>
                        {/* <Image src={grade_icon} alt="Edit" className="grade-icon" width={20} height={20} onClick={() => setIsEditingGrade(true)} /> */}
                        <Image src={grade_icon} alt="Edit" className="grade-icon" width={20} height={20} onClick={handleGradeStarClick} />
                    </>

            ) : (
                <>
                    <div className="custom-edit-input-wrapper">
                        <input
                            className="custom-edit-input"
                            ref={gradeInputRef}
                            type="text"
                            min={0}
                            max={10}
                            value={commentObjDraft?.grade ? commentObjDraft.grade : ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCommentObjectDraft(prev => ({
                                    ...prev,
                                    grade: value === '' ? 0 : Number(value)
                                }));
                            }}
                            onBlur={() => {
                                setCommentObjectDraft(commentObjInit);
                                setIsEditingGrade(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    void onSaveGrade();
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
                    <Image src={save_icon} alt="Edit" width={16} height={16} className="edit-pencil" onClick={() => onSaveGrade()} onMouseDown={e => e.preventDefault()} />
                </>
            )}
        </div>
    );
}

export default GradeCell;
