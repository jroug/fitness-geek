import React from 'react';
import Image from "next/image";
import Link from "next/link";
import logoutImg from "../public/images/setting/logout-img.png";


const Logout = () => {

	// Function to hide the logout modal
	const hideModal = () => {
		document.getElementById('workout-complete-modal')?.classList.remove('show-modal');
	};

    return (
		<div className="modal fade logout-modal " id="workout-complete-modal" >
			<div className="modal-dialog ">
				<div className="modal-content">
					<div className="modal-body">
						<div className="account-upgrade-remind text-center" >
							<Image src={logoutImg} alt="logout-img" className="m-auto" />
							<h3 className="logout-txt pt-16">Logout</h3>
							<p className="sure-txt p-0 mt-12">Are you sure you want to log out?</p>
							<div className="border mt-24"></div>
							<div className="workout-bottom-btn-wrap mt-24">
								<div className="home-btn">
									<Link href="#" onClick={hideModal} >CANCEL</Link>
								</div>
								<div className="report-btn">
									<Link href="/">LOGOUT</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    );
};

export default Logout;