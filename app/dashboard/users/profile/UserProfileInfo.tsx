"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Loading from '@/components/Loading';
import moment from 'moment';

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
        date_of_birth: '',
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

    const [isPasswordEditable, setIsPasswordEditable] = useState(false);
    const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
    const [isLastNameEditable, setIsLastNameEditable] = useState(false);

    const passwordInputRef = useRef<HTMLInputElement>(null);
    const firstNameInputRef = useRef<HTMLInputElement>(null);
    const lastNameInputRef = useRef<HTMLInputElement>(null);
    const dobInputRef = useRef<HTMLInputElement>(null);

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setImageError('Please select an image file.');
            return;
        }

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
            e.target.value = '';
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(profileDataFetchUrl, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setProfileData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const formatDobForWp = (dob: string) => {
        if (/^\d{8}$/.test(dob)) return dob;
        const m = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return dob;
        return `${m[1]}${m[2]}${m[3]}`;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isPasswordEditable && (profileData.password ?? '').trim().length > 0 && (profileData.password ?? '').trim().length < 8) {
            setSaveError('Password must be at least 8 characters long.');
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            const payload = {
                first_name: profileData.first_name ?? '',
                last_name: profileData.last_name ?? '',
                date_of_birth: formatDobForWp(profileData.date_of_birth ?? ''),
                password:
                    isPasswordEditable && (profileData.password ?? '').trim().length > 7
                        ? (profileData.password ?? '')
                        : '',
            };

            const response = await fetch(profileDataUpdateUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error('Failed to save profile data');
            }

            if (data && typeof data === 'object') {
                setProfileData((prev) => ({
                    ...prev,
                    ...data,
                }));
            }

            setSaveSuccess('Profile updated successfully.');
            setIsPasswordEditable(false);
            setIsFirstNameEditable(false);
            setIsLastNameEditable(false);
        } catch (error) {
            console.error('Save request failed:', error);
            setSaveError('Failed to save profile data');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    const inputBase =
        'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500';
    const inputNormal = 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';

    return (
        <div className="min-h-[calc(100vh-120px)] bg-slate-50 pb-24" id="profile-main">
            <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Profile</p>
                    <h1 className="mt-2 text-2xl font-bold md:text-3xl">Personal Information</h1>
                    <p className="mt-2 text-sm text-cyan-100">Manage your identity details, date of birth, password, and profile photo.</p>
                </section>

                <form onSubmit={handleFormSubmit} className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <Image
                                src={profileData.profile_picture ? `/api/get-image-from-wp?id=${encodeURIComponent(profileData.profile_picture)}` : profileImage}
                                alt="profile-img"
                                width={140}
                                height={140}
                                className="h-[140px] w-[140px] rounded-full border-4 border-white object-cover shadow-lg ring-1 ring-slate-200"
                                priority
                            />
                            <div className="absolute -bottom-1 -right-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="imageInput"
                                    className="hidden"
                                    onChange={handleProfileImageChange}
                                    disabled={isUploadingImage}
                                />
                                <label
                                    htmlFor="imageInput"
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-slate-700"
                                >
                                    <Image src={cameraIcon} alt="camera-icon" width={20} height={20} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {imageError && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{imageError}</div>}
                    {imageSuccess && <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{imageSuccess}</div>}

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="user_name" className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
                            <input type="text" name="user_name" id="user_name" value={profileData.user_name ?? ''} autoComplete="off" disabled className={`${inputBase} ${inputNormal}`} />
                        </div>
                        <div>
                            <label htmlFor="user_registered" className="mb-2 block text-sm font-semibold text-slate-700">Member Since</label>
                            <input
                                type="text"
                                name="user_registered"
                                id="user_registered"
                                value={profileData.user_registered ? moment(profileData.user_registered).format('D MMMM YYYY') : ''}
                                autoComplete="off"
                                disabled
                                className={`${inputBase} ${inputNormal}`}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                        <input type="text" name="email" id="email" value={profileData.email ?? ''} autoComplete="off" disabled className={`${inputBase} ${inputNormal}`} />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="relative">
                            <label htmlFor="first_name" className="mb-2 block text-sm font-semibold text-slate-700">First Name</label>
                            <input
                                ref={firstNameInputRef}
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={profileData.first_name ?? ''}
                                onChange={isFirstNameEditable ? handleInputChange : undefined}
                                autoComplete="off"
                                readOnly={!isFirstNameEditable}
                                className={`${inputBase} ${inputNormal} pr-12 ${!isFirstNameEditable ? 'bg-slate-50' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFirstNameEditable(true);
                                    setTimeout(() => firstNameInputRef.current?.focus(), 0);
                                }}
                                className="absolute right-3 top-[38px] rounded-md p-1 transition hover:bg-slate-100"
                            >
                                <Image src={editIcon} alt="edit-icon" width={18} height={18} />
                            </button>
                        </div>

                        <div className="relative">
                            <label htmlFor="last_name" className="mb-2 block text-sm font-semibold text-slate-700">Last Name</label>
                            <input
                                ref={lastNameInputRef}
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={profileData.last_name ?? ''}
                                onChange={isLastNameEditable ? handleInputChange : undefined}
                                autoComplete="off"
                                readOnly={!isLastNameEditable}
                                className={`${inputBase} ${inputNormal} pr-12 ${!isLastNameEditable ? 'bg-slate-50' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLastNameEditable(true);
                                    setTimeout(() => lastNameInputRef.current?.focus(), 0);
                                }}
                                className="absolute right-3 top-[38px] rounded-md p-1 transition hover:bg-slate-100"
                            >
                                <Image src={editIcon} alt="edit-icon" width={18} height={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="date_of_birth" className="mb-2 block text-sm font-semibold text-slate-700">Date of Birth</label>
                            <input
                                ref={dobInputRef}
                                type="date"
                                name="date_of_birth"
                                id="date_of_birth"
                                value={profileData.date_of_birth ?? ''}
                                onChange={handleInputChange}
                                autoComplete="off"
                                className={`${inputBase} ${inputNormal}`}
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                            <input
                                ref={passwordInputRef}
                                type="password"
                                name="password"
                                id="password"
                                value={isPasswordEditable ? (profileData.password ?? '') : '*****'}
                                onChange={isPasswordEditable ? handleInputChange : undefined}
                                autoComplete="off"
                                readOnly={!isPasswordEditable}
                                className={`${inputBase} ${inputNormal} pr-12 ${!isPasswordEditable ? 'bg-slate-50' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPasswordEditable(true);
                                    setTimeout(() => passwordInputRef.current?.focus(), 0);
                                }}
                                className="absolute right-3 top-[38px] rounded-md p-1 transition hover:bg-slate-100"
                            >
                                <Image src={editIcon} alt="edit-icon" width={18} height={18} />
                            </button>
                        </div>
                    </div>

                    {saveError && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{saveError}</div>}
                    {saveSuccess && <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{saveSuccess}</div>}

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSaving ? 'SAVING...' : 'UPDATE CHANGES'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfileInfo;
