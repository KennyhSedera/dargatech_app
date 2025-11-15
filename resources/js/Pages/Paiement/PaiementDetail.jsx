import { addFavicon, logo, titre, togo } from "@/constant";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

const PaiementDetail = ({ data = {} }) => {
    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-500">
                    Aucune donnée disponible pour ce paiement.
                </div>
            </div>
        );
    }

    useEffect(() => {
        addFavicon();
    }, []);

    const formatNumber = (number) =>
        new Intl.NumberFormat("fr-FR").format(number);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR");
    };

    return (
        <AuthenticatedLayout>
            <Head title={"Reçu - " + data.numero} />

            <div className="max-w-4xl p-12 mx-auto text-xs bg-white rounded-lg shadow-lg dark:bg-gray-800">
                {/* --- En-tête --- */}
                <div className="mb-8 overflow-hidden">
                    <div className="float-left w-1/2">
                        <div className="inline-block mr-2 align-top">
                            <img className="w-16" src={logo} alt="logo" />
                        </div>
                        <div className="inline-block align-top">
                            <div className="flex items-center mb-1">
                                <span className="px-1 text-xs font-bold text-blue-500">
                                    TOGO
                                </span>
                                <img src={togo} alt="togo" className="w-4" />
                            </div>
                            <div className="mb-1 text-sm font-bold">
                                <img className="w-32" src={titre} alt="titre" />
                            </div>
                            <div className="text-xs text-gray-500">
                                EXIGEZ LE MEILLEUR DU SOLAIRE
                            </div>
                        </div>
                    </div>

                    <div className="float-right w-1/2 text-right">
                        <div className="text-blue-500">
                            REÇU N°
                            <div className="text-lg font-bold">
                                {data.numero}
                            </div>
                        </div>
                        <div className="mt-2 text-xs">
                            Lieu de création: {data.lieu_creation}
                            <br />
                            Date de création: {formatDate(data.date_creation)}
                            <br />
                            Date de vente: {formatDate(data.date)}
                        </div>
                    </div>
                </div>

                {/* --- Infos vendeur / acheteur --- */}
                <div className="clear-both mb-6 overflow-hidden">
                    <div className="float-left w-[49%]">
                        <div className="p-2 text-white bg-blue-500">
                            VENDEUR:
                        </div>
                        <div className="p-2 border border-t-0 border-blue-500">
                            <strong>{data.nom_vendeur}</strong>
                            <br />
                            {data.ville_vendeur}, {data.pays_vendeur}
                        </div>
                    </div>

                    <div className="float-right w-[49%]">
                        <div className="p-2 text-white bg-blue-500">
                            ACHETEUR:
                        </div>
                        <div className="p-2 border border-t-0 border-blue-500">
                            <strong>
                                {data.civilite_acheteur} {data.nom_acheteur}{" "}
                                {data.prenom_acheteur}
                            </strong>
                            <br />
                            {data.ville_acheteur}, {data.pays_acheteur}
                        </div>
                    </div>
                </div>

                {/* --- Description --- */}
                <div className="clear-both mb-4 text-lg font-bold text-center text-blue-500">
                    SISAM - {data.description || data.observation}
                </div>

                {/* --- Tableau produits --- */}
                <div className="clear-both mb-6 overflow-x-auto">
                    <table className="min-w-full text-xs border border-collapse border-blue-500">
                        <thead className="text-white bg-blue-500">
                            <tr>
                                {[
                                    "N°",
                                    "Désignation",
                                    "Réf.",
                                    "Qté",
                                    "PU HT",
                                    "Total HT",
                                    "TVA",
                                    "Montant TVA",
                                    "Total TTC",
                                ].map((header, idx) => (
                                    <th
                                        key={idx}
                                        className="p-2 text-center border border-blue-500"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.produits?.map((produit, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-blue-50 hover:dark:bg-gray-700"
                                >
                                    <td className="p-2 text-center border border-blue-500">
                                        {index + 1}
                                    </td>
                                    <td className="p-2 border border-blue-500">
                                        {produit.designation}
                                    </td>
                                    <td className="p-2 text-center border border-blue-500">
                                        {produit.reference}
                                    </td>
                                    <td className="p-2 text-center border border-blue-500">
                                        {produit.quantite}
                                    </td>
                                    <td className="p-2 text-right border border-blue-500">
                                        {formatNumber(produit.prix_unitaire)}
                                    </td>
                                    <td className="p-2 text-right border border-blue-500">
                                        {formatNumber(produit.total_ht)}
                                    </td>
                                    <td className="p-2 text-center border border-blue-500">
                                        {produit.tva}%
                                    </td>
                                    <td className="p-2 text-right border border-blue-500">
                                        {formatNumber(produit.montant_tva)}
                                    </td>
                                    <td className="p-2 text-right border border-blue-500">
                                        {formatNumber(produit.total_ttc)}
                                    </td>
                                </tr>
                            ))}
                            <tr className="font-bold">
                                <td
                                    colSpan="5"
                                    className="p-2 text-center border border-blue-500"
                                >
                                    TOTAL
                                </td>
                                <td className="p-2 text-right border border-blue-500">
                                    {formatNumber(data.total_ht)}
                                </td>
                                <td className="p-2 border border-blue-500"></td>
                                <td className="p-2 text-right border border-blue-500">
                                    {formatNumber(data.total_tva)}
                                </td>
                                <td className="p-2 text-right border border-blue-500">
                                    {formatNumber(data.total_ttc)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* --- Totaux / Paiement --- */}
                <div className="clear-both mb-8">
                    <div className="float-right w-1/2">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="p-1 text-right">Total HT</td>
                                    <td className="p-1 font-bold text-right">
                                        {formatNumber(data.total_ht)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-1 text-right">
                                        Montant TVA
                                    </td>
                                    <td className="p-1 font-bold text-right">
                                        {formatNumber(data.total_tva)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-1 text-right">
                                        Total TTC
                                    </td>
                                    <td className="p-1 font-bold text-right">
                                        {formatNumber(data.total_ttc)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- Mode de paiement --- */}
                <div className="clear-both p-3 mb-6 border border-blue-500">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="w-1/4 pb-3">À payer:</td>
                                <td className="w-1/4 pb-3">{data.a_payer}</td>
                                <td className="w-1/4 pb-3">Montant payé:</td>
                                <td className="w-1/4 pb-3">
                                    {data.montant_paye} Franc CFA
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-3">Mode de règlement:</td>
                                <td className="pb-3">{data.mode_paiement}</td>
                                <td className="pb-3">Banque:</td>
                                <td className="pb-3">{data.banque}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>IBAN:</td>
                                <td>{data.iban}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* --- Footer --- */}
                <div className="clear-both mb-8">
                    <div className="mb-2 text-blue-500">Nom du vendeur</div>
                    <div className="font-bold">{data.nom_vendeur}</div>
                </div>

                <div className="clear-both pt-2 mt-8 text-xs text-center border-t border-gray-300">
                    <div>DARGATECH TOGO, SARL - TG-LRL-01-2024-B12-00008</div>
                    <div>KARA, TOGO - Tel : +228 93 18 96 06</div>
                    <div>www.dargatech.com</div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PaiementDetail;
