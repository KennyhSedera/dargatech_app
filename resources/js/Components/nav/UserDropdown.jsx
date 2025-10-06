import React from "react";
import { MdLogout } from "react-icons/md";
import { TbPointFilled, TbUserSquareRounded } from "react-icons/tb";
import { router, usePage } from "@inertiajs/react";
import { getInitials } from "@/hooks/letterInWord";
import Dropdown from "../inputs/Dropdown";
import ConfirmDialog from "../ConfirmDialog";
import { useState } from "react";

const UserDropdown = () => {
    const user = usePage().props.auth.user;
    const profile = user.profile || {};
    const technicien = user.technicien || {};
    const partenaire = user.partenaire || {};

    const [open, setOpen] = useState(false);
    const handleLogout = async () => {
        try {
            await router.post(route("logout"));
        } catch (error) {
            console.error("Erreur de déconnexion :", error);
        }
    };
    return (
        <div className="relative">
            <Dropdown>
                <Dropdown.Trigger>
                    <button
                        type="button"
                        className="flex items-center justify-center bg-gray-200 border border-orange-500 rounded-full w-9 h-9 dark:bg-gray-900 dark:border-indigo-500"
                    >
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
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content
                    width="xl"
                    contentClasses=" border border-gray-400/20"
                >
                    <div className="flex items-center gap-2 p-2 border-b border-b-gray-500/20">
                        <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-full ring-1 ring-gray-300">
                            {profile?.photo ||
                            technicien?.photo ||
                            partenaire?.logo ? (
                                <img
                                    src={
                                        profile?.photo ||
                                        technicien?.photo ||
                                        partenaire?.logo
                                    }
                                    alt="Photo de profil"
                                    className="object-cover w-12 h-12 rounded-full"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.parentElement.innerHTML = `<span class='text-2xl text-white font-bold'>${getInitials(
                                            user.name
                                        )}</span>`;
                                    }}
                                />
                            ) : (
                                <span className="text-2xl font-bold text-white">
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
                    </div>
                    <Dropdown.Link href={route("profile.edit")}>
                        <div className="flex items-center gap-2">
                            <TbUserSquareRounded className="text-base" />{" "}
                            Profile
                        </div>
                    </Dropdown.Link>
                    <Dropdown.Item
                        onClick={() => setOpen(true)}
                        as="button"
                        className="rounded-bl-md rounded-br-md"
                    >
                        <div className="flex items-center w-full gap-2 cursor-pointer">
                            <MdLogout /> Se déconnecter
                        </div>
                    </Dropdown.Item>
                </Dropdown.Content>
            </Dropdown>
            <ConfirmDialog
                open={open}
                title="D&eacute;connexion"
                message="Voulez-vous vraiment vous d&eacute;connecter ?"
                close={() => setOpen(false)}
                accept={handleLogout}
                btnAcceptColor="bg-blue-500 text-white"
                btnAcceptName="Se d&eacute;connecter"
                btnCloseName="Annuler"
            />
        </div>
    );
};

export default UserDropdown;
