'use client';

import React from 'react';
import Image from 'next/image';
import pen_icon from "../../public/images/setting/pencil.svg";
import save_icon from "../../public/svg/saving.svg";
import weight_icon from "../../public/svg/weight-black.svg";

interface WeightCellProps {
    isEditingWeight: boolean;
    weightText: string;
    weightDraft: string;
    weightInputRef: React.RefObject<HTMLInputElement>;
    setWeightDraft: React.Dispatch<React.SetStateAction<string>>;
    setIsEditingWeight: React.Dispatch<React.SetStateAction<boolean>>;
    onSaveWeight: () => Promise<void>;
}

const WeightCell: React.FC<WeightCellProps> = ({
    isEditingWeight,
    weightText,
    weightDraft,
    weightInputRef,
    setWeightDraft,
    setIsEditingWeight,
    onSaveWeight
}) => (
    <div className="custom-text-cal-header text-center w-100 bg-cyan-400 rounded-[4px] m-[2px] relative weighing-wrap">
        {!isEditingWeight ? (
            weightText ?
                <>
                    <button
                        type="button"
                        className="w-full cursor-pointer bg-transparent p-0 text-inherit "
                        onClick={() => setIsEditingWeight(true)}
                        aria-label="Edit weight"
                    >
                        {weightText}
                        <span className="text-sm"> kg</span>
                    </button>
                    <Image src={pen_icon} alt="Edit" width={16} height={16} className="edit-pencil" onClick={() => setIsEditingWeight(true)} />
                </>
                :
                <Image src={weight_icon} className="weighing-icon" alt="Edit" width={20} height={20} onClick={() => setIsEditingWeight(true)} />
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
                                void onSaveWeight();
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
                <Image src={save_icon} alt="Edit" width={16} height={16} className="edit-pencil" onClick={() => onSaveWeight()} onMouseDown={e => e.preventDefault()} />
            </>
        )}
    </div>
);

export default WeightCell;
