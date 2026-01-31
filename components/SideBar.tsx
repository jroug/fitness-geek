import React from 'react';
import Image from "next/image";
import Link from 'next/link';

import setting1 from "../public/images/setting/setting1.svg";

// import setting8 from "../public/images/setting/setting8.svg";
// import setting10 from "../public/images/setting/setting10.svg";
// import setting15 from "../public/images/setting/setting15.svg";
// import setting7 from "../public/images/setting/setting7.svg";


import setting3 from "../public/images/setting/setting3.svg";
import setting5 from "../public/images/setting/setting5.svg";
import setting6 from "../public/images/setting/setting6.svg";

// import setting9 from "../public/images/setting/setting9.svg";

import setting11 from "../public/images/setting/setting11.svg";
import setting12 from "../public/images/setting/setting12.svg";
// import setting13 from "../public/images/setting/setting13.svg";

import setting17 from "../public/images/setting/setting17.svg";

import right_arrow from "../public/svg/right-arrow-white.svg";
// import up_arrow from "../public/svg/up-arrow.svg";
// import Logout from "./Logout";
import { useRouter } from 'next/navigation';

const SideBar = () => {

	const router = useRouter();

	// Function to show the logout modal
	const handleLogout = () => {
		logout();
	}

	const logout = async () => {
		const res = await fetch('/api/logout', {
			method: 'POST',
		});
		
		if (res.ok) {
			// console.log('Logged out successfully');
			router.push('/users/logout');
		} else {
			alert('Logout failed');
		}
	};

    return (
		<>
			<div className="menu-sidebar details">
				<div className="offcanvas offcanvas-start custom-offcanvas-noti show" id="offcanvasExample" aria-modal="true" role="dialog">
					<div className="offcanvas-header custom-header-offcanva">
						<button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div className="offcanvas-body">
						<div className="dropdown">
							<div className="setting-page-full">
								<div className="setting-page-wrapper">
									<Link href="/meals">
										<div className="send-money-contact-tab border-bottom1 pt-0  ">
											<div className="setting-icon">
												<Image src={setting6} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Add Meal</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link> 
									<Link href="/weighing">
										<div className="Char-content border-bottom1">
											<div className="send-money-contact-tab ">
												<div className="setting-icon">
													<Image src={setting6} alt="setting-icon" />
												</div>
												<div className="setting-title">
													<h3>Add Weighing</h3>
												</div>
												<div className="contact-star">
													<div className="star-favourite">
														<Image src={right_arrow} alt="edit-icon" />
													</div>
												</div>
											</div>
										</div>
									</Link>
									<Link href="/workouts">
										<div className="Char-content border-bottom1">
											<div className="send-money-contact-tab ">
												<div className="setting-icon">
													<Image src={setting1} alt="setting-icon" />
												</div>
												<div className="setting-title">
													<h3>Add Workout</h3>
												</div>
												<div className="contact-star">
													<div className="star-favourite">
														<Image src={right_arrow} alt="edit-icon" />
													</div>
												</div>
											</div>
										</div>
									</Link>
									<Link href="/calendar">
										<div className="Char-content border-bottom1">
											<div className="send-money-contact-tab ">
												<div className="setting-icon">
													<Image src={setting3} alt="setting-icon" />
												</div>
												<div className="setting-title">
													<h3>Calendar</h3>
												</div>
												<div className="contact-star">
													<div className="star-favourite">
														<Image src={right_arrow} alt="edit-icon" />
													</div>
												</div>
											</div>
										</div>
									</Link>
									<Link href="/charts/weight">
										<div className="Char-content border-bottom1">
											<div className="send-money-contact-tab ">
												<div className="setting-icon">
													<Image src={setting5} alt="setting-icon" />
												</div>
												<div className="setting-title">
													<h3>Weight Chart</h3>
												</div>
												<div className="contact-star">
													<div className="star-favourite">
														<Image src={right_arrow} alt="edit-icon" />
													</div>
												</div>
											</div>
										</div>
									</Link>
									<Link href="/charts/workouts">
										<div className="Char-content border-bottom1">
											<div className="send-money-contact-tab ">
												<div className="setting-icon">
													<Image src={setting5} alt="setting-icon" />
												</div>
												<div className="setting-title">
													<h3>Workouts Chart</h3>
												</div>
												<div className="contact-star">
													<div className="star-favourite">
														<Image src={right_arrow} alt="edit-icon" />
													</div>
												</div>
											</div>
										</div>
									</Link>
									<Link href="/charts/grades">
										<div className="Char-content border-bottom1">
											<div className="send-money-contact-tab ">
												<div className="setting-icon">
													<Image src={setting5} alt="setting-icon" />
												</div>
												<div className="setting-title">
													<h3>Grades Chart</h3>
												</div>
												<div className="contact-star">
													<div className="star-favourite">
														<Image src={right_arrow} alt="edit-icon" />
													</div>
												</div>
											</div>
										</div>
									</Link>
									<Link href="/users/profile">
										<div className="send-money-contact-tab border-bottom1 pt-0">
											<div className="setting-icon">
												<Image src={setting12} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Personal Info</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link>
									{/* <Link href="/settings">
										<div className="send-money-contact-tab border-bottom1">
											<div className="setting-icon">
												<Image src={setting7} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Settings</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link>  */}
									{/* <Link href="set-biometric.html">
										<div className="send-money-contact-tab border-bottom1">
											<div className="setting-icon">
												<Image src={setting7} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Set biometric</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link>  */}
									{/* <Link href="data-analytics.html">
										<div className="send-money-contact-tab  pb-0">
											<div className="setting-icon">
												<Image src={setting5} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Data &amp; Analytics</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link> 
									<div className="setting-center-border"></div>  */}
									{/* <Link href="language.html">
										<div className="send-money-contact-tab border-bottom1">
											<div className="setting-icon">
												<Image src={setting8} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Language</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<span className="setting-lanuage">
														English (US)
													</span>
													<span>
														<Image src={right_arrow} alt="edit-icon" />
													</span>
												</div>
											</div>
										</div>
									</Link>  */}
									{/* <Link href="/faq">
										<div className="send-money-contact-tab border-bottom1 ">
											<div className="setting-icon">
												<Image src={setting9} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>FAQs</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link>  */}
									{/* <Link href="data-privacy.html">
										<div className="send-money-contact-tab border-bottom1 ">
											<div className="setting-icon">
												<Image src={setting10} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Data &amp; Privacy Policy</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link>  */}
									<Link href="/about">
										<div className="send-money-contact-tab border-bottom1">
											<div className="setting-icon">
												<Image src={setting11} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>About Fitness Geek</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<span>
														<Image src={right_arrow} alt="edit-icon" />
													</span>
												</div>
											</div>
										</div>
									</Link> 
									{/* <Link href="/contact">
										<div className="send-money-contact-tab border-bottom1 ">
											<div className="setting-icon">
												<Image src={setting13} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Contact Us</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link>  */}
									{/* <Link href="Invite-friend.html">
										<div className="send-money-contact-tab border-bottom1 ">
											<div className="setting-icon">
												<Image src={setting15} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Invite Friends</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link>  */}
									<Link href="#" onClick={handleLogout} data-bs-toggle="modal" data-bs-target="#workout-complete-modal">
										<div className="send-money-contact-tab">
											<div className="setting-icon bg-red">
												<Image src={setting17} alt="setting-icon" />
											</div>
											<div className="setting-title">
												<h3>Logout</h3>
											</div>
											<div className="contact-star">
												<div className="star-favourite">
													<Image src={right_arrow} alt="edit-icon" />
												</div>
											</div>
										</div>
									</Link> 
								</div>
							</div>	
						</div>
					</div>
				</div>
				<div className="offcanvas-backdrop fade show"></div>
			</div>
			{/* <Logout /> */}
		</>
    );
};

export default SideBar;