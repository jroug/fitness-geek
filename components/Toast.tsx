"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import tick from "../public/images/toast/tick-3.gif";

interface PopupData {
    title: string;
    message: string;
    time: number;
    show_popup: boolean;
}

interface PopupProps {
    setPopupData: (data: PopupData) => void;
    popupData: PopupData;
}

const Toast: React.FC<PopupProps> = ({ setPopupData, popupData }) => {
    const [gifKey, setGifKey] = useState(0);
    const [showGif, setShowGif] = useState(false);

    // Reset the GIF when the popup appears
    useEffect(() => {
        if (popupData.show_popup) {
            setGifKey((prevKey) => prevKey + 1);

            // Delay the GIF appearance by 1 second
            const gifTimeout = setTimeout(() => {
                setShowGif(true);
            }, 100);

            return () => clearTimeout(gifTimeout);
        } else {
            setShowGif(false);
        }
    }, [popupData.show_popup]);

    // Auto-close popup after a specified time
    useEffect(() => {
        if (popupData.show_popup && popupData.time > 0) {
            const timeout = setTimeout(() => {
                setPopupData({
                    title: "",
                    message: "",
                    time: 0,
                    show_popup: false,
                });
            }, popupData.time);

            return () => clearTimeout(timeout);
        }
    }, [popupData.show_popup, popupData.time, setPopupData]);

    return (
        <div
            className={`modal fade logout-modal toast-complete-modal ${
                popupData.show_popup ? "show-modal" : ""
            }`}
            id="popup-complete-modal"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="account-upgrade-remind text-center">
                            {popupData.title === "Error!" ? (
                                <>
                                    <h3 className="logout-txt pt-16 color-red">{popupData.title}</h3>
                                    <h3 className="p-0 mt-12 color-black text-[20px]">{popupData.message}</h3>
                                </>
                            ) : (
                                <>
                                    <div className="h-[200px] flex"> 
                                        {showGif && (
                                            <Image key={gifKey} src={tick} alt="logout-img" className="m-auto" />
                                        )}
                                     </div>
                                    <h3 className="p-0 mt-12 text-[20px]">{popupData.message}</h3>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;