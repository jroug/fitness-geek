'use client';
import React, { useState } from 'react';
import { mutate } from 'swr';

import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';
import { profileDataSWRKey } from '@/lib/profileDataSWR';

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

    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

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
            body: JSON.stringify(input_data),
        });

        const data = await res.json();
        if (data.bodycomposition_added) {
            await mutate(profileDataSWRKey);
            setPopupData({ title: 'Message', message: data.message || 'Saved', time: globalSettings.frmTimeSuccess, show_popup: true });
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
            setPopupData({ title: 'Error!', message: data.message || 'Something went wrong!', time: globalSettings.frmTimeError, show_popup: true });
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
            setDateErrorClass('error');
        } else {
            setDateErrorClass('');
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
                notes,
            };
            const success = await addBodyCompositionToDB(input_data);
            if (success) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, globalSettings.frmTimeSuccess);
            }
        }
    };

    const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition';
    const inputNormal = 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';
    const inputError = 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-200';

    return (
        <>
            <div className="min-h-[calc(100vh-120px)] pb-24">
                <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
                    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Form</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Add Body Composition</h1>
                        <p className="mt-2 text-sm text-cyan-100">Store body composition metrics for trend tracking and analysis.</p>
                    </section>

                    <form onSubmit={handleFormSubmit} className="typical-form mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <div>
                            <label htmlFor="measurement-date" className="mb-2 block text-sm font-semibold text-slate-700">
                                Measurement Date*
                            </label>
                            <input
                                type="date"
                                id="measurement-date"
                                value={measurementDate}
                                onChange={(e) => setMeasurementDate(e.target.value)}
                                className={`${inputBase} ${dateErrorClass ? inputError : inputNormal}`}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <label htmlFor="weight-kg" className="mb-2 block text-sm font-semibold text-slate-700">Weight (Kg)</label>
                                <input type="number" step="0.01" id="weight-kg" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="bmi" className="mb-2 block text-sm font-semibold text-slate-700">BMI (Kg/m2)</label>
                                <input type="number" step="0.01" id="bmi" value={bmi} onChange={(e) => setBmi(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="body-fat-percent" className="mb-2 block text-sm font-semibold text-slate-700">Body Fat (%)</label>
                                <input type="number" step="0.01" id="body-fat-percent" value={bodyFatPercent} onChange={(e) => setBodyFatPercent(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="body-fat-kg" className="mb-2 block text-sm font-semibold text-slate-700">Body Fat (Kg)</label>
                                <input type="number" step="0.01" id="body-fat-kg" value={bodyFatKg} onChange={(e) => setBodyFatKg(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="lean-body-mass-kg" className="mb-2 block text-sm font-semibold text-slate-700">Lean Body Mass (Kg)</label>
                                <input type="number" step="0.01" id="lean-body-mass-kg" value={leanBodyMassKg} onChange={(e) => setLeanBodyMassKg(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="muscle-mass-kg" className="mb-2 block text-sm font-semibold text-slate-700">Muscle Mass (Kg)</label>
                                <input type="number" step="0.01" id="muscle-mass-kg" value={muscleMassKg} onChange={(e) => setMuscleMassKg(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="water-percent" className="mb-2 block text-sm font-semibold text-slate-700">Total Body Water (%)</label>
                                <input type="number" step="0.01" id="water-percent" value={totalBodyWaterPercent} onChange={(e) => setTotalBodyWaterPercent(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="waist-cm" className="mb-2 block text-sm font-semibold text-slate-700">Waist Circumference (cm)</label>
                                <input type="number" step="0.01" id="waist-cm" value={waistCm} onChange={(e) => setWaistCm(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                            <div>
                                <label htmlFor="visceral-fat" className="mb-2 block text-sm font-semibold text-slate-700">Visceral Fat</label>
                                <input type="number" step="0.01" id="visceral-fat" value={visceralFat} onChange={(e) => setVisceralFat(e.target.value)} className={`${inputBase} ${inputNormal}`} />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-slate-700">Notes</label>
                            <textarea rows={5} placeholder="Write here..." className={`${inputBase} ${inputNormal}`} id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {saveBtnText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
};

export default AddBodyComposition;
