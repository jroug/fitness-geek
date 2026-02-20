import React from 'react';
import Link from 'next/link';

const PublicHeader = () => {
    return (     
        <header id="top-header-public" className="bg-white  py-4">
        <div className="justify-between header-wrap space-between">
          <div className="flex header-name justify-start">
            <Link href="/" >
                <h1 className="font-['Zen_Dots'] text-lg font-normal">Fitness Geek</h1>
            </Link>
          </div>
          <div className="flex justify-end" >
          {/* <Link href="/users/enter" className="" >Enter</Link> */}
          {/* &nbsp;&nbsp;/&nbsp;&nbsp; */}
          <Link href="/users/join" className="" >Join</Link>
          </div>
        </div>
      </header>
    );
}

export default PublicHeader;
