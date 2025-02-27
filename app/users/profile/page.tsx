"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import Header from '@/components/Header';
import Link from 'next/link';
import moment from "moment";

// Importing images
import profileImage from '@/public/images/main-img/profile-img.png';
import cameraIcon from '@/public/svg/camera-icon.svg';
import editIcon from '@/public/svg/edit-icon.svg';

const profileDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/profile-data`;

const Page = () => {
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        user_name: '',
        user_registered: '',
        date_of_birth: '', // neet to fix this in the backend
        email: '',
    });

    const [loading, setLoading] = useState<boolean>(true);

    // Fetch user profile data from backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(profileDataFetchUrl, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setProfileData(data);
                // console.log(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (loading) {
        return (
            <main className="site-content">
                <p className="text-center">Loading...</p>
            </main>
        );
    }

    return (
        <main className="site-content">
            <Header backUrl="/" title="Personal Info" />

            <div className="verify-email" id="profile-main">
                <div className="container">
                    <div className="profile-content">
                        <div className="profile-edit-first mt-16">
                            <div className="profile-edit-img">
                                <Image
                                    src={profileImage}
                                    alt="profile-img"
                                    width={150}
                                    height={150}
                                    className="profile-pic"
                                />
                                <div className="image-input">
                                    <input type="file" accept="image/*" id="imageInput" className="file-upload" />
                                    <label htmlFor="imageInput" className="image-button">
                                        <Image
                                            src={cameraIcon}
                                            alt="camera-icon"
                                            width={24}
                                            height={24}
                                            className="upload-button"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Personal Info Form */}
                        <form className="personal-info-form mt-24">
                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="user_registered">Member Since</label>
                                <input 
                                    type="text" 
                                    name="user_registered" 
                                    id="user_registered" 
                                    value={
                                        profileData.user_registered
                                            ? moment(profileData.user_registered).format("D MMMM YYYY") 
                                            : ""
                                    }
                                    autoComplete="off" 
                                    disabled 
                                />
                            </div>
                            <br />
                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="user_name">Name</label>
                                <input 
                                    type="text" 
                                    name="user_name" 
                                    id="user_name" 
                                    value={profileData.user_name} 
                                    onChange={handleInputChange} 
                                    autoComplete="off" 
                                />
                                <Link href="#">
                                    <Image src={editIcon} alt="edit-icon" width={20} height={20} className="custom-icon-edit"/>
                                </Link>
                            </div>

                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="first_name">First Name</label>
                                <input 
                                    type="text" 
                                    name="first_name" 
                                    id="first_name" 
                                    value={profileData.first_name} 
                                    onChange={handleInputChange} 
                                    autoComplete="off" 
                                />
                                <Link href="#">
                                    <Image src={editIcon} alt="edit-icon" width={20} height={20} className="custom-icon-edit"/>
                                </Link>
                            </div>

                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="last_name">Last Name</label>
                                <input 
                                    type="text" 
                                    name="last_name" 
                                    id="last_name" 
                                    value={profileData.last_name} 
                                    onChange={handleInputChange} 
                                    autoComplete="off" 
                                />
                                <Link href="#">
                                    <Image src={editIcon} alt="edit-icon" width={20} height={20} className="custom-icon-edit"/>
                                </Link>
                            </div>

                            {/* <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="date_of_birth">Date of Birth</label>
                                <input 
                                    type="text" 
                                    name="date_of_birth" 
                                    id="date_of_birth" 
                                    value={profileData.date_of_birth} 
                                    onChange={handleInputChange} 
                                    autoComplete="off" 
                                />
                                <Link href="#">
                                    <Image src={editIcon} alt="edit-icon" width={20} height={20} className="custom-icon-edit"/>
                                </Link>
                            </div> */}
                            <br />

                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    type="text" 
                                    name="email" 
                                    id="email" 
                                    value={profileData.email} 
                                    autoComplete="off" 
                                    disabled
                                />
                            </div>

                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    value="'********"
                                    autoComplete="off" 
                                    disabled 
                                />
                            </div>
                            <br />
                            <div className="green-btn mt-16">
                                <Link href="#">UPDATE CHANGES</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;