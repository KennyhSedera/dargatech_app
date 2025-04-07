import React from 'react'
import { MdLogout } from 'react-icons/md';
import { TbPointFilled, TbUserSquareRounded } from 'react-icons/tb';
import { usePage } from '@inertiajs/react';
import { getInitials } from '@/hooks/letterInWord';
import Dropdown from '../inputs/Dropdown';

const UserDropdown = () => {
    const user = usePage().props.auth.user;

    return (
        <div className="relative">
            <Dropdown>
                <Dropdown.Trigger>
                    <button
                        type="button"
                        className="w-9 h-9 flex items-center rounded-full justify-center bg-gray-200 dark:bg-gray-900 border border-orange-500 dark:border-indigo-500"
                    >
                        {user.profile ? (<img src={JSON.parse(user.profile)} alt="pdp" className='w-full h-full rounded-full object-cover' />)
                            : (<span className='text-base font-bold'>{getInitials(user.name)}</span>)}
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content width='auto' contentClasses=' border border-gray-400/20'>
                    <div className='p-2 flex items-center gap-2 border-b border-b-gray-500/20'>
                        <div className='w-12 h-12 bg-gray-500 ring-1 ring-gray-300 rounded-full flex items-center justify-center'>
                            {user.profile ? (<img src={JSON.parse(user.profile)} alt="pdp" className="w-full h-full rounded-full object-cover antialiased " />)
                                : (<span className='text-2xl text-white font-bold'>{getInitials(user.name)}</span>)}
                        </div>
                        <div>
                            <div className='flex'><span className='line-clamp-1'>{user.name}</span> <TbPointFilled className='text-green-500' /></div>
                            <div className='text-sm font-extralight text-gray-500'>{user.email}</div>
                        </div>
                    </div>
                    <Dropdown.Link
                        href={route('profile.edit')}
                    >
                        <div className='flex items-center gap-2'>
                            <TbUserSquareRounded className='text-base' /> Profile
                        </div>
                    </Dropdown.Link>
                    <Dropdown.Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className='rounded-bl-md rounded-br-md'
                    >
                        <div className='flex items-center gap-2'>
                            <MdLogout /> Se déconnecter
                        </div>
                    </Dropdown.Link>
                </Dropdown.Content>
            </Dropdown>
        </div>
    )
}

export default UserDropdown;
