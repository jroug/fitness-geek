
import React from 'react';
import Header from '@/components/Header';
import UserProfileInfo from './UserProfileInfo';
import SideBar from '@/components/SideBar';

const profilePage = () => {
    return (
        <>
            <Header backUrl="/homepage" title={'Personal Info'}  />
            <main className="site-content form-width">
                <UserProfileInfo  />
            </main>
            <SideBar />
        </>
    );
};

export default profilePage;