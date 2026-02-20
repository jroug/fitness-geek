import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import facebook from "../public/images/about-us/facebook.svg";
import instragram from "../public/images/about-us/instragram.svg";
import twitter from "../public/images/about-us/twitter.svg";
import youtube from "../public/images/about-us/youtube.svg";

const PublicFooter = () => {
    return (     
        <div className="about-us-social-media">
        <div className="about-us-icon-wrapper mt-8 flex">
          
          <div className="social-detail-about flex flex-col items-center">
            <div className="shape facebook-bg bg-blue-600 p-3 rounded-full">
              <Link href="https://www.facebook.com/" target="_blank">
                <Image src={facebook} alt="facebook" className="h-7 w-7" />
              </Link>
            </div>
            <div>
              <p className="text-xs font-medium mt-2 text-center">Facebook</p>
            </div>
          </div>
          <div className="social-detail-about flex flex-col items-center">
            <div className="shape instragram-bg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-3 rounded-full">
              <Link href="https://www.instagram.com/" target="_blank">
                <Image src={instragram} alt="instagram" className="h-7 w-7" />
              </Link>
            </div>
            <div>
              <p className="text-xs font-medium mt-2 text-center">Instagram</p>
            </div>
          </div>
          <div className="social-detail-about flex flex-col items-center">
            <div className="shape twitter-bg bg-blue-400 p-3 rounded-full">
              <Link href="https://twitter.com/" target="_blank">
                <Image src={twitter} alt="twitter" className="h-7 w-7" />
              </Link>
            </div>
            <div>
              <p className="text-xs font-medium mt-2 text-center">X.COM</p>
            </div>
          </div>
          <div className="social-detail-about flex flex-col items-center">
            <div className="shape youtube-bg bg-red-600 p-3 rounded-full">
              <Link href="https://www.youtube.com/" target="_blank">
                <Image src={youtube} alt="youtube" className="h-7 w-7" />
              </Link>
            </div>
            <div>
              <p className="text-xs font-medium mt-2 text-center">YouTube</p>
            </div>
          </div>
        </div>
      </div>
    );
}

export default PublicFooter;
