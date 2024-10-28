"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import activity5 from "../public/images/select-gender/activity5.png";

interface PopupData {
    title: string;
    message: string;
    show_popup: boolean;
}

interface PopupProps {
    setPopupData: (data: PopupData) => void;
    popupData: PopupData;
}

const Popup: React.FC<PopupProps> = ({ setPopupData, popupData }) => {

    const [localPopupData, setLocalPopupData] = useState<PopupData>({
        title: popupData.title,
        message: popupData.message,
        show_popup: popupData.show_popup,
    });

    // Sync local state with prop whenever the prop changes
    useEffect(() => {
        setLocalPopupData({
            title: popupData.title,
            message: popupData.message,
            show_popup: popupData.show_popup,
        });
    }, [popupData]);

    // Function to hide the modal
    const hideModal = () => {
        setPopupData({
            title: '',
            message: '',
            show_popup: false,
        });
    };

    return (
        <div className={`modal fade logout-modal popup-complete-modal ${localPopupData.show_popup ? "show-modal" : ""}`} id="popup-complete-modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="account-upgrade-remind text-center">
                            <Image src={activity5} alt="logout-img" className="m-auto" />
                            <h3 className="logout-txt pt-16">{localPopupData.title}</h3>
                            <p className="sure-txt p-0 mt-12">{localPopupData.message}</p>
                            <div className="border mt-24"></div>
                            <div className="workout-bottom-btn-wrap mt-24">
                                <Link href="#" onClick={hideModal} className="ok-btn">
                                    <span>OK</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Popup;
