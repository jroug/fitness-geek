'use client';
import React, { useState } from 'react';
import { mutate } from 'swr';

import Toast from '@/components/Toast';
import { globalSettings } from '@/lib/globalSettings';
import { getCurrentDateTime } from '@/lib/getCurrentDateTime';
import { profileDataSWRKey } from '@/lib/profileDataSWR';

interface WeighingInputData {
    datetime_of_weighing: string;
    weight: string;
    comments: string;
}

const AddWeighing: React.FC = () => {
    const [dateTimeErrorClass, setDateTimeErrorClass] = useState('');
    const [weightErrorClass, setWeightErrorClass] = useState('');

    const [dateTime, setDateTime] = useState(getCurrentDateTime);
    const [weightVal, setWeightVal] = useState('');
    const [weightComments, setWeightComments] = useState('');

    const [popupData, setPopupData] = useState({ title: '', message: '', time: 0, show_popup: false });

    const [isSaving, setIsSaving] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('SAVE');

    const addWeightToDB = async (input_data: WeighingInputData) => {
        if (isSaving) return false;
        setIsSaving(true);
        setSaveBtnText('Saving...');

        const addWeighingsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-weighing`;
        const res = await fetch(addWeighingsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input_data),
        });
        const data = await res.json();
        if (data.user_weight_added) {
            await mutate(profileDataSWRKey);
            setPopupData({ title: 'Message', message: data.message, time: globalSettings.frmTimeSuccess, show_popup: true });
            setDateTime('');
            setWeightVal('');
            setWeightComments('');

            setSaveBtnText('Save');
            setIsSaving(false);

            return true;
        } else if (data.code === 'weighing_exists') {
            setPopupData({ title: 'Error!', message: data.message, time: globalSettings.frmTimeError, show_popup: true });
            setSaveBtnText('Save');
            setIsSaving(false);
            return false;
        } else {
            setPopupData({ title: 'Error!', message: 'Something went wrong!', time: globalSettings.frmTimeError, show_popup: true });
            return false;
        }
    };

    const handleWeightComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWeightComments(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let doSubmit = true;

        if (!dateTime) {
            doSubmit = false;
            setDateTimeErrorClass('error');
        } else {
            setDateTimeErrorClass('');
        }

        if (!weightVal) {
            doSubmit = false;
            setWeightErrorClass('error');
        } else {
            setWeightErrorClass('');
        }

        if (doSubmit) {
            const input_data: WeighingInputData = {
                datetime_of_weighing: dateTime,
                weight: weightVal,
                comments: weightComments,
            };
            const success = await addWeightToDB(input_data);
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
                <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
                    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Form</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Add Weighing</h1>
                        <p className="mt-2 text-sm text-cyan-100">Capture weight entries with date and optional notes.</p>
                    </section>

                    <form onSubmit={handleFormSubmit} className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="datetime-local" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Date & Time of Weighing*
                                </label>
                                <input
                                    type="datetime-local"
                                    id="datetime-local"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    className={`${inputBase} ${dateTimeErrorClass ? inputError : inputNormal}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="weight" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Weight*
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    value={weightVal}
                                    onChange={(e) => setWeightVal(e.target.value)}
                                    className={`${inputBase} ${weightErrorClass ? inputError : inputNormal}`}
                                    placeholder="e.g. 78.4"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="comments" className="mb-2 block text-sm font-semibold text-slate-700">
                                Comments
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Write here..."
                                className={`${inputBase} ${inputNormal}`}
                                id="comments"
                                value={weightComments}
                                onChange={handleWeightComments}
                            ></textarea>
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

export default AddWeighing;
