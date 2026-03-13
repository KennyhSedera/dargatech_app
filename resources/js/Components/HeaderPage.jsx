import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { usePage } from "@inertiajs/react";
const HeaderPage = ({
    search = "",
    onSearch = () => {},
    handleClick = () => {},
    title = "title",
    btn = true,
}) => {
    const user = usePage().props.auth.user;
    const btnstatus = user.user_role?.name === "partenaire" ? false : btn;
    return (
        <div className="flex flex-row flex-wrap items-center justify-between w-full h-auto gap-2 px-4 py-2 bg-white rounded-md shadow-sm dark:bg-gray-800 sm:flex-nowrap sm:gap-0">
            {btnstatus ? (
                <button
                    onClick={handleClick}
                    className="flex items-center gap-2 px-2 py-1 font-semibold text-white transition bg-blue-500 rounded-md sm:px-4 sm:py-2 hover:bg-blue-600"
                >
                    Nouveau <FaPlusCircle />
                </button>
            ) : (
                <div></div>
            )}

            <span className="text-xl font-semibold text-center text-gray-800 sm:text-2xl dark:text-white">
                {title}
            </span>

            <div className="flex items-center w-full h-10 px-2 py-1 bg-gray-100 rounded-md dark:bg-gray-900 sm:w-auto">
                <input
                    type="search"
                    name="search"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Rechercher ..."
                    className="w-full h-8 px-2 text-gray-800 placeholder-gray-500 bg-transparent border-none rounded-md sm:w-auto focus:ring-transparent focus:outline-none dark:text-white dark:placeholder-gray-400"
                />
                <MdSearch className="text-xl text-gray-500 dark:text-gray-300" />
            </div>
        </div>
    );
};

export default HeaderPage;
