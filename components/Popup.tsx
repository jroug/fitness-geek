"use client";

import React, {useState, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import activity5 from "../public/images/select-gender/activity5.png";


const Popup = (props) => {

	const setPopupDataParent = props.setPopupData;

	const [popupData, setPopupData] = useState({
		title: props.popupData.title,
		message: props.popupData.message,
		show_popup: props.popupData.show_popup,
	});

 

	// // Sync state with prop whenever the prop changes
	useEffect(() => {

        setPopupData({
			title: props.popupData.title,
			message: props.popupData.message,
			show_popup: props.popupData.show_popup,
		});
 
    }, [props]);

	// Function to hide the logout modal
	const hideModal = () => {
		// set the parent state and the current state will change
		setPopupDataParent({
			title: '',
			message: '',
			show_popup: false,
		});
	 
		// setPopupData({
		// 	title: '',
		// 	message: '',
		// 	show_popup: false,
		// });

	};

    return (
		<div className={"modal fade logout-modal popup-complete-modal " + (popupData.show_popup===true?"show-modal":"") } id="popup-complete-modal" >
			<div className="modal-dialog ">
				<div className="modal-content">
					<div className="modal-body">
						<div className="account-upgrade-remind text-center" >
							<Image src={activity5} alt="logout-img" className="m-auto" />
							<h3 className="logout-txt pt-16">{popupData.title}</h3>
							<p className="sure-txt p-0 mt-12">{popupData.message}</p>
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
};

export default Popup;