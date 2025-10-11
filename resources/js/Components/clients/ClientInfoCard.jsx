import React from "react";

const ClientInfoCard = ({ icon: Icon, label, value, bgColor, iconColor }) => {
    return (
        <div className="flex items-center space-x-3">
            <div
                className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg ${bgColor}`}
            >
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {label}
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                    {value || "Non renseigné"}
                </p>
            </div>
        </div>
    );
};

export default ClientInfoCard;
