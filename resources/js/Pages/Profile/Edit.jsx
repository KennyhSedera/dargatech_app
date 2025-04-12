import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { TbPointFilled, TbUser, TbMail, TbBriefcase, TbPhone, TbMapPin, TbStar, TbCalendar, TbEdit, TbLock, TbTrash, TbX } from 'react-icons/tb';
import { getInitials } from '@/hooks/letterInWord';
import { useState, useEffect } from 'react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const profile = user.profile || {};
    const technicien = user.technicien || {};
    const userRole = user.user_role || {};
    const partenaire = user.partenaire || {};   
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const parallaxStyle = {
        transform: `translateY(${scrollY * 0.5}px)`,
    };
    
    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
                <div className="relative">
                    {/* Bannière avec effet parallaxe */}
                    <div className="h-96 overflow-hidden relative">
                        <div 
                            className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-700"
                            style={parallaxStyle}
                        >
                            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-30"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900"></div>
                        </div>
                    </div>

                    {/* Photo de profil et informations principales */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="relative group">
                            <div className="w-40 h-40 mx-auto relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 dark:from-indigo-500 dark:to-purple-500 animate-spin-slow"></div>
                                <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full">
                                    <div className="w-full h-full bg-gray-200/30 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 transition-transform duration-300 group-hover:scale-105">
                                        {profile.photo || technicien.photo || partenaire.logo ? (
                                            <img src={profile.photo || technicien.photo || partenaire.logo} alt="Photo de profil" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl font-bold">{getInitials(user.name)}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                                    <TbPointFilled className="text-white" />
                                </div>
                            </div>
                            <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">{user.name}</h2>
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <TbMail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                                {user.email_verified_at && (
                                    <span className="animate-pulse inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Vérifié
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <TbBriefcase className="w-4 h-4 mr-2" />
                                    {userRole.name || 'Utilisateur'}
                                </span>
                            </div>
                        </div>
                    </div>
                    </div>

                {/* Navigation des sections */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 mt-72">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center space-x-8">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={'py-4 px-4 inline-flex items-center gap-2 border-b-2 text-sm font-medium transition-all duration-300 ' + 
                                    (activeTab === 'profile'
                                        ? 'border-orange-500 text-orange-600 dark:border-indigo-500 dark:text-indigo-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    )}
                            >
                                <TbUser className="w-5 h-5" />
                                Profil
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={'py-4 px-4 inline-flex items-center gap-2 border-b-2 text-sm font-medium transition-all duration-300 ' + 
                                    (activeTab === 'security'
                                        ? 'border-orange-500 text-orange-600 dark:border-indigo-500 dark:text-indigo-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    )}
                            >
                                <TbLock className="w-5 h-5" />
                                Sécurité
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {activeTab === 'profile' ? (
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Informations personnelles */}
                                    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-xl bg-orange-100 dark:bg-indigo-900 text-orange-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                                <TbUser className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Informations personnelles
                                            </h3>
                                        </div>
                                        <dl className="space-y-4">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbUser className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Genre</span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile.genre || technicien.genre || partenaire.genre || 'Non défini'}</dd>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbPhone className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile.contact || technicien.contact || partenaire.telephone || 'Non défini'}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Informations professionnelles */}
                                    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-xl bg-pink-100 dark:bg-purple-900 text-pink-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                                <TbBriefcase className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Informations professionnelles
                                            </h3>
                                        </div>
                                        <dl className="space-y-4">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbMapPin className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresse</span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile.adress || technicien.adress || partenaire.adresse || 'Non définie'}</dd>
                                            </div>
                                            {user.user_role.name === 'technicien' && <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbStar className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Spécialité</span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile.speciality || technicien.speciality || partenaire.speciality || 'Non définie'}</dd>
                                            </div>}
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <dt className="flex items-center gap-2">
                                                    <TbCalendar className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Membre depuis</span>
                                                </dt>
                                                <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            ) : (
                                /* Formulaire de modification du profil */
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-fade-in">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 dark:from-indigo-900 dark:to-purple-900 text-orange-600 dark:text-indigo-400">
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Sécurité du compte - Mot de passe */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-fit">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 dark:from-indigo-900 dark:to-purple-900 text-orange-600 dark:text-indigo-400">
                                        <TbLock className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Sécurité du compte
                                    </h3>
                                </div>
                                <UpdatePasswordForm />
                            </div>

                            {/* Suppression du compte */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-fit">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                        <TbTrash className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Zone dangereuse
                                    </h3>
                                </div>
                                <DeleteUserForm />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
