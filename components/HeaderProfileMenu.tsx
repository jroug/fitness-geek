'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import profileImage from '@/public/images/main-img/profile-img.png';
import card_down from '@/public/svg/card-down.svg';
import { profileDataSWRFetcher, profileDataSWRKey } from '@/lib/profileDataSWR';

type ProfileSummary = {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
};

export default function HeaderProfileMenu() {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const defaultProfileSummary: ProfileSummary = {
    first_name: '',
    last_name: '',
    email: '',
    profile_picture: '',
  };
  const { data: profileData } = useSWR<Record<string, unknown>>(
    profileDataSWRKey,
    (url) => profileDataSWRFetcher<Record<string, unknown>>(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 300000,
    },
  );
  const profileSummary: ProfileSummary = {
    first_name: String(profileData?.first_name ?? defaultProfileSummary.first_name),
    last_name: String(profileData?.last_name ?? defaultProfileSummary.last_name),
    email: String(profileData?.email ?? defaultProfileSummary.email),
    profile_picture: String(profileData?.profile_picture ?? defaultProfileSummary.profile_picture),
  };

  const handleLogout = async () => {
    const res = await fetch('/api/logout', {
      method: 'POST',
    });

    if (res.ok) {
      setIsProfileMenuOpen(false);
      router.push('/users/logout');
    } else {
      alert('Logout failed');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const profileFullName = `${profileSummary.first_name} ${profileSummary.last_name}`.trim() || 'My Profile';

  return (
    <div className="relative z-10" ref={profileMenuRef}>
      <button
        type="button"
        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full bg-slate-100 p-1 pr-2 transition hover:bg-slate-200"
        aria-label="Open profile menu"
      >
        <Image
          src={
            profileSummary.profile_picture
              ? `/api/get-image-from-wp?id=${encodeURIComponent(profileSummary.profile_picture)}`
              : profileImage
          }
          alt="profile-icon"
          width={28}
          height={28}
          className="h-7 w-7 rounded-full object-cover"
        />
        <Image src={card_down} alt="open-menu-icon" className="h-3 w-3 opacity-70" />
      </button>
      {isProfileMenuOpen ? (
        <div className="absolute right-0 top-full mt-3 w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-center gap-4">
            <Image
              src={
                profileSummary.profile_picture
                  ? `/api/get-image-from-wp?id=${encodeURIComponent(profileSummary.profile_picture)}`
                  : profileImage
              }
              alt="profile-avatar"
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[18px] font-bold leading-6 text-slate-800">{profileFullName}</p>
              <p className="truncate text-[16px] leading-6 text-slate-600">{profileSummary.email || 'No email available'}</p>
            </div>
          </div>
          <div className="my-4 h-px bg-slate-200" />
          <button
            type="button"
            onClick={() => {
              setIsProfileMenuOpen(false);
              router.push('/dashboard/users/profile');
            }}
            className="block w-full rounded-lg px-3 py-2 text-left text-[16px] font-normal leading-8 text-slate-800 transition hover:bg-slate-100"
          >
            My Profile
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-[16px] font-normal leading-8 text-slate-800 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
