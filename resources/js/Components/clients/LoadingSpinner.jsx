import React from "react";

const LoadingSpinner = ({ message = "Chargement des données..." }) => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                <p className="text-gray-500 dark:text-gray-400">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
