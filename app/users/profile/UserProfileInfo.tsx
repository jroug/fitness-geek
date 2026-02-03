"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; 
import Loading from '@/components/Loader';
import moment from "moment";

// Importing images
import profileImage from '@/public/images/main-img/profile-img.png';
import cameraIcon from '@/public/svg/camera-icon.svg';
import editIcon from '@/public/svg/edit-icon.svg';

const profileDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/profile-data`;
const profileDataUpdateUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/update-profile-data`;
const profileUploadPictureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/upload-profile-picture`;

const UserProfileInfo = () => {
    const [profileData, setProfileData] = useState({
        password: '',
        first_name: '',
        last_name: '',
        user_name: '',
        user_registered: '',
        date_of_birth: '', // neet to fix this in the backend
        email: '',
        profile_picture: '',
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [imageSuccess, setImageSuccess] = useState<string | null>(null);
    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic client-side validation
        if (!file.type.startsWith('image/')) {
            setImageError('Please select an image file.');
            return;
        }

        // Limit to 5MB
        if (file.size > 5 * 1024 * 1024) {
            setImageError('Image must be 5MB or smaller.');
            return;
        }

        setIsUploadingImage(true);
        setImageError(null);
        setImageSuccess(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const resp = await fetch(profileUploadPictureUrl, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await resp.json().catch(() => ({}));

            if (!resp.ok) {
                throw new Error('Failed to upload image');
            }

            // Update local state with the new media id so the proxy route renders the new image
            if (data?.mediaId) {
                setProfileData((prev) => ({
                    ...prev,
                    profile_picture: String(data.mediaId),
                }));
            }

            setImageSuccess('Profile image updated successfully.');
        } catch (error) {
            setImageError('Failed to upload image');
            console.error('Failed to upload image:', error);
        } finally {
            setIsUploadingImage(false);
            // allow selecting the same file again
            e.target.value = '';
        }
    };
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);
    const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
    const [isLastNameEditable, setIsLastNameEditable] = useState(false);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const firstNameInputRef = useRef<HTMLInputElement>(null);
    const lastNameInputRef = useRef<HTMLInputElement>(null);
    const dobInputRef = useRef<HTMLInputElement>(null);

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
                // console.log("getImageFromWPUrl:", getImageFromWPUrl + "?src=" + data.profile_picture);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
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

    const formatDobForWp = (dob: string) => {
        // If already YYYYMMDD, keep it.
        if (/^\d{8}$/.test(dob)) return dob;
        // Convert YYYY-MM-DD -> YYYYMMDD
        const m = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return dob;
        return `${m[1]}${m[2]}${m[3]}`;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (isPasswordEditable && (profileData.password ?? "").trim().length > 0 && (profileData.password ?? "").trim().length < 8) {
            setSaveError("Password must be at least 8 characters long.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            const payload = {
                first_name: profileData.first_name ?? "",
                last_name: profileData.last_name ?? "",
                date_of_birth: formatDobForWp(profileData.date_of_birth ?? ""),
                // Only send password if user has enabled editing and actually typed something
                password:
                    isPasswordEditable && (profileData.password ?? "").trim().length > 7
                        ? (profileData.password ?? "")
                        : "",
            };

            const response = await fetch(profileDataUpdateUrl, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error("Failed to save profile data");
            }

            // If API returns updated user data, merge it back. Otherwise keep current.
            if (data && typeof data === "object") {
                setProfileData((prev) => ({
                    ...prev,
                    ...data,
                }));
            }

            setSaveSuccess("Profile updated successfully.");

            // Lock editable fields again
            setIsPasswordEditable(false);
            setIsFirstNameEditable(false);
            setIsLastNameEditable(false);
        } catch (error) {
            console.error('Logout request failed:', error);
            setSaveError("Failed to save profile data");
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="verify-email" id="profile-main">
            <div className="container">
                <div className="profile-content">
                    {/* Personal Info Form */}
                    <form className="personal-info-form " onSubmit={handleFormSubmit}>
                        <div className="profile-edit-first mt-16">
                            <div className="profile-edit-img">
                                <Image
                                    src={profileData.profile_picture ? `/api/get-image-from-wp?id=${encodeURIComponent(profileData.profile_picture)}` : profileImage}
                                    alt="profile-img"
                                    width={150}
                                    height={150}
                                    className="profile-pic"
                                    priority
                                />
                                <div className="image-input">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="imageInput"
                                        className="file-upload"
                                        onChange={handleProfileImageChange}
                                        disabled={isUploadingImage}
                                    />
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

                        {imageError && (
                            <div className="mt-4 text-red-600 text-sm">{imageError}</div>
                        )}
                        {imageSuccess && (
                            <div className="mt-4 text-green-600 text-sm">{imageSuccess}</div>
                        )}

                        <div className="flex mt-24">
                            <div className="w-1/2 personal-name border-green-1 mt-4 mr-2">
                                <label htmlFor="user_name">Username</label>
                                <input 
                                    type="text" 
                                    name="user_name" 
                                    id="user_name" 
                                    value={profileData.user_name ?? ''} 
                                    autoComplete="off" 
                                    disabled
                                />
                            </div>
                            <div className="w-1/2 personal-name border-green-1 mt-4 ml-2 ">
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
                        </div>
                        <br />
                        <div className="personal-name border-green-1 mt-4">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="text" 
                                name="email" 
                                id="email" 
                                value={profileData.email ?? ''} 
                                autoComplete="off" 
                                disabled
                            />

                        </div>
                        <div className="personal-name border-green-1 mt-4">
                            <label htmlFor="password">Password</label>
                            <input 
                                ref={passwordInputRef}
                                type="password" 
                                name="password" 
                                id="password" 
                                value={isPasswordEditable ? (profileData.password ?? '') : '*****'}
                                onChange={isPasswordEditable ? handleInputChange : undefined}
                                autoComplete="off" 
                                readOnly={!isPasswordEditable}   
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPasswordEditable(true);
                                    setTimeout(() => passwordInputRef.current?.focus(), 0);
                                }}
                                className="custom-icon-edit"
                            >
                                <Image src={editIcon} alt="edit-icon" width={20} height={20} />
                            </button>
                        </div>
                        <br />
                        <div className="personal-name border-green-1 mt-4">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                ref={firstNameInputRef}
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={profileData.first_name ?? ''}
                                onChange={isFirstNameEditable ? handleInputChange : undefined}
                                autoComplete="off"
                                readOnly={!isFirstNameEditable}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFirstNameEditable(true);
                                    setTimeout(() => firstNameInputRef.current?.focus(), 0);
                                }}
                                className="custom-icon-edit"
                            >
                                <Image src={editIcon} alt="edit-icon" width={20} height={20} />
                            </button>
                        </div>

                        <div className="personal-name border-green-1 mt-4">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                            ref={lastNameInputRef}
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={profileData.last_name ?? ''}
                            onChange={isLastNameEditable ? handleInputChange : undefined}
                            autoComplete="off"
                            readOnly={!isLastNameEditable}
                            />
                            <button
                            type="button"
                            onClick={() => {
                                setIsLastNameEditable(true);
                                setTimeout(() => lastNameInputRef.current?.focus(), 0);
                            }}
                            className="custom-icon-edit"
                            >
                            <Image src={editIcon} alt="edit-icon" width={20} height={20} />
                            </button>
                        </div>

                        <div className="personal-name border-green-1 mt-4">
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input
                            ref={dobInputRef}
                            type="date"
                            name="date_of_birth"
                            id="date_of_birth"
                            value={profileData.date_of_birth ?? ''}
                            onChange={handleInputChange}
                            autoComplete="off"
                            />
                        </div>
                        <br />

                        {saveError && (
                            <div className="mt-4 text-red-600 text-sm">{saveError}</div>
                        )}
                        {saveSuccess && (
                            <div className="mt-4 text-green-600 text-sm">{saveSuccess}</div>
                        )}
                        <div className="green-btn mt-16">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-blue-500 text-white py-2 px-6 rounded-full disabled:opacity-50"
                            >
                                {isSaving ? "SAVING..." : "UPDATE CHANGES"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileInfo;