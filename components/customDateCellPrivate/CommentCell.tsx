'use client';

import React from 'react';
import Image from 'next/image';
import pen_icon from "../../public/images/setting/pencil.svg";
import save_icon from "../../public/svg/saving.svg";
import comment_icon from "../../public/svg/comment.svg";

interface CommentCellProps {
    isEditingComment: boolean;
    commentObjInit: UserCommentData;
    commentObjDraft: UserCommentData;
    commentInputRef: React.RefObject<HTMLTextAreaElement>;
    setIsEditingComment: React.Dispatch<React.SetStateAction<boolean>>;
    setCommentObjectDraft: React.Dispatch<React.SetStateAction<UserCommentData>>;
    onSaveComment: () => Promise<boolean>;
}

const CommentCell: React.FC<CommentCellProps> = ({
    isEditingComment,
    commentObjInit,
    commentObjDraft,
    commentInputRef,
    setIsEditingComment,
    setCommentObjectDraft,
    onSaveComment
}) => (
    <div className="custom-text-cal-header text-center bg-orange-300 p-[2px] m-[2px] rounded-[4px] relative custom-comment" >
        {!isEditingComment ? (
            commentObjInit?.comment ?
                <>
                    <button
                        type="button"
                        className="w-full cursor-pointer bg-transparent p-0 text-inherit "
                        onClick={() => setIsEditingComment(true)}
                        aria-label="Edit comment"
                    >
                        {commentObjInit.comment}
                    </button>
                    <Image src={pen_icon} alt="Edit" width={16} height={16} className="edit-pencil-bottom" onClick={() => setIsEditingComment(true)} />
                </>
                :
                <Image src={comment_icon} className="comment-icon" alt="Edit" width={20} height={20} onClick={() => setIsEditingComment(true)} />
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
                                    void onSaveComment();
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
                <Image src={save_icon} alt="Edit" width={16} height={16} className="edit-pencil-bottom" onClick={() => onSaveComment()} onMouseDown={e => e.preventDefault()} />
            </>
        )}
    </div>
);

export default CommentCell;
