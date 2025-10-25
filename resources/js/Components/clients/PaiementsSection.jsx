import React from "react";
import { FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";
import moment from "moment";
import "moment/locale/fr";
import { formatMontant } from "@/constant";

moment.locale("fr");

const PaiementInstallation = ({ paiement, getStatusColor, getStatusBadge }) => {
    if (!paiement) return null;

    const getRemarkPaiement = (datePaiement, dateEcheance) => {
        if (!datePaiement || !dateEcheance) return "";
        const dp = moment(datePaiement);
        const de = moment(dateEcheance);
        if (dp.isBefore(de, "day"))
            return { color: "text-green-500", text: "(en avance)" };
        if (dp.isSame(de, "day"))
            return { color: "text-blue-500", text: "(à temps)" };
        return { color: "text-red-500", text: "(en retard)" };
    };

    const remarque = paiement.date_paiement
        ? getRemarkPaiement(paiement.date_paiement, paiement.date_echeance)
        : "";

    return (
        <div
            className={`p-4 mb-4 border-2 rounded-lg ${getStatusColor(
                paiement.statut_paiement
            )}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                        Installation
                    </p>
                    {paiement.date_paiement && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {moment(paiement.date_paiement).format(
                                "DD MMM YYYY"
                            )}
                        </p>
                    )}
                </div>
                <div className="text-left">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatMontant(paiement.montant)} FCFA
                    </p>
                    <div className="flex items-center space-x-2">
                        {getStatusBadge(
                            paiement.statut_paiement,
                            paiement.date_echeance
                        )}
                        <span className={`${remarque.color} text-xs`}>
                            {remarque.text}
                        </span>
                    </div>

                    {paiement.date_paiement &&
                        paiement.statut_paiement?.toLowerCase() === "payé" && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                le{" "}
                                {moment(paiement.date_paiement).format(
                                    "DD MMM YYYY"
                                )}{" "}
                            </p>
                        )}
                </div>
            </div>
        </div>
    );
};

const VueEnsemble = ({
    montantPaye,
    montantRestant,
    pourcentagePaye,
    trimestresPayes,
    trimestresRestants,
    nombreTrimestres,
}) => (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Vue d'ensemble
        </h4>
        <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
                <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray={`${pourcentagePaye * 2.51} ${
                            251 - pourcentagePaye * 2.51
                        }`}
                        className="text-green-500 transition-all duration-500"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {pourcentagePaye}%
                    </span>
                </div>
            </div>
        </div>

        <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Progression
        </h4>
        <div className="w-full h-3 mb-4 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
            <div
                className="h-full transition-all duration-500 bg-gradient-to-r from-green-500 to-blue-500"
                style={{ width: `${pourcentagePaye}%` }}
            ></div>
        </div>
    </div>
);

// --- Carte pour chaque trimestre ---
const TrimestreCard = ({
    trimestre,
    getStatusColor,
    getStatusBadge,
    isDernierTrimestre,
}) => {
    const isPaye = trimestre.statut_paiement?.toLowerCase() === "payé";
    const reste = Math.max(trimestre.montant_attendu - trimestre.montant, 0);

    return (
        <div
            className={`p-4 border-2 rounded-lg transition-all ${getStatusColor(
                trimestre.statut_paiement,
                trimestre.estIncomplet
            )}`}
        >
            <div className="mb-2">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {trimestre.echeance}
                    {isDernierTrimestre && (
                        <span className="ml-2 text-xs font-normal text-orange-600 dark:text-orange-400">
                            (Dernier)
                        </span>
                    )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {trimestre.periode}
                </p>
            </div>

            <div className="mb-3">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatMontant(trimestre.montant)} FCFA
                </p>
                {trimestre.estIncomplet && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Reste : {formatMontant(reste)} FCFA
                    </p>
                )}
            </div>

            <div>
                <div className="flex items-center gap-2">
                    {getStatusBadge(
                        trimestre.statut_paiement,
                        trimestre.date_echeance,
                        trimestre.estIncomplet
                    )}
                    <span className={`text-xs ${trimestre.remarque.color}`}>
                        {trimestre.remarque.text}
                    </span>
                </div>
                {isPaye && trimestre.date_paiement && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        le{" "}
                        {moment(trimestre.date_paiement).format("DD MMM YYYY")}
                    </p>
                )}
            </div>
        </div>
    );
};

// --- Calendrier des paiements ---
const CalendrierPaiements = ({
    paiementsTrimestres,
    paiementInstallation,
    getStatusColor,
    getStatusBadge,
    nombreTrimestres,
}) => (
    <div className="p-6">
        <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Calendrier des Paiements
        </h4>

        <PaiementInstallation
            paiement={paiementInstallation}
            getStatusColor={getStatusColor}
            getStatusBadge={getStatusBadge}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {paiementsTrimestres.map((trimestre, index) => (
                <TrimestreCard
                    key={trimestre.id}
                    trimestre={trimestre}
                    getStatusColor={getStatusColor}
                    getStatusBadge={getStatusBadge}
                    isDernierTrimestre={index === nombreTrimestres - 1}
                />
            ))}
        </div>
    </div>
);

const PaiementsSection = ({ paiements, installation }) => {
    if (!paiements || paiements.length === 0) return null;

    const dureeAnnees = 3;
    const nombreTrimestres = dureeAnnees * 4;
    const montantTrimestrielNormal = 18000;
    const montantDernierTrimestre = 22000;

    const paiementInstallation = paiements.find(
        (p) => p.echeance?.toLowerCase() === "installation"
    );
    const paiementsTrimestrielsExistants = paiements.filter((p) =>
        p.echeance?.match(/^T\d+$/i)
    );
    const dateInstallation =
        installation[0].date_installation ||
        paiementInstallation?.date_paiement ||
        paiementsTrimestrielsExistants[0]?.date_paiement ||
        new Date();

    const paiementsParEcheance = paiements.reduce((acc, p) => {
        if (!p.echeance) return acc;
        const key = p.echeance.toUpperCase();
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    const getRemarkPaiement = (datePaiement, dateEcheance) => {
        if (!datePaiement || !dateEcheance) return "";
        const dp = moment(datePaiement);
        const de = moment(dateEcheance);
        if (dp.isBefore(de, "month"))
            return { color: "text-green-500", text: "(en avance)" };
        if (dp.isSame(de, "month"))
            return { color: "text-blue-500", text: "(à temps)" };
        return { color: "text-red-500", text: "(en retard)" };
    };

    const tousLesTrimestres = Array.from(
        { length: nombreTrimestres },
        (_, index) => {
            const numeroTrimestre = index + 1;
            const echeance = `T${String(numeroTrimestre).padStart(2, "0")}`;
            const montantTrimestre =
                numeroTrimestre === nombreTrimestres
                    ? montantDernierTrimestre
                    : montantTrimestrielNormal;

            const paiementsTrimestre = paiementsParEcheance[echeance] || [];
            const montantTotalPaye = paiementsTrimestre.reduce(
                (sum, p) =>
                    p.statut_paiement?.toLowerCase() === "payé"
                        ? sum + parseFloat(p.montant || 0)
                        : sum,
                0
            );
            const estIncomplet =
                montantTotalPaye > 0 && montantTotalPaye < montantTrimestre;
            const statut_paiement =
                montantTotalPaye >= montantTrimestre
                    ? "payé"
                    : montantTotalPaye > 0
                    ? "incomplet"
                    : "en attente";

            const dernierPaiement = paiementsTrimestre
                .filter((p) => p.statut_paiement?.toLowerCase() === "payé")
                .sort(
                    (a, b) =>
                        new Date(b.date_paiement) - new Date(a.date_paiement)
                )[0];
            const dateDernierPaiement = dernierPaiement
                ? dernierPaiement.date_paiement
                : null;

            const debutTrimestre = moment(dateInstallation).add(
                index * 3,
                "months"
            );
            const finTrimestre = moment(debutTrimestre).add(2, "months");
            const periode = `${debutTrimestre.format(
                "MMM YYYY"
            )} – ${finTrimestre.format("MMM YYYY")}`;
            const remarque =
                statut_paiement?.toLowerCase() === "payé"
                    ? getRemarkPaiement(dateDernierPaiement, finTrimestre)
                    : "";

            return {
                id: `trim-${numeroTrimestre}`,
                echeance,
                periode,
                montant: montantTotalPaye,
                montant_attendu: montantTrimestre,
                statut_paiement,
                date_echeance: finTrimestre.format("YYYY-MM-DD"),
                date_paiement: dateDernierPaiement,
                estIncomplet,
                remarque,
            };
        }
    );

    const totalTrimestres =
        montantTrimestrielNormal * (nombreTrimestres - 1) +
        montantDernierTrimestre;
    const totalMontant =
        (paiementInstallation ? parseFloat(paiementInstallation.montant) : 0) +
        totalTrimestres;
    const montantPaye = paiements
        .filter((p) => p.statut_paiement?.toLowerCase() === "payé")
        .reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);
    const montantRestant = totalMontant - montantPaye;
    const pourcentagePaye =
        totalMontant > 0 ? Math.round((montantPaye / totalMontant) * 100) : 0;
    const trimestresPayes = tousLesTrimestres.filter(
        (t) => t.statut_paiement?.toLowerCase() === "payé"
    ).length;
    const trimestresRestants = nombreTrimestres - trimestresPayes;

    const getStatusColor = (statut, estIncomplet) => {
        if (estIncomplet)
            return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700";
        if (statut?.toLowerCase() === "payé")
            return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700";
        return "bg-white border-gray-200 dark:bg-slate-800 dark:border-gray-700";
    };

    const getStatusBadge = (statut, date, estIncomplet) => {
        const isPaye = statut?.toLowerCase() === "payé";
        const isOverdue = !isPaye && date && moment(date).isBefore(moment());
        if (estIncomplet)
            return (
                <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                    <FaExclamationTriangle className="w-4 h-4" />
                    <span className="text-xs font-medium">Incomplet</span>
                </div>
            );
        if (isPaye)
            return (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <FaCheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Payé</span>
                </div>
            );
        if (isOverdue)
            return (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                    <FaClock className="w-4 h-4" />
                    <span className="text-xs font-medium">En retard</span>
                </div>
            );
        return (
            <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                <FaClock className="w-4 h-4" />
                <span className="text-xs font-medium">À venir</span>
            </div>
        );
    };

    return (
        <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800">
            <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-200 md:grid-cols-4 dark:border-gray-700">
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatMontant(totalMontant)} FCFA
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Payé
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatMontant(montantPaye)} FCFA
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                        {pourcentagePaye}%
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reste
                    </p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {formatMontant(montantRestant)} FCFA
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {trimestresRestants} trim.
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Trimestriel
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatMontant(montantTrimestrielNormal)} FCFA
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        /3 mois
                    </p>
                </div>
            </div>

            <VueEnsemble
                montantPaye={montantPaye}
                montantRestant={montantRestant}
                pourcentagePaye={pourcentagePaye}
                trimestresPayes={trimestresPayes}
                trimestresRestants={trimestresRestants}
                montantTrimestrielNormal={montantTrimestrielNormal}
                nombreTrimestres={nombreTrimestres}
            />

            <CalendrierPaiements
                paiementsTrimestres={tousLesTrimestres}
                paiementInstallation={paiementInstallation}
                getStatusColor={getStatusColor}
                getStatusBadge={getStatusBadge}
                nombreTrimestres={nombreTrimestres}
            />

            <div className="grid grid-cols-2 gap-4 py-6 border-t-2 border-gray-200 md:grid-cols-4 dark:border-gray-700">
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Montant payé
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatMontant(montantPaye)} FCFA
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Montant restant
                    </p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {formatMontant(montantRestant)} FCFA
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Trimestres payés
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {trimestresPayes} / {nombreTrimestres}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Trimestres restants
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {trimestresRestants}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaiementsSection;
