import Link from "next/link";

interface SettingsBarProps {
    settingsVisible: boolean;
    handleSettingsClick: () => void;
    isPublished: boolean;
    handlePublishingCalendar: () => void;
    calendarPageUrl: string;
    magicLoginForContributorUrl: string;
    handleCopyLink: (url: string) => void;
}

const SettingsBar = ({ settingsVisible, handleSettingsClick, isPublished, handlePublishingCalendar, calendarPageUrl, magicLoginForContributorUrl, handleCopyLink }: SettingsBarProps) => {
    return (
        <div id="settings" className={`settings-link-wrapper ${settingsVisible ? '' : 'hidden'}`} >
            <div className="calendar-link-container pb-10 pt-4 px-6" >
                <div className="relative z-[100]">
                    <button type="button" className="btn-settings-close text-reset" onClick={handleSettingsClick} />
                </div>
                <h1 className="settings_title w-full pb-4 sm-font-zen fw-400 ">Calendar Settings</h1>
                <h2 className="my-4 text-center">Status: <b>{isPublished ? 'Published' : 'Not Published'}</b></h2>
                <button type="button" className="green-btn my-4 w-full" onClick={handlePublishingCalendar}>
                            {isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <div className="custom_margin order-3 lg:order-none mt-4 lg:mt-0" >
                    {isPublished && (
                        <div>
                            <p>
                                <span>Public URL: </span>
                                <Link href={calendarPageUrl} target="_blank" className="underline">
                                    click here!
                                </Link>
                            </p>
                            <br/>
                            <p>
                                <span>Contributor URL: </span> <br className="show_on_mobile_only"/>
                                <Link href={magicLoginForContributorUrl} target="_blank" className="underline" >
                                    click here!
                                </Link>
                                &nbsp; - OR - &nbsp;
                                <button type="button" onClick={() => handleCopyLink(magicLoginForContributorUrl)} className="underline" >
                                    Copy to Clipboard
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            
            </div>
        </div>
    );
};

export default SettingsBar;