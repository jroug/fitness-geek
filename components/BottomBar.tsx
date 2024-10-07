import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import icon1 from "../public/images/homescreen/icon1.svg";
import icon2 from "../public/images/homescreen/icon2.svg";
import icon3 from "../public/images/homescreen/icon3.svg";
import icon4 from "../public/images/homescreen/icon4.svg";
import icon5 from "../public/images/homescreen/icon5.svg";
import shape from "../public/images/shape.png";


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
					<Image src={shape} priority={true} alt="shape-icon" className="shape-icon-bottom" />
				</div>
			</div>
			<div className="navigation">
				<ul className="listWrap">
					<li className="list active ">
						<Link href="/homescreen">
							<i className="icon">
								<Image src={icon1} alt="tabbar-icon" />	
							</i>
							<span className="text"></span>
						</Link>
					</li>
					<li className="list">
						<Link href="#">
							<i className="icon">
								<Image src={icon2} alt="tabbar-icon" />
							</i>
							<span className="text"></span>
						</Link>
					</li>
					<li className="list ">
						<Link href="#">
							<i className="icon">
								<Image src={icon4} alt="tabbar-icon" />	
							</i>
							<span className="text"></span>
						</Link>
					</li>
					<li className="list">
						<Link href="#">
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