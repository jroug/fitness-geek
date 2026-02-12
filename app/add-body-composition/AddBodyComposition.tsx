'use client';
import React, { useState } from 'react';

import Toast from "@/components/Toast";
import { globalSettings } from '@/lib/globalSettings';

interface BodyCompositionInputData {
    measurement_date: string;
    weight_kg?: string;
    bmi?: string;
    body_fat_percent?: string;
    body_fat_kg?: string;
    lean_body_mass_kg?: string;
    muscle_mass_kg?: string;
    total_body_water_percent?: string;
    waist_circumference_cm?: string;
    visceral_fat?: string;
    notes?: string;
}

const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AddBodyComposition: React.FC = () => {
    const [dateErrorClass, setDateErrorClass] = useState('');

    const [measurementDate, setMeasurementDate] = useState(getCurrentDate);
    const [weightKg, setWeightKg] = useState('');
    const [bmi, setBmi] = useState('');
    const [bodyFatPercent, setBodyFatPercent] = useState('');
    const [bodyFatKg, setBodyFatKg] = useState('');
    const [leanBodyMassKg, setLeanBodyMassKg] = useState('');
    const [muscleMassKg, setMuscleMassKg] = useState('');
    const [totalBodyWaterPercent, setTotalBodyWaterPercent] = useState('');
    const [waistCm, setWaistCm] = useState('');
    const [visceralFat, setVisceralFat] = useState('');
    const [notes, setNotes] = useState('');

    const [popupData, setPopupData] = useState({ title: '', message: '', time:0, show_popup: false });

    const [isSaving, setIsSaving] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('SAVE');

    const addBodyCompositionToDB = async (input_data: BodyCompositionInputData) => {
        if (isSaving) return false;
        setIsSaving(true);
        setSaveBtnText('Saving...');

        const addBodyCompositionUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-body-composition`;
        const res = await fetch(addBodyCompositionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input_data)
        });

        const data = await res.json();
        if (data.bodycomposition_added) {
            setPopupData({ title: 'Message', message: data.message || 'Saved', time:globalSettings.frmTimeSuccess, show_popup: true });
            setMeasurementDate(getCurrentDate());
            setWeightKg('');
            setBmi('');
            setBodyFatPercent('');
            setBodyFatKg('');
            setLeanBodyMassKg('');
            setMuscleMassKg('');
            setTotalBodyWaterPercent('');
            setWaistCm('');
            setVisceralFat('');
            setNotes('');

            setSaveBtnText('Save');
            setIsSaving(false);
            return true;
        } else {
            setPopupData({ title: 'Error!', message: data.message || 'Something went wrong!', time:globalSettings.frmTimeError, show_popup: true });
            setSaveBtnText('Save');
            setIsSaving(false);
            return false;
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let doSubmit = true;

        if (!measurementDate) {
            doSubmit = false;
            setDateErrorClass("error");
        } else {
            setDateErrorClass("");
        }

        if (doSubmit) {
            const input_data: BodyCompositionInputData = {
                measurement_date: measurementDate,
                weight_kg: weightKg,
                bmi,
                body_fat_percent: bodyFatPercent,
                body_fat_kg: bodyFatKg,
                lean_body_mass_kg: leanBodyMassKg,
                muscle_mass_kg: muscleMassKg,
                total_body_water_percent: totalBodyWaterPercent,
                waist_circumference_cm: waistCm,
                visceral_fat: visceralFat,
                notes
            };
            const success = await addBodyCompositionToDB(input_data);
            if (success) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, globalSettings.frmTimeSuccess);
            }
        }
    };

    return (
        <>
            <div className="verify-email pb-20" id="feedback-main">
                <div className="container">
                    <div className="feedback-content mt-16">
                        <form className="feedback-form" onSubmit={handleFormSubmit}>
                            <div className="form-div feedback-email">
                                <label htmlFor="measurement-date" className="custom-lbl-feedback">Measurement Date*</label>
                                <input 
                                    type="date" 
                                    id="measurement-date" 
                                    value={measurementDate} 
                                    onChange={(e) => setMeasurementDate(e.target.value)} 
                                    className={"border-green-1 " + dateErrorClass}
                                />
                            </div>
                            <div className="body-comp-grid">
                                <div className="form-div feedback-email">
                                    <label htmlFor="weight-kg" className="custom-lbl-feedback">Weight (Kg)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="weight-kg" 
                                        value={weightKg}
                                        onChange={(e) => setWeightKg(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="form-div feedback-email">
                                    <label htmlFor="bmi" className="custom-lbl-feedback">BMI (Kg/m2)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="bmi" 
                                        value={bmi}
                                        onChange={(e) => setBmi(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="form-div feedback-email">
                                    <label htmlFor="body-fat-percent" className="custom-lbl-feedback">Body Fat (%)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="body-fat-percent" 
                                        value={bodyFatPercent}
                                        onChange={(e) => setBodyFatPercent(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="form-div feedback-email">
                                    <label htmlFor="body-fat-kg" className="custom-lbl-feedback">Body Fat (Kg)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="body-fat-kg" 
                                        value={bodyFatKg}
                                        onChange={(e) => setBodyFatKg(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="form-div feedback-email">
                                    <label htmlFor="lean-body-mass-kg" className="custom-lbl-feedback">Lean Body Mass (Kg)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="lean-body-mass-kg" 
                                        value={leanBodyMassKg}
                                        onChange={(e) => setLeanBodyMassKg(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="form-div feedback-email">
                                    <label htmlFor="muscle-mass-kg" className="custom-lbl-feedback">Muscle Mass (Kg)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="muscle-mass-kg" 
                                        value={muscleMassKg}
                                        onChange={(e) => setMuscleMassKg(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="form-div feedback-email">
                                    <label htmlFor="water-percent" className="custom-lbl-feedback">Total Body Water (%)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="water-percent" 
                                        value={totalBodyWaterPercent}
                                        onChange={(e) => setTotalBodyWaterPercent(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="form-div feedback-email">
                                    <label htmlFor="waist-cm" className="custom-lbl-feedback">Waist Circumference (cm)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="waist-cm" 
                                        value={waistCm}
                                        onChange={(e) => setWaistCm(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                                <div className="form-div feedback-email">
                                    <label htmlFor="visceral-fat" className="custom-lbl-feedback">Visceral Fat</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        id="visceral-fat" 
                                        value={visceralFat}
                                        onChange={(e) => setVisceralFat(e.target.value)} 
                                        className="border-green-1"
                                    />
                                </div>
                            </div>
                            <div className="form-div">
                                <label htmlFor="notes" className="custom-lbl-feedback">Notes</label>
                                <textarea rows={4} cols={50} placeholder="Write here..." className="sm-font-sans custom-textarea mt-8 border-green-1" id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                            </div>
                            <div className="green-btn mt-4">
                                <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-full">{saveBtnText}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
};

export default AddBodyComposition;
