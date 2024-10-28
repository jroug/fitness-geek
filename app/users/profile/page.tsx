import React from 'react';
import Image from 'next/image'; // Importing Next.js Image component
import Header from '@/components/Header';
import Link from 'next/link';

// Importing images
import profileImage from '@/public/images/main-img/profile-img.png';
import cameraIcon from '@/public/svg/camera-icon.svg';
import editIcon from '@/public/svg/edit-icon.svg';

const page = () => {
    return (
        <main className="site-content">
            {/* Replacing with Header Component */}
            <Header backUrl="/" title={"Personal Info"}  />

            {/* Profile Screen */}
            <div className="verify-email" id="profile-main">
                <div className="container">

                    {/* Profile Content */}
                    <div className="profile-content">
                        <div className="profile-edit-first mt-16">
                            <div className="profile-edit-img">
                                <Image
                                    src={profileImage}
                                    alt="profile-img"
                                    width={150} // Replace with actual width
                                    height={150} // Replace with actual height
                                    className="profile-pic"
                                />
                                <div className="image-input">
                                    <input type="file" accept="image/*" id="imageInput" className="file-upload" />
                                    <label htmlFor="imageInput" className="image-button">
                                        <Image
                                            src={cameraIcon}
                                            alt="camera-icon"
                                            width={24} // Replace with actual width
                                            height={24} // Replace with actual height
                                            className="upload-button"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Personal Info Form */}
                        <form className="personal-info-form mt-24">
                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" value="Jessica Smith" autoComplete="off" />
                                <Link href="#">
                                    <Image src={editIcon} alt="edit-icon" width={20} height={20} className="custom-icon-edit"/>
                                </Link>
                            </div>
                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="name">Email Address</label>
                                <input type="text" name="name" id="name" value="Jessica Smith" autoComplete="off" />
                                <Link href="#">
                                    <Image src={editIcon} alt="edit-icon" width={20} height={20} className="custom-icon-edit"/>
                                </Link>
                            </div>
                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="name">Date of Birth</label>
                                <input type="text" name="name" id="name" value="Jessica Smith" autoComplete="off" />
                                <Link href="#">
                                    <Image src={editIcon} alt="edit-icon" width={20} height={20} className="custom-icon-edit"/>
                                </Link>
                            </div>
                            <div className="personal-name border-green-1 mt-4">
                                <label htmlFor="name">Gender</label>
                                <input type="text" name="name" id="name" value="Jessica Smith" autoComplete="off" />
                                <Link href="#">
                                    <Image src={editIcon} alt="edit-icon" width={20} height={20} className="custom-icon-edit"/>
                                </Link>
                            </div>
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

export default page;
