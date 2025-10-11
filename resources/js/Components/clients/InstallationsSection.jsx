import React from "react";
import { FaSolarPanel } from "react-icons/fa";
import moment from "moment";

const InstallationsSection = ({ installations }) => {
    if (!installations || installations.length === 0) {
        return null;
    }

    return (
        <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10">
                        <FaSolarPanel className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Installations
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {installations.length} installation(s)
                            enregistrée(s)
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {installations.map((installation, index) => (
                        <div
                            key={installation.id || index}
                            className="p-4 transition-shadow border border-gray-200 rounded-lg dark:border-gray-700 hover:shadow-md"
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Type
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {installation.type || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Puissance
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {installation.puissance || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Date d'installation
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {installation.date_installation
                                            ? moment(
                                                  installation.date_installation
                                              ).format("DD MMM YYYY")
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstallationsSection;
