'use client';

import React from 'react';

interface MacroTotals {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
}

interface MacrosCellProps {
    macros: MacroTotals | null;
}

const MacrosCell: React.FC<MacrosCellProps> = ({ macros }) => {
    const hasMacros = Boolean(macros && (macros.calories > 0 || macros.protein > 0 || macros.carbohydrates > 0 || macros.fat > 0 || macros.fiber > 0));

    return (
        <div className="custom-text-cal-header text-center bg-green-300 p-[2px] m-[2px] rounded-[4px] relative macro-wrap">
            {hasMacros ? (
                <div className="leading-tight">
                    <div className="macro-custom">
                        P: <b>{Math.round(macros!.protein)}gr</b>, 
                        C:<b>{Math.round(macros!.carbohydrates)}gr</b>, 
                        F:<b>{Math.round(macros!.fat)}gr</b>,
                        Fi:<b>{Math.round(macros!.fiber)}gr</b>,
                        - <b>{Math.round(macros!.calories)}Kcal</b>
                    </div>
                </div>
            ) : (
                <div className="macro">No macros</div>
            )}
        </div>
    );
};

export default MacrosCell;
