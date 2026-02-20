import React from 'react';

const Loader = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600"
                aria-label="Loading"
            />
        </div>
    );
};

export default Loader;
