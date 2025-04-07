import React, { useEffect } from 'react';

const Snackbar = ({ message, type = 'info', duration = 3000, position = 'top-right', show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    const getPositionStyle = () => {
        switch (position) {
            case 'top-right':
                return 'top-4 right-4';
            case 'top-left':
                return 'top-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            default:
                return 'top-4 right-4';
        }
    };

    const getTypeStyle = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-black';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    if (!show) return null;

    return (
        <div
            className={`fixed ${getPositionStyle()} ${getTypeStyle()} px-6 py-3 rounded-md shadow-lg transition-opacity duration-300 z-50`}
        >
            {message}
        </div>
    );
};

export default Snackbar;
