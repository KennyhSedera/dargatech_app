import NavLinkIcon from '@/Components/nav/NavLinkIcon';
import NotificationDropdown from '@/Components/nav/NotificationDropdown';
import ResponsiveNavLink from '@/Components/nav/ResponsiveNavLink';
import ThemeDropdown from '@/Components/nav/ThemeDropdown';
import UserDropdown from '@/Components/nav/UserDropdown';
import sidebarPages, { logo, titre } from '@/constant';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 dark:text-white flex">
            <div className='hidden sm:flex sm:flex-col w-16 border-r py-1 items-center h-screen sticky top-0 border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 z-40'>
                <img src={logo} alt="logo" className='w-12' />
                <div className='flex flex-col gap-2 mt-6 justify-center bg-red'>
                    {sidebarPages.map((item, i) => (
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
                                    <img src={titre} alt="logo" className='h-10' />
                                </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center gap-2">
                                <Link
                                    href='telegram'
                                    type="button"
                                    className="w-9 h-9 flex items-center rounded-full justify-center bg-gray-200 dark:bg-gray-900"
                                >
                                    <FaTelegramPlane />
                                </Link>
                                <NotificationDropdown />
                                <ThemeDropdown />
                                <UserDropdown />
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
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
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>

                        <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user.email}
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
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>
                <main className='p-2'>{children}</main>
            </div>
        </div>
    );
}
