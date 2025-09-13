import { FaEnvelope, FaUserAlt, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa6";

const TechnicienCard = ({ technician, onDelete, onView }) => {
    const colors = [
        "#6B7280",
        "#4B5563",
        "#374151",
        "#1F2937",
        "#111827",
        "#6B7280",
    ];
    const bgColor = colors[technician.id % colors.length];

    const firstLetter = technician.name.charAt(0).toUpperCase();

    return (
        <div className="overflow-hidden transition-all duration-300 transform bg-white border border-gray-200 shadow-md dark:bg-gray-800 rounded-xl hover:shadow-lg hover:-translate-y-1 dark:border-gray-700">
            <div className="">
                <div className="flex items-center px-6 py-5 mb-4 bg-gradient-to-br dark:from-blue-500 dark:to-purple-500 from-red-500 to-orange-500">
                    <div className="flex items-center justify-center mr-4 overflow-hidden bg-gray-100 border-2 border-gray-200 rounded-lg w-14 h-14 dark:border-gray-700 dark:bg-gray-700">
                        {technician.photo ? (
                            <img
                                src={technician.photo}
                                alt={technician.name}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentNode.style.backgroundColor =
                                        bgColor;
                                    e.target.parentNode.innerHTML = firstLetter;
                                }}
                            />
                        ) : (
                            <FaUserAlt className="text-2xl text-gray-500" />
                        )}
                    </div>
                    <div className="flex-grow">
                        <h3 className="mb-1 text-xl font-bold text-gray-100">
                            {technician.name}
                        </h3>
                        <p className="font-medium text-gray-200">
                            {technician.speciality}
                        </p>
                    </div>
                </div>

                <div className="px-6 pt-2 pb-5 space-y-3">
                    <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                        <FaEnvelope className="mr-3 text-gray-500 dark:text-gray-400" />
                        <span
                            className="text-sm font-medium text-gray-700 truncate dark:text-gray-300"
                            title={technician.email}
                        >
                            {technician.email}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                            <FaUserAlt className="mr-3 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {technician.genre}
                            </span>
                        </div>

                        <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                            {/* <FaPhone className="mr-2 text-lg text-gray-500 dark:text-gray-400" /> */}
                            <span className="text-sm text-gray-700 truncate dark:text-gray-300">
                                {technician.contact}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                        <FaMapMarkerAlt className="mr-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {technician.adress}
                        </span>
                    </div>

                    {technician.telegram_username && (
                        <div className="relative flex items-center px-3 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                            <FaTelegram className="mr-3 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {technician.telegram_username}
                            </span>
                            <span className="absolute right-2">
                                {technician.bot_active ? "✅" : "🚫"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicienCard;
