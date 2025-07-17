import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { getClient } from '@/Services/clientService';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { HiMiniDevicePhoneMobile, HiOutlineMapPin, HiUser, HiIdentification } from 'react-icons/hi2';
import { LuTrees } from "react-icons/lu";
import { FaRulerCombined, FaSolarPanel, FaMoneyBillWave, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import { IoMaleFemale } from "react-icons/io5";
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const ClientDetailPage = ({ client }) => {
    const [paiement, setpaiement] = useState([]);
    const [installation, setinstallation] = useState([]);
    const [clients, setclients] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const getDataDB = async (id) => {
        try {
            setIsLoading(true);
            const data = await getClient(id);
            if (data) {
                setinstallation(data.client?.installations || []);
                console.log(data.client?.installations || []);

                setpaiement(data.client?.paiement || []);
                setclients(data.client);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        } finally {
            setLoading(false);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (client?.id) {
            getDataDB(client.id);
        }
    }, [client]);

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                        <p className="text-gray-500 dark:text-gray-400">Chargement des données...</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!client) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400">Aucune donnée client disponible</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`${client.nom} ${client.prenom}`} />
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Informations Client */}
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10">
                                        <HiUser className="w-8 h-8 text-teal-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {client.nom} {client.prenom}
                                        </h2>
                                        <div className="flex items-center mt-1 space-x-2">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Client ID: #{client.id}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Inscrit le {moment(client.created_at).format('DD MMM YYYY')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                            <HiMiniDevicePhoneMobile className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">{client.telephone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                                            <FaEnvelope className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">{client.email || 'Non renseigné'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                            <HiIdentification className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">CIN</p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">{client.CIN}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20">
                                            <HiOutlineMapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Localisation</p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                                {clients?.localisation || 'Non renseigné'}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {clients?.localisation?.pays}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                            <IoMaleFemale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Genre</p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">{client.genre}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                            <FaCalendarAlt className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Date du contrat</p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                                {moment(client.date_contrat).format('DD MMM YYYY')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20">
                                            <FaRulerCombined className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Surface cultivée</p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">{client.surface_cultivee} ha</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                                            <LuTrees className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Type d'activité agricole</p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">{client.type_activite_agricole}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Installations */}
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                        <FaSolarPanel className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Installations
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                {installation && installation.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {installation.map((inst, index) => (
                                            <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Code installation</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{inst.code_installation}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${inst.statuts?.toLowerCase() === 'en panne'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            }`}>
                                                            {inst.statuts}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date d'installation</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {moment(inst.date_installation).format('DD MMM YYYY')}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Pays</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{inst.localisation.pays}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Ville</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{inst.localisation.ville}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Débit nominal</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{inst.debit_nominal} m³/h</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Puissance pompe</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{inst.puissance_pompe} kW</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Surface panneaux</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{inst.surface_panneaux} m²</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Profondeur forage</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{inst.profondeur_forage} m</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">Aucune installation enregistrée</p>
                                )}
                            </div>
                        </div>

                        {/* Paiements */}
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20">
                                        <FaMoneyBillWave className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Historique des paiements
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                {paiement && paiement.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {paiement.map((paie, index) => (
                                            <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Montant</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {parseInt(paie.montant).toLocaleString('fr-FR')} FCFA
                                                            </p>
                                                        </div>
                                                        <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                                            {paie.statut_paiement}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date de paiement</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {moment(paie.date_paiement).format('DD MMM YYYY')}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Mode de paiement</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{paie.mode_paiement}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Période couverte</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{paie.periode_couverte}</p>
                                                    </div>
                                                    {paie.observation && (
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Observation</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{paie.observation}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">Aucun paiement enregistré</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default ClientDetailPage;
