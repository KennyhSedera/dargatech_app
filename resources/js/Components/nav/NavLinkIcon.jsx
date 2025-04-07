import { Link } from '@inertiajs/react';
import React from 'react'

const NavLinkIcon = ({
    Icon,
    route,
    label,
    active = false,
    className = '',
}) => {
    return (
        <Link
            href={route}
            className={'group inline-flex items-center rounded-md px-1 py-1 text-sm font-medium transition duration-150 ease-in-out focus:outline-none' +
                (active
                    ? 'bg-blue-400 text-orange-600 focus:bg-orange-700 dark:bg-indigo-600 dark:text-gray-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-300 hover:text-gray-700 focus:bg-gray-300 focus:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700 dark:focus:text-gray-300') +
                className
            }
        >
            <div className="absolute w-52 font-semibold left-full hidden group-hover:flex">
                <span className="bg-gray-300 dark:bg-gray-700 h-8 px-2 rounded flex items-center">
                    {label}
                </span>
            </div>
            <Icon className="text-3xl" />
        </Link>
    )
}

export default NavLinkIcon;
