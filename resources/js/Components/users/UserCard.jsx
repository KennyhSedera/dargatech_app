import React from "react";
import {
    FaTrash,
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
} from "react-icons/fa";

const UserCard = ({ user, handleDelete, handleImageError }) => {
    return (
        <div
            key={user.id}
            className="overflow-hidden transition-all duration-300 transform bg-white shadow-lg dark:bg-gray-800 rounded-xl hover:scale-105 hover:shadow-xl"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-700 opacity-90"></div>
                <div className="relative flex items-start justify-between px-6 pt-4 pb-14">
                    <h3 className="text-xl font-bold text-white truncate">
                        {user.name}
                    </h3>
                    <div className="relative">
                        {!user.id !== 1 && (
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-white transition-colors rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                </div>

                <div className="absolute -bottom-12 left-6">
                    <div className="w-24 h-24 overflow-hidden border-4 border-white shadow-md rounded-xl dark:border-gray-800">
                        {user.profile?.photo ||
                        user.technicien?.photo ||
                        user.partenaire?.logo ? (
                            <img
                                src={
                                    user.profile?.photo ||
                                    user.technicien?.photo ||
                                    user.partenaire?.logo
                                }
                                alt={`${user.name}'s profile`}
                                className="object-cover w-full h-full bg-gray-100 dark:bg-gray-900"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                                <FaUserCircle className="text-4xl text-gray-400 dark:text-gray-300" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6 pt-14">
                <div className="mt-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-green-400 to-blue-500">
                        {user.user_role.name}
                    </span>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm">
                        <FaEnvelope className="mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200">
                            {user.email}
                        </span>
                    </div>
                    <div className="flex items-center text-sm">
                        <FaPhone className="mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200">
                            {user.technicien?.contact ||
                                user.profile?.contact ||
                                user.partenaire?.telephone}
                        </span>
                    </div>
                    <div className="flex items-center text-sm">
                        <FaMapMarkerAlt className="mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200">
                            {user.technicien?.adress ||
                                user.profile?.adress ||
                                user.partenaire?.adresse}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
