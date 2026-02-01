
import React from 'react';
import Header from '@/components/Header';
import UserProfileInfo from './UserProfileInfo';
import SideBar from '@/components/SideBar';

const profilePage = () => {
    return (
        <>
            <main className="site-content">
                <Header backUrl="/homepage" title={'Personal Info'}  />
                <UserProfileInfo  />
            </main>
            <SideBar />
        </>
    );
};

export default profilePage;