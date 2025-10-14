import { AnimatedSolarText4 } from "@/Components/AnimatedSolarText";
import NavLinkIcon from "@/Components/nav/NavLinkIcon";
import ResponsiveNavLink from "@/Components/nav/ResponsiveNavLink";
import ThemeDropdown from "@/Components/nav/ThemeDropdown";
import UserDropdown from "@/Components/nav/UserDropdown";
import SettingComponent from "@/Components/SettingComponent";
import sidebarPages, {
    logo,
    sidebarPagestech,
    sidebarPagespart,
    titre,
} from "@/constant";
import { getInitials } from "@/hooks/letterInWord";
import { Link, usePage } from "@inertiajs/react";
import { Settings } from "lucide-react";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { TbPointFilled } from "react-icons/tb";

export default function AuthenticatedLayout({ setId = () => {}, children }) {
    const user = usePage().props.auth.user;
    const profile = user.profile || {};
    const technicien = user.technicien || {};
    const partenaire = user.partenaire || {};
    const [link, setLink] = useState(sidebarPages);
    const [isShowSetting, setisShowSetting] = useState(false);

    const getUserDrawerState = () => {
        try {
            const stored = localStorage.getItem("drawerSettings");
            if (stored) {
                const settings = JSON.parse(stored);
                const userSetting = settings.find((s) => s.user === user.id);
                return userSetting ? userSetting.isExpanded : false;
            }
        } catch (error) {
            console.error("Erreur lors de la lecture du localStorage:", error);
        }
        return false;
    };

    const [isDrawerExpanded, setIsDrawerExpanded] = useState(
        getUserDrawerState()
    );

    useEffect(() => {
        if (user) {
            const role = user.user_role;
            if (role && role.name === "technicien") {
                setId(user.technicien.id);
                setLink(sidebarPagestech);
            }
            if (role && role.name === "partenaire") {
                setLink(sidebarPagespart);
            }
        }
    }, [user]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const settingRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                settingRef.current &&
                !settingRef.current.contains(event.target)
            ) {
                setisShowSetting(false);
            }
        };

        if (isShowSetting) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isShowSetting]);

    return (
        <div className="flex w-full min-h-screen transition-colors duration-500 ease-in-out bg-gray-100 dark:bg-gray-900 dark:text-white">
            {/* Drawer */}
            <div
                className={`sticky top-0 z-40 hidden h-screen py-1 bg-white border-r border-gray-100 sm:flex sm:flex-col dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 ease-in-out ${
                    isDrawerExpanded ? "w-64" : "w-16"
                }`}
            >
                <div
                    className={`flex flex-col items-center justify-between gap-2 px-3 pb-3 ${
                        isDrawerExpanded ? "border-b border-gray-200" : ""
                    }`}
                >
                    <a
                        href={"https://dargatech.com"}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-2 justify-center ${
                            isDrawerExpanded ? "w-full" : "w-full"
                        }`}
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className={`transition-all duration-300 mt-2 ${
                                isDrawerExpanded ? "w-10" : "w-12"
                            }`}
                        />
                        <img
                            src={titre}
                            alt="titre"
                            className={`transition-all duration-300 mt-2 h-8 ${
                                isDrawerExpanded ? "block" : "hidden"
                            }`}
                        />
                    </a>
                    <div
                        className={`mt-2 transition-all duration-300 ease-in-out ${
                            isDrawerExpanded ? "flex flex-col" : "hidden"
                        }`}
                    >
                        <span className="text-sm font-bold text-center">
                            Solution d'Irrigation Solaire Améliorée
                        </span>
                        <span className="text-xs font-light text-center">
                            « Avec le soleil, récolter des revenus »
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div
                    className={`flex flex-col gap-2 mt-6 ${
                        isDrawerExpanded ? "px-3" : "items-center"
                    }`}
                >
                    {link.map((item, i) =>
                        isDrawerExpanded ? (
                            <a
                                key={item.route}
                                href={route(item.route)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    route().current(item.route)
                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                }`}
                            >
                                <item.icon className="flex-shrink-0 text-xl" />
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {item.label}
                                </span>
                            </a>
                        ) : (
                            <NavLinkIcon
                                key={item.route}
                                route={route(item.route)}
                                active={route().current(item.route)}
                                Icon={item.icon}
                                label={item.label}
                            />
                        )
                    )}
                </div>

                {/* User info at bottom when expanded */}
                {isDrawerExpanded && (
                    <Link
                        href={route("profile.edit")}
                        className="px-3 py-4 mt-auto border-t border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gray-500 rounded-full ring-2 ring-gray-300 dark:ring-gray-600">
                                {profile.photo ||
                                technicien.photo ||
                                partenaire.logo ? (
                                    <img
                                        src={
                                            profile.photo ||
                                            technicien.photo ||
                                            partenaire.logo
                                        }
                                        alt="Photo de profil"
                                        className="object-cover w-full h-full rounded-full"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-white">
                                        {getInitials(user.name)}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium truncate">
                                        {user.name}
                                    </span>
                                    <TbPointFilled className="flex-shrink-0 text-green-500" />
                                </div>
                                <div className="text-xs text-gray-500 truncate dark:text-gray-400">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </Link>
                )}
            </div>

            {/* Navbar */}
            <div className="relative flex-1 min-w-0">
                <nav className="sticky top-0 z-40 transition-colors duration-500 ease-in-out bg-white border-b border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                    <div className="px-2 mx-auto max-w-7xl sm:px-4 lg:px-6">
                        <div className="flex justify-between h-14">
                            <div className="flex">
                                <div
                                    className={`${
                                        isDrawerExpanded ? "hidden" : "flex"
                                    } items-center shrink-0`}
                                >
                                    <a
                                        href={"https://dargatech.com"}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img
                                            src={titre}
                                            alt="logo"
                                            className="h-8"
                                        />
                                    </a>
                                </div>
                            </div>

                            <div className="items-center hidden md:flex">
                                <AnimatedSolarText4 />
                            </div>

                            <div className="flex items-center">
                                <div className="block md:hidden">
                                    <ThemeDropdown />
                                </div>
                                <div
                                    onClick={() =>
                                        setisShowSetting(!isShowSetting)
                                    }
                                    className="items-center justify-center hidden rounded-full cursor-pointer md:flex bg-gray-50 dark:bg-gray-800 w-9 h-9"
                                >
                                    <Settings />
                                </div>
                                <div className="hidden gap-2 ml-3 sm:flex sm:items-center">
                                    <UserDropdown />
                                </div>
                                <div className="flex items-center gap-2 -me-2 sm:hidden">
                                    <button
                                        onClick={() =>
                                            setShowingNavigationDropdown(
                                                (previousState) =>
                                                    !previousState
                                            )
                                        }
                                        className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                                    >
                                        {showingNavigationDropdown ? (
                                            <IoClose className="text-xl" />
                                        ) : (
                                            <IoMdMenu className="text-xl" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            (showingNavigationDropdown ? "block" : "hidden") +
                            " sm:hidden"
                        }
                    >
                        <div className="pt-2 pb-3 space-y-1">
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

                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center gap-2 p-2 cursor-pointer"
                            >
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-500 rounded-full ring-1 ring-gray-300">
                                    {profile.photo ||
                                    technicien.photo ||
                                    partenaire.logo ? (
                                        <img
                                            src={
                                                profile.photo ||
                                                technicien.photo ||
                                                partenaire.logo
                                            }
                                            alt="Photo de profil"
                                            className="object-cover w-full h-full rounded-full"
                                        />
                                    ) : (
                                        <span className="text-lg font-bold">
                                            {getInitials(user.name)}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex">
                                        <span className="line-clamp-1">
                                            {user.name}
                                        </span>{" "}
                                        <TbPointFilled className="text-green-500" />
                                    </div>
                                    <div className="text-sm text-gray-500 font-extralight">
                                        {user.email}
                                    </div>
                                </div>
                            </Link>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Se déconnecter
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Settings Panel - Fixed Position */}
                {isShowSetting && (
                    <div
                        ref={settingRef}
                        className="fixed z-50 items-center justify-center hidden max-w-full gap-2 shadow-2xl rounded-2xl md:flex top-14 right-1 min-w-96 min-h-36"
                    >
                        <SettingComponent
                            isDrawerExpanded={isDrawerExpanded}
                            setIsDrawerExpanded={setIsDrawerExpanded}
                        />
                    </div>
                )}

                <main className="p-2 pb-6">{children}</main>
            </div>
        </div>
    );
}
