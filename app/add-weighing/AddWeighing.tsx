'use client';
import React, {  useState } from 'react';

import Toast from "@/components/Toast";
import { globalSettings } from '@/lib/globalSettings';
import { getCurrentDateTime } from '@/lib/getCurrentDateTime';

// Define interfaces for meal data

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

    const [popupData, setPopupData] = useState({ title: '', message: '', time:0, show_popup: false });

    // Function to determine the meal based on the current time
 

    const addWeightToDB = async (input_data: WeighingInputData) => {
        const addWeighingsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/add-weighing`;
        const res = await fetch(addWeighingsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input_data)
        });
        const data = await res.json();
        if (data.user_weight_added) {
            setPopupData({ title: 'Message', message: data.message, time:globalSettings.frmTimeSuccess, show_popup: true });
            setDateTime('');
            setWeightVal('');
            setWeightComments('');
            return true;
        } else {
            setPopupData({ title: 'Error!', message: 'Something went wrong!', time:globalSettings.frmTimeError, show_popup: true });
            return false;
        }
    };

    // useEffect(() => {
    //     checkAuthAndRedirect(router, false); // will redirect to root if no token found on http cookie
    // }, [router]);

    // const handleSetCurrentDateAndTime = (e: React.MouseEvent<HTMLAnchorElement>) => {
    //     e.preventDefault();
    //     setDateTime(getCurrentDateTime());
    // };

 

    const handleWeightComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWeightComments(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let doSubmit = true;

        if (!dateTime) {
            doSubmit = false;
            setDateTimeErrorClass("error");
        } else {
            setDateTimeErrorClass("");
        }

        if (!weightVal) {
            doSubmit = false;
            setWeightErrorClass("error");
        } else {
            setWeightErrorClass("");
        }

        if (doSubmit) {
            const input_data: WeighingInputData = {
                datetime_of_weighing: dateTime,
                weight: weightVal,
                comments: weightComments
            };
            const success = await addWeightToDB(input_data);
            if (success) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, globalSettings.frmTimeSuccess);
            }
        } else {
            alert('Complete all necessary fields!');
        }
    };

    return (
        <>
            <div className="verify-email pb-20" id="feedback-main">
                <div className="container">
                    <div className="feedback-content mt-16">
                        {/* <div className="green-btn mt-4">
                            <Link href="#" onClick={handleSetCurrentDateAndTime}>Set Current Date & Time</Link>
                        </div> */}
                        <form className="feedback-form" onSubmit={handleFormSubmit}>
                            <div className="form-div feedback-email">
                                <label htmlFor="datetime-local" className="custom-lbl-feedback">Date & Time of Weighing*</label>
                                <input 
                                    type="datetime-local" 
                                    id="datetime-local" 
                                    value={dateTime} 
                                    onChange={(e) => setDateTime(e.target.value)} 
                                    className={"border-green-1 " + dateTimeErrorClass}
                                />
                            </div>
                            <div className="form-div feedback-email">
                                <label htmlFor="weight" className="custom-lbl-feedback">Weight</label>
                                <input 
                                    type="number" 
                                    id="weight" 
                                    value={weightVal}
                                    onChange={(e) => setWeightVal(e.target.value)} 
                                    className={"border-green-1 " + weightErrorClass}
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="comments" className="custom-lbl-feedback">Comments</label>
                                <textarea rows={4} cols={50} placeholder="Write here..." className="sm-font-sans custom-textarea mt-8 border-green-1" id="comments" value={weightComments} onChange={handleWeightComments}></textarea>
                            </div>
                            <div className="green-btn mt-4">
                                <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-full">SAVE</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* <Popup popupData={popupData} setPopupData={setPopupData} /> */}
            <Toast popupData={popupData} setPopupData={setPopupData} />
        </>
    );
};

export default AddWeighing;
