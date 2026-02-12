'use client';

import React from 'react';
import Image from 'next/image';
import weights_icon from "../../public/svg/weights.svg";
import bin_icon from "../../public/svg/trashbin.svg";

interface WorkoutCellProps {
    workoutTypeText: string;
    workoutTitleText: string;
    onWorkoutClick: (e: React.MouseEvent<HTMLImageElement>) => void;
    onDeleteWorkoutClick: () => Promise<void>;
}

const WorkoutCell: React.FC<WorkoutCellProps> = ({
    workoutTypeText,
    workoutTitleText,
    onWorkoutClick,
    onDeleteWorkoutClick
}) => (
    <h3 className="custom-text-cal-header text-center w-100 bg-purple-300 rounded-[4px] m-[2px] weighting-wrap">
        <div className="w-full block leading-none pt-[3px]"  >
            {workoutTypeText ? workoutTypeText : <Image alt="Edit" width={24} height={24} className="weighting-icon" src={weights_icon} onClick={onWorkoutClick} />}
        </div>
        {
            workoutTitleText ?
                <>
                    <span className="small-font-custom w-full">{workoutTitleText}</span>
                    <Image src={bin_icon} alt="Edit" width={20} height={20} className="trashbin-icon" onClick={() => onDeleteWorkoutClick()} />
                </> :
                <></>
        }
    </h3>
);

export default WorkoutCell;
