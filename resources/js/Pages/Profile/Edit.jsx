import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import {
    TbPointFilled,
    TbUser,
    TbMail,
    TbBriefcase,
    TbPhone,
    TbMapPin,
    TbStar,
    TbCalendar,
    TbEdit,
    TbLock,
    TbTrash,
    TbX,
    TbWorld,
    TbBuildingStore,
    TbFlag,
    TbBrandTelegram,
} from "react-icons/tb";
import { getInitials } from "@/hooks/letterInWord";
import { useState } from "react";
import { toast } from "react-toastify";
export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const profile = user.profile || {};
    const technicien = user.technicien || {};
    const userRole = user.user_role || {};
    const partenaire = user.partenaire || {};
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const { post } = useForm();

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"), {
            onSuccess: () => {
                toast.success("Email de vérification envoyé");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="min-h-screen transition-all duration-500 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="relative">
                    {/* Bannière avec effet parallaxe */}
                    <div className="relative overflow-hidden h-96">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-700">
                            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-30"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900"></div>
                        </div>
                    </div>

                    {/* Photo de profil et informations principales */}
                    <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 left-1/2">
                        <div className="relative group">
                            <div className="relative mx-auto w-60 h-60">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 dark:from-indigo-500 dark:to-purple-500 animate-spin-slow"></div>
                                <div className="absolute bg-white rounded-full inset-1 dark:bg-gray-800">
                                    <div className="flex items-center justify-center w-full h-full overflow-hidden transition-transform duration-300 border-4 border-white rounded-full bg-gray-200/30 dark:border-gray-800 group-hover:scale-105">
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
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <span className="text-5xl font-bold">
                                                {getInitials(user.name)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute flex items-center justify-center w-8 h-8 transition-transform duration-300 transform bg-green-500 border-4 border-white rounded-full bottom-4 right-4 dark:border-gray-800 hover:scale-110">
                                    <TbPointFilled className="text-white" />
                                </div>
                            </div>
                            <h2 className="mt-6 text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text">
                                {user.name}
                            </h2>
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <TbMail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">
                                    {user.email}
                                </span>
                                {user.email_verified_at && (
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full animate-pulse dark:bg-green-900 dark:text-green-200">
                                        Vérifié
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-800 transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-orange-100 to-pink-100 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-200 hover:shadow-xl hover:-translate-y-1">
                                    <TbBriefcase className="w-4 h-4 mr-2" />
                                    {userRole.name || "Utilisateur"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation des sections */}
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg dark:border-gray-700 mt-72">
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex justify-center space-x-8">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={
                                    "py-4 px-4 inline-flex items-center gap-2 border-b-2 text-sm font-medium transition-all duration-300 " +
                                    (activeTab === "profile"
                                        ? "border-orange-500 text-orange-600 dark:border-indigo-500 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300")
                                }
                            >
                                <TbUser className="w-5 h-5" />
                                Profil
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={
                                    "py-4 px-4 inline-flex items-center gap-2 border-b-2 text-sm font-medium transition-all duration-300 " +
                                    (activeTab === "security"
                                        ? "border-orange-500 text-orange-600 dark:border-indigo-500 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300")
                                }
                            >
                                <TbLock className="w-5 h-5" />
                                Sécurité
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {activeTab === "profile" ? (
                        <div className="space-y-8">
                            {/* Bouton Modifier le profil */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-indigo-500 dark:to-purple-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {isEditing ? (
                                        <>
                                            <TbX className="w-5 h-5" />
                                            Fermer
                                        </>
                                    ) : (
                                        <>
                                            <TbEdit className="w-5 h-5" />
                                            Modifier le profil
                                        </>
                                    )}
                                </button>
                            </div>

                            {!isEditing ? (
                                /* Cartes d'information */
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {/* Informations personnelles */}
                                    <div className="p-8 transition-all duration-300 bg-white shadow-lg group dark:bg-gray-800 rounded-2xl hover:shadow-xl hover:-translate-y-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 text-orange-600 transition-transform duration-300 bg-orange-100 rounded-xl dark:bg-indigo-900 dark:text-indigo-400 group-hover:scale-110">
                                                <TbUser className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Informations personnelles
                                            </h3>
                                        </div>
                                        <dl className="space-y-4">
                                            <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbUser className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Genre
                                                    </span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {profile.genre ||
                                                        technicien.genre ||
                                                        partenaire.genre ||
                                                        "Non défini"}
                                                </dd>
                                            </div>
                                            <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbPhone className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Contact
                                                    </span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {profile.contact ||
                                                        technicien.contact ||
                                                        partenaire.telephone ||
                                                        "Non défini"}
                                                </dd>
                                            </div>
                                            {user.user_role.name !==
                                                "partenaire" && (
                                                <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <dt className="flex items-center gap-2">
                                                        <TbBrandTelegram className="w-5 h-5 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            Pseudo telegram
                                                        </span>
                                                    </dt>
                                                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {technicien.telegram_username ||
                                                            profile.telegram_username ||
                                                            "Non définie"}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>

                                    {/* Informations professionnelles */}
                                    <div className="p-8 transition-all duration-300 bg-white shadow-lg group dark:bg-gray-800 rounded-2xl hover:shadow-xl hover:-translate-y-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 text-pink-600 transition-transform duration-300 bg-pink-100 rounded-xl dark:bg-purple-900 dark:text-purple-400 group-hover:scale-110">
                                                <TbBriefcase className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Informations professionnelles
                                            </h3>
                                        </div>
                                        <dl className="space-y-4">
                                            {/* Pour tous les utilisateurs */}
                                            <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbMapPin className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Adresse
                                                    </span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {profile.adress ||
                                                        technicien.adress ||
                                                        partenaire.adresse ||
                                                        "Non définie"}
                                                </dd>
                                            </div>

                                            {/* Champs spécifiques pour les techniciens */}
                                            {user.user_role.name ===
                                                "technicien" && (
                                                <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <dt className="flex items-center gap-2">
                                                        <TbStar className="w-5 h-5 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            Spécialité
                                                        </span>
                                                    </dt>
                                                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {technicien.speciality ||
                                                            "Non définie"}
                                                    </dd>
                                                </div>
                                            )}

                                            {/* Champs spécifiques pour les partenaires */}
                                            {user.user_role.name ===
                                                "partenaire" && (
                                                <>
                                                    <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <dt className="flex items-center gap-2">
                                                            <TbFlag className="w-5 h-5 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Ville/Pays
                                                            </span>
                                                        </dt>
                                                        <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {partenaire.ville &&
                                                            partenaire.pays
                                                                ? `${partenaire.ville}, ${partenaire.pays}`
                                                                : partenaire.ville ||
                                                                  partenaire.pays ||
                                                                  "Non définis"}
                                                        </dd>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <dt className="flex items-center gap-2">
                                                            <TbWorld className="w-5 h-5 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Site web
                                                            </span>
                                                        </dt>
                                                        <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {partenaire.site_web ? (
                                                                <a
                                                                    href={
                                                                        partenaire.site_web
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-orange-500 dark:text-indigo-400 hover:underline"
                                                                >
                                                                    {
                                                                        partenaire.site_web
                                                                    }
                                                                </a>
                                                            ) : (
                                                                "Non défini"
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <dt className="flex items-center gap-2">
                                                            <TbBuildingStore className="w-5 h-5 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Catégorie
                                                            </span>
                                                        </dt>
                                                        <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {partenaire.categorie ||
                                                                "Non définie"}
                                                        </dd>
                                                    </div>
                                                    {partenaire.highlighted && (
                                                        <div className="p-3 mt-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                                                            <span className="flex items-center gap-2 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                                                <TbStar className="w-5 h-5" />
                                                                Partenaire mis
                                                                en avant
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbCalendar className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Membre depuis
                                                    </span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString(
                                                        "fr-FR",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Description du partenaire (si c'est un partenaire et qu'il a une description) */}
                                    {user.user_role.name === "partenaire" &&
                                        partenaire.description && (
                                            <div className="col-span-1 p-8 transition-all duration-300 bg-white shadow-lg md:col-span-2 group dark:bg-gray-800 rounded-2xl hover:shadow-xl hover:-translate-y-1">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="p-3 text-orange-600 transition-transform duration-300 bg-orange-100 rounded-xl dark:bg-indigo-900 dark:text-indigo-400 group-hover:scale-110">
                                                        <TbEdit className="w-6 h-6" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                        Description
                                                    </h3>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                                    <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">
                                                        {partenaire.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            ) : (
                                /* Formulaire de modification du profil */
                                <div className="p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl animate-fade-in">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 text-orange-600 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-400">
                                            <TbEdit className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Modifier le profil
                                        </h3>
                                    </div>

                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="w-full"
                                        onSuccess={() => setIsEditing(false)}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Sécurité du compte - Mot de passe */}
                            <div className="p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl h-fit">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 text-orange-600 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-400">
                                        <TbLock className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Sécurité du compte
                                    </h3>
                                </div>
                                <UpdatePasswordForm />
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Verification email */}
                                {!user.email_verified_at && (
                                    <div className="flex flex-col p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl h-fit">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 text-red-600 bg-red-100 rounded-xl dark:bg-red-900/30 dark:text-red-400">
                                                <TbMail className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Verification email
                                            </h3>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Vous pouvez vérifier votre email en
                                            cliquant sur le bouton ci-dessous
                                        </span>
                                        <div className="flex justify-start mt-4">
                                            <button
                                                onClick={submit}
                                                className="bg-gradient-to-r from-orange-500 to-pink-500 dark:from-indigo-500 dark:to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                                            >
                                                Vérifier mon email
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Suppression du compte */}
                                <div className="p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl h-fit">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 text-red-600 bg-red-100 rounded-xl dark:bg-red-900/30 dark:text-red-400">
                                            <TbTrash className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Zone dangereuse
                                        </h3>
                                    </div>
                                    <DeleteUserForm />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
