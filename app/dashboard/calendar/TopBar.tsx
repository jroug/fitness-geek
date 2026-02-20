const TopBar = ({ clickHandler, isPublished }: { clickHandler: () => void; isPublished: boolean }) => {
    return (
        <section className="calendar-link-wrapper mx-auto mt-4 w-full max-w-7xl px-4 md:px-8">
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
                <div className="text-sm font-semibold text-slate-700">
                    Status:{' '}
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${
                            isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                    >
                        {isPublished ? 'Published' : 'Not Published'}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={clickHandler}
                    className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                    Calendar Settings
                </button>
            </div>
        </section>
    );
};

export default TopBar;
