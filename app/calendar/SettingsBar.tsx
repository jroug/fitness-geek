import Link from 'next/link';

interface SettingsBarProps {
    settingsVisible: boolean;
    handleSettingsClick: () => void;
    isPublished: boolean;
    handlePublishingCalendar: () => void;
    calendarPageUrl: string;
    magicLoginForContributorUrl: string;
    handleCopyLink: (url: string) => void;
}

const SettingsBar = ({
    settingsVisible,
    handleSettingsClick,
    isPublished,
    handlePublishingCalendar,
    calendarPageUrl,
    magicLoginForContributorUrl,
    handleCopyLink,
}: SettingsBarProps) => {
    return (
        <div className={`settings-link-wrapper ${settingsVisible ? '' : 'hidden'}`}>
            <div className="calendar-link-container w-[92%] max-w-[640px] rounded-2xl bg-white px-5 pb-6 pt-5 shadow-xl ring-1 ring-slate-200">
                <div className="mb-3 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-slate-900">Calendar Settings</h1>
                    <button
                        type="button"
                        onClick={handleSettingsClick}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                        aria-label="Close settings"
                    >
                        ×
                    </button>
                </div>

                <p className="text-sm text-slate-700">
                    Status:{' '}
                    <span className={`font-semibold ${isPublished ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isPublished ? 'Published' : 'Not Published'}
                    </span>
                </p>

                <button
                    type="button"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                    onClick={handlePublishingCalendar}
                >
                    {isPublished ? 'Unpublish' : 'Publish'}
                </button>

                {isPublished ? (
                    <div className="mt-5 space-y-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">Public URL:</span>{' '}
                            <Link href={calendarPageUrl} target="_blank" className="text-cyan-700 underline">
                                Open calendar
                            </Link>
                        </p>

                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">Contributor URL:</span>{' '}
                            <Link href={magicLoginForContributorUrl} target="_blank" className="text-cyan-700 underline">
                                Open link
                            </Link>
                            {' · '}
                            <button
                                type="button"
                                onClick={() => handleCopyLink(magicLoginForContributorUrl)}
                                className="text-cyan-700 underline"
                            >
                                Copy to Clipboard
                            </button>
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default SettingsBar;
