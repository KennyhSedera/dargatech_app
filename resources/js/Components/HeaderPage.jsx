import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { MdSearch } from 'react-icons/md';
import { usePage } from '@inertiajs/react';
const HeaderPage = ({
    search = '',
    onSearch = () => { },
    handleClick = () => { },
    title = 'title',
    btn = true
}) => {
    return (
        <div className='w-full h-auto bg-white dark:bg-gray-800 rounded-md flex flex-row flex-wrap sm:flex-nowrap items-center justify-between px-4 py-2 gap-2 sm:gap-0 shadow-sm'>
           {btn ? <button
                onClick={handleClick}
                className='bg-blue-500 px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center gap-2 font-semibold text-white hover:bg-blue-600 transition'
            >
                Nouveau <FaPlusCircle />
            </button> : <div></div>}

            <span className='text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white text-center'>
                {title}
            </span>

            <div className='flex items-center bg-gray-100 dark:bg-gray-900 px-2 py-1 h-10 rounded-md w-full sm:w-auto'>
                <input
                    type='search'
                    name='search'
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder='Rechercher ...'
                    className='h-8 w-full sm:w-auto rounded-md border-none bg-transparent focus:ring-transparent focus:outline-none text-gray-800 dark:text-white px-2 placeholder-gray-500 dark:placeholder-gray-400'
                />
                <MdSearch className='text-xl text-gray-500 dark:text-gray-300' />
            </div>
        </div>
    );
};

export default HeaderPage;
