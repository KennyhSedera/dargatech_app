import NavLinkIcon from '@/Components/nav/NavLinkIcon';
import NotificationDropdown from '@/Components/nav/NotificationDropdown';
import ResponsiveNavLink from '@/Components/nav/ResponsiveNavLink';
import ThemeDropdown from '@/Components/nav/ThemeDropdown';
import UserDropdown from '@/Components/nav/UserDropdown';
import sidebarPages, { logo, sidebarPagestech, sidebarPagespart, titre } from '@/constant';
import { getInitials } from '@/hooks/letterInWord';
import { usePage } from '@inertiajs/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { TbPointFilled } from 'react-icons/tb';

export default function AuthenticatedLayout({ setId = () => { }, children }) {
    const user = usePage().props.auth.user;
    const profile = user.profile || {};
    const technicien = user.technicien || {};
    const partenaire = user.partenaire || {};
    const [link, setLink] = useState(sidebarPages);

    useEffect(() => {
        if (user) {
            const role = user.user_role;
            if (role && role.name === 'technicien') {
                setId(user.technicien.id);
                setLink(sidebarPagestech);
            }
            if (role && role.name === 'partenaire') {
                setLink(sidebarPagespart);
            }
        }
    }, [user]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 dark:text-white flex">
            <div className='hidden sm:flex sm:flex-col w-16 border-r py-1 items-center h-screen sticky top-0 border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 z-40'>
                <a href={'https://dargatech.com'} target='_blank' rel='noreferrer'><img src={logo} alt="logo" className='w-12' /></a>
                <div className='flex flex-col gap-2 mt-6 justify-center bg-red'>
                    {link.map((item, i) => (
                        <NavLinkIcon
                            key={item.route}
                            route={route(item.route)}
                            active={route().current(item.route)}
                            Icon={item.icon}
                            label={item.label}
                        />
                    ))}
                </div>
            </div>
            <div className='w-full'>
                <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 sticky top-0 z-40">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-14 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <a href={'https://dargatech.com'} target='_blank' rel='noreferrer'><img src={titre} alt="logo" className='h-10' /></a>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <ThemeDropdown />
                                <div className="hidden sm:flex sm:items-center gap-2 ml-3">
                                    <UserDropdown />
                                </div>
                                <div className="-me-2 flex items-center gap-2 sm:hidden">
                                    <button
                                        onClick={() =>
                                            setShowingNavigationDropdown(
                                                (previousState) => !previousState,
                                            )
                                        }
                                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                                    >
                                        {showingNavigationDropdown ? <IoClose className='text-xl' /> : <IoMdMenu className='text-xl' />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            (showingNavigationDropdown ? 'block' : 'hidden') +
                            ' sm:hidden'
                        }
                    >
                        <div className="space-y-1 pb-3 pt-2">
                            {link.map((item, i) => (
                                <ResponsiveNavLink
                                    key={item.route}
                                    href={route(item.route)}
                                    active={route().current(item.route)}
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon /> {item.label}
                                    </div>
                                </ResponsiveNavLink>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                            <div className='p-2 flex items-center gap-2'>
                                <div className='w-8 h-8 bg-gray-500 ring-1 ring-gray-300 rounded-full flex items-center justify-center'>
                                {profile.photo || technicien.photo || partenaire.logo ? (
                                            <img src={profile.photo || technicien.photo || partenaire.logo} alt="Photo de profil" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold">{getInitials(user.name)}</span>
                                        )}
                                </div>
                                <div>
                                    <div className='flex'><span className='line-clamp-1'>{user.name}</span> <TbPointFilled className='text-green-500' /></div>
                                    <div className='text-sm font-extralight text-gray-500'>{user.email}</div>
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    Se déconnecter
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>
                <main className='p-2 pb-6'>{children}</main>
            </div>
        </div>
    );
}
