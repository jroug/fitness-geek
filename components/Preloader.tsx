import React from 'react';
import Image from "next/image";
import preloader from "../public/images/favicon/preloader.gif";

const Preloader = () => {
    return (
		   
        <div className="flex justify-center items-center h-screen">
            <Image 
              src={preloader}
              alt="preloader" 
              className=""
              width={64}
              height={64}
            />
          </div>
       
    );
};

export default Preloader;