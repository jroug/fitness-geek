import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import icon1 from "../public/images/homescreen/icon1.svg";
import icon2 from "../public/images/homescreen/icon2.svg";
import icon3 from "../public/images/homescreen/icon3.svg";
import icon4 from "../public/images/homescreen/icon4.svg";
import icon5 from "../public/images/homescreen/icon5.svg";


const BottomBar = () => {
    return (
		<div className="bottom-tabbar">
			<div className="bottom-menu-svg-main">
				<div className="bottom-menu-svg">
					<div className="gol3">
						<div className="add-to-cart-icon">
							<Link href="workout-history.html">
								<Image src={icon3} alt="tabbar-icon" />
							</Link>
						</div>
					</div>
					<svg className="bottom-menu-svg-design" width="600" height="150" viewBox="0 0 375 104" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g filter="url(#filter0_b_1_27651)">
							<path d="M188 46C205.673 46 220 31.6731 220 14C220 7.79231 224.732 1.14283 230.917 1.67204L360.364 12.7477C368.642 13.456 375 20.3816 375 28.6895V104H0V28.6961C0 20.3855 6.36254 13.4585 14.6432 12.7538L145.074 1.65329C151.266 1.12632 156 7.78564 156 14C156 31.6731 170.327 46 188 46Z" fill="#12151C"/>
						</g>
						<defs>
							<filter id="filter0_b_1_27651" x="-24" y="-22.3761" width="423" height="150.376" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
								<feFlood flood-opacity="0" result="BackgroundImageFix"/>
								<feGaussianBlur in="BackgroundImageFix" stdDeviation="12"/>
								<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1_27651"/>
								<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1_27651" result="shape"/>
							</filter>
						</defs>
					</svg>
				</div>
			</div>
			<div className="navigation">
				<ul className="listWrap">
					<li className="list active ">
						<Link href="homescreen.html">
							<i className="icon">
								<Image src={icon1} alt="tabbar-icon" />	
							</i>
							<span className="text"></span>
						</Link>
					</li>
					<li className="list">
						<Link href="discover-workouts.html">
							<i className="icon">
								<Image src={icon2} alt="tabbar-icon" />
							</i>
							<span className="text"></span>
						</Link>
					</li>
					<li className="list ">
						<Link href="bar-chart.html">
							<i className="icon">
								<Image src={icon4} alt="tabbar-icon" />	
							</i>
							<span className="text"></span>
						</Link>
					</li>
					<li className="list">
						<Link href="workout-history.html">
							<i className="icon">
								<Image src={icon5} alt="tabbar-icon" />	
							</i>
							<span className="text"></span>
						</Link>
					</li>
				</ul>
			</div> 
		</div>
    );
};

export default BottomBar;