import React from 'react';

const Logout = () => {
    return (
		<div className="modal fade" id="workout-complete-modal" tabindex="-1"  aria-hidden="true">
			<div className="modal-dialog ">
				<div className="modal-content">
					<div className="modal-body">
						<div className="account-upgrade-remind text-center" >
							<img src="assets/images/setting/logout-img.png" alt="logout-img">
							<h3 className="logout-txt pt-16">Logout</h3>
							<p className="sure-txt p-0 mt-12">Are you sure you want to log out?</p>
							<div className="border mt-24"></div>
							<div className="workout-bottom-btn-wrap mt-24">
								<div className="home-btn">
									<a href="homescreen.html">CANCEL</a>
								</div>
								<div className="report-btn">
									<a href="splashscreen.html">LOGOUT</a>
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