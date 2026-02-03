"use client"

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from "next/image";
import left_arrow from "../../../public/svg/black-left-arrow.svg";
import small_logo from "../../../public/images/splashscreen/small-logo.png";
import mail_icon from "../../../public/svg/mail-icon.svg";
import password_icon from "../../../public/svg/password-icon.svg";

const SignIn: React.FC = () => {
    
    const [inputEmail, setInputEmail] = useState<string>('john@doe.com');
    const [inputPassword, setInputPassword] = useState<string>('test');
    const [loginButtonText, setLoginButtonText] = useState<string>('Login');
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
    const [loginErrorBorder, setloginErrorBorder] = useState<boolean>(false);
    
    const router = useRouter();
    
    const handleOnChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputEmail(e.target.value);
    }

    const handleOnChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPassword(e.target.value);
    }

    const handleShowHidePassword = () => {
        const eyeIcon = document.getElementById('eye');
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;

        if (eyeIcon && passwordInput) {
            eyeIcon.classList.toggle("fa-eye");
            eyeIcon.classList.toggle("fa-eye-slash");

            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        }
    }
    
    const handleSignInSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginButtonText('Logging in...');
        login(inputEmail, inputPassword);
    }

    const login = async (username: string, password: string) => {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
      
        if (res.ok) {
            router.push("/homepage");
        } else {
            setloginErrorBorder(true)
            setLoginButtonText('Login');
            setLoginErrorMessage('Wrong email or password. Please try again.');
        }
    };

    return (
        <main className="site-content form-width">
            <header id="top-header" className="border-0">
                <div className="header-wrap">
                    <div className="header-back">
                        <Link href="/">
                            <Image src={left_arrow} alt="back-btn-icon" />
                        </Link>
                    </div>
                </div>
            </header>

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
                        <form className="mt-8" onSubmit={handleSignInSubmit} >
                            <div className={"form-details-sign-in flex items-center px-4 py-2 " + (loginErrorBorder ? " border-error" : "border") }>
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
                            <div className={"form-details-sign-in  mt-2 flex items-center px-4 py-2 " + (loginErrorBorder ? " border-error" : "border")}>
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
                                <i className="fas fa-eye-slash" id="eye" onClick={handleShowHidePassword}></i>
                            </div>
                            <div className="password-btn mt-4">
                                <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-full">{loginButtonText}</button>
                            </div>
                        </form>
                        <div className="mt-4">
                            <p className="text-red-500 text-sm font-normal">{loginErrorMessage}</p>
                        </div>
                        <footer id="let-you-footer">
                            <div className="block-footer mt-4">
                                <p className="text-base font-normal text-center">
                                    Don&#39;t have an account? &nbsp;
                                    <Link href="/users/sign-up" className="font-medium text-black underline">Sign Up</Link>
                                </p>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SignIn;
