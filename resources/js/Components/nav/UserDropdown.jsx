import React from 'react'
import { MdLogout } from 'react-icons/md';
import { TbPointFilled, TbUserSquareRounded } from 'react-icons/tb';
import { usePage } from '@inertiajs/react';
import { getInitials } from '@/hooks/letterInWord';
import Dropdown from '../inputs/Dropdown';

const UserDropdown = () => {
    const user = usePage().props.auth.user;
    const profile = user.profile || {};
    const technicien = user.technicien || {}
    const partenaire = user.partenaire || {};

    return (
        <div className="relative">
            <Dropdown>
                <Dropdown.Trigger>
                    <button
                        type="button"
                        className="w-9 h-9 flex items-center rounded-full justify-center bg-gray-200 dark:bg-gray-900 border border-orange-500 dark:border-indigo-500"
                    >
                        {profile.photo || technicien.photo || partenaire.logo ? (
                                            <img src={profile.photo || technicien.photo || partenaire.logo} alt="Photo de profil" className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span className="text-lg font-bold">{getInitials(user.name)}</span>
                                        )}
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content width='xl' contentClasses=' border border-gray-400/20'>
                    <div className='p-2 flex items-center gap-2 border-b border-b-gray-500/20'>
                        <div className='w-12 h-12 bg-gray-500 ring-1 ring-gray-300 rounded-full flex items-center justify-center overflow-hidden'>
                            {(profile?.photo || technicien?.photo || partenaire?.logo) ? (
                                <img 
                                    src={profile?.photo || technicien?.photo || partenaire?.logo} 
                                    alt="Photo de profil" 
                                    className="w-12 h-12 object-cover rounded-full"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `<span class='text-2xl text-white font-bold'>${getInitials(user.name)}</span>`;
                                    }}
                                />
                            ) : (
                                <span className='text-2xl text-white font-bold'>{getInitials(user.name)}</span>
                            )}
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
