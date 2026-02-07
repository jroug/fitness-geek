import Link from "next/link";

const TopBar = ( { clickHandler, isPublished }: { clickHandler: () => void; isPublished: boolean } ) => {
    return (
        <div className="calendar-link-wrapper" >
            <div className="grid grid-cols-2 p-5 w-full" >
                <div className="text-left" >
                    <span>
                        Status: <b>{isPublished ? 'Published' : 'Not Published'}</b>
                    </span>
                </div>
                <div className="text-right" >
                    <Link href="#" onClick={clickHandler} className="underline color-blue  border-blue rounded px-2 py-1" >
                        <b>Settings</b>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopBar;