'use client';
import React, { useMemo, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

import setting1 from "../public/images/setting/setting1.svg";

import dash_board_icon from "../public/images/setting/setting4.svg";
// import setting10 from "../public/images/setting/setting10.svg";
// import setting15 from "../public/images/setting/setting15.svg";
// import setting7 from "../public/images/setting/setting7.svg";


import setting3 from "../public/images/setting/setting3.svg";
import chart_icon from "../public/images/setting/setting5.svg";
import setting6 from "../public/images/setting/setting6.svg";

// import setting9 from "../public/images/setting/setting9.svg";

import setting11 from "../public/images/setting/setting11.svg";
import setting12 from "../public/images/setting/setting12.svg";
// import setting13 from "../public/images/setting/setting13.svg";

import setting17 from "../public/images/setting/setting17.svg";

import down_arrow from "../public/svg/down-arrow-white.svg";

// import Logout from "./Logout";
import { useRouter } from 'next/navigation';

const SideBar = () => {

	const router = useRouter();

	type MenuItem = {
	  key: string;
	  label: string;
	  href?: string;
	  icon: any;
	  iconBgClassName?: string;
	  children?: Array<{ key: string; label: string; href: string }>;
	};

	const menuItems: MenuItem[] = useMemo(
	  () => [
		{
		  key: 'dashboard',
		  label: 'Dashboard',
		  href: '/dashboard',
		  icon: dash_board_icon,
		},
		{
		  key: 'add-meal',
		  label: 'Add Meal',
		  href: '/add-meal',
		  icon: setting6,
		},
		{
		  key: 'add-weighing',
		  label: 'Add Weighing',
		  href: '/add-weighing',
		  icon: setting6,
		},
		{
		  key: 'add-workout',
		  label: 'Add Workout',
		  href: '/add-workout',
		  icon: setting1,
		},
		{
		  key: 'calendar',
		  label: 'Calendar',
		  href: '/calendar',
		  icon: setting3,
		},
		{
		  key: 'charts',
		  label: 'Charts',
		  icon: chart_icon,
		  children: [
			{ key: 'charts-weight', label: 'Weight Chart', href: '/charts/weight' },
			{ key: 'charts-workouts', label: 'Workouts Chart', href: '/charts/workouts' },
			{ key: 'charts-grades', label: 'Grades Chart', href: '/charts/grades' },
		  ],
		},
		{
		  key: 'personal-info',
		  label: 'Personal Info',
		  href: '/users/profile',
		  icon: setting12,
		},
		{
		  key: 'about',
		  label: 'About Fitness Geek',
		  href: '/about',
		  icon: setting11,
		},
		{
		  key: 'logout',
		  label: 'Logout',
		  icon: setting17,
		  iconBgClassName: 'bg-red',
		},
	  ],
	  []
	);

	const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

	// Function to show the logout modal
	const handleLogout = () => {
		document.body.classList.remove('open-sidebar');
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

	// if click on Link close the sidebar
	const handleLinkClick = () => {
		const sidebar = document.querySelector('.menu-sidebar') as HTMLElement;
		if (sidebar){ // sidebar is in a diffrent component so it needs to exist
			document.body.classList.remove('open-sidebar');
		}
	}

	const handleDropDownClick = (e: React.MouseEvent, key: string) => {
		e.preventDefault();
		setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
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
								  {menuItems.map((item) => {
									const isDropdown = Array.isArray(item.children) && item.children.length > 0;
									const isOpen = !!openDropdowns[item.key];

									// Special case: Logout (keeps your existing behavior)
									if (item.key === 'logout') {
									  return (
										<Link
										  key={item.key}
										  href="#"
										  onClick={handleLogout}
										  data-bs-toggle="modal"
										  data-bs-target="#workout-complete-modal"
										>
										  <div className="send-money-contact-tab">
											<div className={`setting-icon ${item.iconBgClassName ?? ''}`.trim()}>
											  <Image src={item.icon} alt="setting-icon" />
											</div>
											<div className="setting-title">
											  <h3>{item.label}</h3>
											</div>
										  </div>
										</Link>
									  );
									}

									// Dropdown group
									if (isDropdown) {
									  return (
										<div key={item.key} className="Char-content border-bottom1">
										  <div className="send-money-contact-tab ">
											<div className="setting-icon">
											  <Image src={item.icon} alt="setting-icon" />
											</div>
											<div className="setting-title">
											  <h3>{item.label}</h3>
											</div>
											<div className="contact-star">
											  <div className="star-favourite">
												<Link href="#" onClick={(e) => handleDropDownClick(e, item.key)}>
												 	<Image src={down_arrow} alt="edit-icon" />
												</Link>
											  </div>
											</div>
										  </div>

										  <div className={`diffrent-chat-dropdown ${isOpen ? 'show' : ''}`.trim()}>
											<ul>
											  {item.children!.map((child, idx) => (
												<li key={child.key} className={idx === item.children!.length - 1 ? 'border-0' : ''}>
												  <Link href={child.href} onClick={handleLinkClick}>
													{child.label}
												  </Link>
												</li>
											  ))}
											</ul>
										  </div>
										</div>
									  );
									}

									// Normal link item
									return (
									  <Link key={item.key} href={item.href ?? '#'} onClick={handleLinkClick}>
										<div className="Char-content border-bottom1">
										  <div className="send-money-contact-tab ">
											<div className="setting-icon">
											  <Image src={item.icon} alt="setting-icon" />
											</div>
											<div className="setting-title">
											  <h3>{item.label}</h3>
											</div>
										  </div>
										</div>
									  </Link>
									);
								  })}
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