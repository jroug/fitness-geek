import Image from "next/image";
import Link from "next/link";
import settingImg from "../../public/images/main-img/setting-img.png";
import setting1 from "../../public/images/setting/setting1.svg";
import setting2 from "../../public/images/setting/setting2.svg";
import setting7 from "../../public/images/setting/setting7.svg";
import setting3 from "../../public/images/setting/setting3.svg";
import setting4 from "../../public/images/setting/setting4.svg";
import upArrow from "../../public/svg/up-arrow.svg";
import rightArrow from "../../public/svg/right-arrow.svg";
import setting5 from "../../public/images/setting/setting5.svg";
import setting6 from "../../public/images/setting/setting6.svg";
// import setting8 from "../../public/images/setting/setting8.svg";
// import setting18 from "../../public/images/setting/setting18.svg";
import setting9 from "../../public/images/setting/setting9.svg";
import setting10 from "../../public/images/setting/setting10.svg";
import setting11 from "../../public/images/setting/setting11.svg";
import setting12 from "../../public/images/setting/setting12.svg";
import setting13 from "../../public/images/setting/setting13.svg";
// import setting15 from "../../public/images/setting/setting15.svg";
// import setting16 from "../../public/images/setting/setting16.svg";
// import setting17 from "../../public/images/setting/setting17.svg";


const Settings = () => {
    return (
        <main className="site-content">
            <div className="verify-email pb-20" id="setting-main">
                <div className="container">
                    <div className="setting-main-wrap">
                        <h1 className="hidden">Hidden</h1>
                        <div className="setting-bottom-img p-0 mt-16">
                            <div className="verify-email-img-sec">
                                <div className="main-img-top">
                                    <Image src={settingImg} alt="notification-img" />
                                </div>
                                <div className="setting-content">
                                    <div className="workout-time">
                                        <h2>Upgrade Plan to Unlock More!</h2>
                                        <p className="mt-8">Enjoy all the benefits and explore more possibilities</p>
                                    </div>
                                    <div className="workout-btn">
                                        <Link href="account-upgrade-plan.html">
                                            <Image src={rightArrow} alt="right-arrow" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="setting-bottom">
                            <Link href="workout-preferences.html">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting1} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Workout Preferences</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="billing-subscription.html">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting2} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Billing & Subscriptions</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="set-biometric.html">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting7} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Set biometric</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="payment-method.html">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting3} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Payment Methods</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="linked-account.html">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting4} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Linked Accounts</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className="Char-content border-bottom1">
                                <div className="send-money-contact-tab">
                                    <div className="setting-icon">
                                        <Image src={setting3} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Different Chart</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={upArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                                <div className="diffrent-chat-dropdown">
                                    <ul>
                                        <li><Link href="area-chart.html">Area Chat</Link></li>
                                        <li className="border-0"><Link href="line-chart.html">Line Chat</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <Link href="data-analytics.html">
                                <div className="send-money-contact-tab pb-0">
                                    <div className="setting-icon">
                                        <Image src={setting5} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Data & Analytics</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="profile.html">
                                <div className="send-money-contact-tab border-bottom1 pt-0">
                                    <div className="setting-icon">
                                        <Image src={setting6} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Personal Info</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            {/* <Link href="security.html">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting7} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Security</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link> */}
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
                                            <span className="setting-lanuage">English (US)</span>
                                            <span>
                                                <Image src={rightArrow} alt="edit-icon" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link> */}
                            <Link href="/faq">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting9} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>FAQs</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/about">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting10} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>About Fitness Geek</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/privacy">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting11} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Privacy Policy</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/terms">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting12} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Terms & Conditions</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/contact">
                                <div className="send-money-contact-tab border-bottom1">
                                    <div className="setting-icon">
                                        <Image src={setting13} alt="setting-icon" />
                                    </div>
                                    <div className="setting-title">
                                        <h3>Contact Us</h3>
                                    </div>
                                    <div className="contact-star">
                                        <div className="star-favourite">
                                            <Image src={rightArrow} alt="edit-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
 

export default Settings;