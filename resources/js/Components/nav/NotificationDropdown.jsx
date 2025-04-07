import React from 'react'
import Dropdown from '../inputs/Dropdown';
import { TbBellFilled } from 'react-icons/tb';
import { usePage } from '@inertiajs/react';
import { formatRelativeDate } from '@/hooks/fomatDate';

const NotificationDropdown = () => {
    const user = usePage().props.auth.user;

    return (
        <div className='relative w-'>
            <Dropdown>
                <Dropdown.Trigger>
                    <button
                        type="button"
                        className="w-9 h-9 inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                    >
                        <TbBellFilled className='text-lg' />
                    </button>
                </Dropdown.Trigger>
                <Dropdown.Content width='auto' contentClasses='w-80 border border-gray-400/20'>
                    <div className='text-center text-2xl font-semibold py-2 border-b border-b-gray-400/20'>Notifications</div>
                    <Dropdown.Link className='bg-blue-400/10'>
                        <div className="flex gap-2">
                            <img src="sary.jpg" alt="pdp" className='w-12 h-12 rounded-full object-cover border border-blue-900 dark:border-white' />
                            <div>
                                <span className='line-clamp-3 text-sm'>
                                    <span className='font-black dark:text-white text-base mr-1 text-wrap'>{user.name}</span>
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus eos id laboriosam repudiandae quam adipisci, temporibus, magni molestias nisi, ab expedita dolor. Perferendis reiciendis et quasi id nisi dolorem animi.</span>
                                <div className='text-xs text-gray-500/80'>{formatRelativeDate(new Date() - 45 * 5 * 60 * 1000)}</div>
                            </div>
                        </div>
                    </Dropdown.Link>
                </Dropdown.Content>
            </Dropdown>
        </div>
    )
}

export default NotificationDropdown;
