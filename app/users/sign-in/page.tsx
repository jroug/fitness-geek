"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import left_arrow from "../../../public/svg/black-left-arrow.svg";
import small_logo from "../../../public/images/splashscreen/small-logo.png";
import mail_icon from "../../../public/svg/mail-icon.svg";
import password_icon from "../../../public/svg/password-icon.svg";



const sign_in = () => {
    
    const [inputEmail, setInputEmail] = useState('john@doe.gmail.com');
    const [inputPassword, setInputPassword] = useState('test123!@#');

    const handleOnChangeEmail = (e) => {
        setInputEmail(e.target.value);
    }
    const handleOnChangePassword = (e) => {
        setInputPassword(e.target.value);
    }
    const handleShowHidePassword = (e) => {
        document.getElementById('eye').classList.toggle("fa-eye");
        document.getElementById('eye').classList.toggle("fa-eye-slash");
   
        var input =  document.getElementById('password');
        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }
    }
    
    return (
        <main className="site-content">
            {/* <!-- Preloader start --> */}
            {/* <div className="preloader">
                <Image src="assets/images/favicon/preloader.gif" alt="preloader" />
            </div> */}
            {/* <!-- Preloader end --> */}

            {/* <!-- Header start --> */}
            <header id="top-header" className="border-0">
                <div className="header-wrap">
                    <div className="header-back">
                        <Link href="/">
                            <Image src={left_arrow} alt="back-btn-icon" />
                        </Link>
                    </div>
                </div>
            </header>
            {/* <!-- Header end --> */}

            {/* <!-- Sign up screen start --> */}
            <div className="verify-email pb-20" id="sign-up-main">
                <div className="container mx-auto">
                <div className="let-you-middle-wrap text-center">
                    <div className="middle-first mt-6">
                    <Image
                        src={small_logo}
                        alt="logo"
                        className="mx-auto"
                    />
                    <h1 className="text-xl font-normal mt-6 font-['Zen_Dots']">WELCOME BACK</h1>
                    <p className="text-base font-normal mt-3">
                        Sign in now to get access to personalized workouts and achieve your fitness goals.
                    </p>
                    </div>
                    <form className="mt-8">
                    <div className="form-details-sign-in border flex items-center px-4 py-2">
                        <span>
                        <Image src={mail_icon} alt="mail-icon" />
                        </span>
                        <input
                            type="email"
                            id="email"
                            className="flex-1 ml-2 text-black text-base font-normal outline-none"
                            autoComplete="off"
                            value={inputEmail}
                            onChange={handleOnChangeEmail}
                        />
                    </div>
                    <div className="form-details-sign-in border mt-2 flex items-center px-4 py-2">
                        <span>
                            <Image src={password_icon} alt="password-icon" />
                        </span>
                        <input
                            type="password"
                            id="password"
                            className="flex-1 ml-2 text-black text-base font-normal outline-none"
                            value={inputPassword}
                            onChange={handleOnChangePassword}
                        />
                        <i className="fas fa-eye-slash" id="eye" onClick={handleShowHidePassword} ></i>
                    </div>
                    </form>
                    <div className="password-btn mt-4">
                    <Link href="verify-email-address.html" className="bg-blue-500 text-white py-2 px-6 rounded-full">Sign in</Link>
                    </div>
                    <footer id="let-you-footer">
                        <div className="block-footer mt-4">
                            <p className="text-base font-normal text-center">
                                Don't have an account? &nbsp;
                                <Link href="/users/sign-up" className="font-medium text-black underline">Sign Up</Link>
                            </p>
                        </div>
                    </footer>
                </div>
                </div>
            </div>
            {/* <!-- Sign up screen end --> */}
        </main>

    );
};

export default sign_in;