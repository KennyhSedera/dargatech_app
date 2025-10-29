import React, { useEffect, useState, useRef } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import InputLabel from "@/Components/inputs/InputLabel";
import TextInput from "@/Components/inputs/TextInput";
import InputError from "@/Components/inputs/InputError";
import useTheme from "@/hooks/useTheme";
import DangerButton from "@/Components/buttons/DangerButton";
import { getType_paiements } from "@/Services/TypePaiementService";
import { getClient, getClients } from "@/Services/clientService";
import PrimaryButton from "@/Components/buttons/PrimaryButton";
import DesignationComponent from "@/Components/Paiement/DesignationComponent";
import InfoPaiement from "@/Components/Paiement/InfoPaiement";
import InfoMaraicher from "@/Components/Paiement/InfoMaraicher";
import InfoVendeur from "@/Components/Paiement/InfoVendeur";
import PaiementFooter from "@/Components/Paiement/PaiementFooter";
import {
    createPaiement,
    getLastEcheanceClient,
    getLastPaiements,
    getPaiement,
    updatePaiement,
} from "@/Services/PaiementService";
import Snackbar from "@/Components/Snackbar";
import FichierPaiementPdf from "@/Components/paiements/FichierPaiementPdf";
import moment from "moment";
import { sendPdfByEmail } from "@/Services/envoyePdfEmail";
import { extractDateRange } from "@/utils/getTwoDateUtils";
import { incrementRecuNumber, logo, titre } from "@/constant";
import { validateFormPaiement } from "./../../Components/validateForm";

const FormulairePaiement = ({ token_data, telegramback }) => {
    const { theme, setTheme } = useTheme();
    const contentRef = useRef(null);
    const [showPdf, setShowPdf] = useState(true);
    const [paiementData, setPaiementData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const { props } = usePage();
    const { client_id, amount, designation } = props;

    const [validationErrors, setValidationErrors] = useState({});
    const [clients, setClients] = useState([]);
    const [typePaiement, setTypePaiement] = useState([]);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success",
    });
    const [email, setEmail] = useState("");

    const getIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("id");
    };

    const paiementId = getIdFromUrl();

    useEffect(() => {
        setTheme(theme || "light");
        getType();
    }, [theme]);

    const { data, setData, errors, reset } = useForm({
        type: "recu",
        numero: "RECU_N_0001",
        date_creation: new Date().toISOString().split("T")[0],
        date: new Date().toISOString().split("T")[0],
        lieu_creation: "Atakpamé",
        date_additionnel: "Date de vente",
        periode_couverte: "",
        nom_vendeur: "Darga",
        nom_vendeurs: "DARGATECH TOGO",
        select1: "Numéro TVA",
        num_tva: "",
        nom_rue_vendeur: "Kara",
        ville_vendeur: "Kara",
        pays_vendeur: "Togo",
        civilite_acheteur: "Mr.",
        prenom_acheteur: "",
        nom_acheteur: "",
        num_rue_acheteur: "",
        ville_acheteur: "",
        pays_acheteur: "",
        mode_paiement: "Espèce",
        date_echeance: new Date().toISOString().split("T")[0],
        date_paiement: new Date().toISOString().split("T")[0],
        etat_paiment: "Payé",
        montant_paye: "",
        objet: "",
        description: "",
        produits: [],
        client_id: "",
        echeance: "",
    });

    useEffect(() => {
        if (amount && designation) {
            setData((prevData) => ({
                ...prevData,
                produits: [
                    ...prevData.produits,
                    {
                        designation,
                        reference: "",
                        quantite: 1,
                        unite: "",
                        tva: 0,
                        prix_unitaire: amount,
                        total_ht: amount,
                        total_ttc: amount,
                    },
                ],
                montant_paye: amount,
                description: designation,
                objet: "Frais de l'installation du pompage solaire.",
                date_paiement: new Date().toISOString().split("T")[0],
                date_echeance: new Date().toISOString().split("T")[0],
                echeance: "Installation",
            }));
        }
    }, [amount, designation]);

    const getType = async () => {
        try {
            const [{ clients }, type] = await Promise.all([
                getClients(),
                getType_paiements(),
            ]);
            setClients(
                clients?.map((el) => ({
                    id: el.id,
                    title: `${el.prenom} ${el.nom}`,
                    nom: el.prenom,
                    nom_famille: el.nom,
                    ville: el.localisation,
                    pays: "Togo",
                    village: el.localisation,
                    quartier: el.localisation,
                    email: el.email,
                    genre: el.genre,
                    telephone: el.telephone,
                    localisation: el.localisation,
                    pays_acheteur: el.pays_acheteur,
                    ville_acheteur: el.ville_acheteur,
                }))
            );
            setTypePaiement(
                type.type?.map((el) => ({ id: el.id, nom: el.name }))
            );
        } catch (error) {
            console.error("Error fetching payment types:", error);
        }
    };

    const fetchPaiementData = async (id) => {
        try {
            const response = await getPaiement(id);
            if (response) {
                const paiement = response;

                let client = null;
                if (client_id) {
                    client =
                        clients.find((el) => el.id === parseInt(client_id)) ||
                        clients.find((el) => el.id === client_id);
                } else {
                    client = clients.find((c) => c.id === paiement.client_id);
                }

                let dateRange = null;
                let periodeCouverte = paiement.periode_couverte;

                const datePattern = /\d{2}\/\d{2}\/\d{4}/g;
                const datesFound =
                    paiement.periode_couverte?.match(datePattern);

                if (datesFound && datesFound.length >= 2) {
                    try {
                        dateRange = extractDateRange(paiement.periode_couverte);
                        periodeCouverte =
                            dateRange.startDate.original +
                            " au " +
                            dateRange.endDate.original;
                    } catch (error) {
                        console.warn("Impossible d'extraire les dates:", error);
                        periodeCouverte = paiement.periode_couverte;
                    }
                }

                if (client) {
                    setData({
                        ...data,
                        numero: paiement.numero,
                        nom_acheteur: client.nom_famille,
                        prenom_acheteur: client.nom,
                        civilite_acheteur:
                            client.genre === "Homme" ? "Mr." : "Mme.",
                        ville_acheteur:
                            client.ville_acheteur || paiement.ville_acheteur,
                        pays_acheteur:
                            client.pays_acheteur || paiement.pays_acheteur,
                        num_rue_acheteur: client.village || client.quartier,
                        client_id: client.id,
                        objet: paiement.observation,
                        description: paiement.description,
                        mode_paiement: paiement.mode_paiement,
                        statut_paiement: paiement.statut_paiement,
                        produits: paiement.produits.map((el) => ({
                            ...el,
                            designation: el.designation,
                            prix_unitaire: el.prix_unitaire,
                            quantite: el.quantite,
                            unite: el.unite,
                        })),
                        montant_paye: parseFloat(paiement.montant).toFixed(2),
                        date_creation:
                            paiement.date_creation ||
                            dateRange?.startDate.original ||
                            moment().format("DD/MM/YYYY"),
                        date:
                            paiement.date ||
                            dateRange?.endDate.original ||
                            moment().format("DD/MM/YYYY"),
                        lieu_creation: paiement.lieu_creation,
                        date_additionnel: paiement.date_additionnel,
                        nom_vendeur: paiement.nom_vendeur,
                        nom_vendeurs: paiement.nom_vendeurs,
                        select1: paiement.select1,
                        num_tva: paiement.num_tva,
                        nom_rue_vendeur: paiement.nom_rue_vendeur,
                        ville_vendeur: paiement.ville_vendeur,
                        pays_vendeur: paiement.pays_vendeur,
                        code_postal_vendeur: paiement.code_postal_vendeur,
                        telephone_vendeur: paiement.telephone_vendeur,
                        email_vendeur: paiement.email_vendeur,
                        date_paiement: paiement.date_paiement,
                        date_echeance: paiement.date_echeance,
                        echeance: paiement.echeance,
                        observation: paiement.observation,
                        periode_couverte: periodeCouverte,
                    });
                    setEmail(client.email);
                }

                setIsEditing(true);
            }
        } catch (error) {
            console.error("Error fetching payment data:", error);
            setAlert({
                open: true,
                message: "Erreur lors du chargement du paiement",
                type: "error",
            });
        }
    };

    const fetchClient = async (id) => {
        try {
            const { client } = await getClient(id);

            if (client) {
                handleSelect({
                    email: client.email,
                    genre: client.genre,
                    id: client.id,
                    localisation: client.localisation,
                    nom: client.prenom,
                    nom_famille: client.nom,
                    pays: client.pays_acheteur,
                    pays_acheteur: client.pays_acheteur,
                    quartier: client.localisation,
                    telephone: client.telephone,
                    title: `${client.prenom} ${client.nom}`,
                    village: client.localisation,
                    ville: client.ville_acheteur,
                    ville_acheteur: client.ville_acheteur,
                });

                setEmail(client.email);
            }
        } catch (error) {
            console.error("Error fetching client:", error);
            return null;
        }
    };

    useEffect(() => {
        if (clients.length > 0 && paiementId) {
            fetchPaiementData(paiementId);
        } else if (clients.length > 0 && client_id) {
            fetchClient(client_id);
        }
    }, [clients, paiementId, client_id]);

    const getLastNumero = async () => {
        const { data } = await getLastPaiements();
        if (data) {
            setData("numero", incrementRecuNumber(data.numero));
        }
    };

    const getLastEcheance = async (id) => {
        const data = await getLastEcheanceClient(id);

        if (data && data.length > 0) {
            const echeanceMap = {};

            data.forEach((item) => {
                if (item?.echeance && /^T\d+$/i.test(item.echeance)) {
                    const num = parseInt(
                        item.echeance.match(/^T(\d+)$/i)[1],
                        10
                    );
                    if (!echeanceMap[num]) echeanceMap[num] = 0;
                    echeanceMap[num] +=
                        parseInt(item.montant) || item.montant || 0;
                }
            });

            if (Object.keys(echeanceMap).length === 0) {
                setData("echeance", "T01");
                return;
            }

            const sortedEcheances = Object.keys(echeanceMap)
                .map(Number)
                .sort((a, b) => a - b);

            let lastValid = sortedEcheances[0];

            for (const e of sortedEcheances) {
                if (echeanceMap[e] >= 18000) {
                    lastValid = e;
                } else {
                    setData("echeance", `T${String(e).padStart(2, "0")}`);
                    return;
                }
            }

            const nextEcheance = `T${String(lastValid + 1).padStart(2, "0")}`;
            setData("echeance", nextEcheance);
        } else {
            setData((prevData) => ({
                ...prevData,
                produits: [
                    ...prevData.produits,
                    {
                        designation:
                            "Acompte pour signature de contrat et installation",
                        reference: "",
                        quantite: 1,
                        unite: "",
                        tva: 0,
                        prix_unitaire: 30000,
                        total_ht: 30000,
                        total_ttc: 30000,
                    },
                ],
                montant_paye: "30000",
                description:
                    "Acompte pour signature de contrat et installation",
                objet: "Frais de l'installation du pompage solaire.",
                date_paiement: new Date().toISOString().split("T")[0],
                date_echeance: new Date().toISOString().split("T")[0],
                echeance: "Installation",
            }));
        }
    };

    useEffect(() => {
        if (!paiementId) {
            getLastNumero();
        }
    }, [paiementId]);

    const handleSelect = (item) => {
        const cli = clients.find((el) => el.id === item.id);
        if (cli) {
            setData("client_id", cli.id);
            setData("nom_acheteur", cli.nom_famille);
            setData("prenom_acheteur", cli.nom);
            setData("num_rue_acheteur", cli.localisation);
            setData("ville_acheteur", cli.ville_acheteur);
            setData("pays_acheteur", cli.pays_acheteur);
            setData(
                "civilite_acheteur",
                cli.genre === "Homme" ? "Mr." : "Mme."
            );
            setEmail(cli.email);
            !client_id && getLastEcheance(cli.id);
        }
    };

    const handleSubmit = async () => {
        data.periode_couverte = amount
            ? "Frais d'installation."
            : moment(data.date_creation).format("DD/MM/YYYY") +
              " au " +
              moment(data.date).format("DD/MM/YYYY");
        data.date_paiement = new Date(data.date_echeance)
            .toISOString()
            .split("T")[0];
        data.observation = data.objet;
        data.statut_paiement = data.etat_paiment;
        data.montant_paye = data.montant_paye || "0";
        data.montant = data.montant_paye || "0";

        if (isEditing && paiementId) {
            data.id = paiementId;
        }

        if (!validateFormPaiement(data, setValidationErrors)) {
            return;
        }

        try {
            let response;
            if (isEditing) {
                response = await updatePaiement(paiementId, data);
            } else {
                response = await createPaiement(data);
            }

            setAlert({
                open: true,
                message: response.message,
                type: response.success ? "success" : "error",
            });

            if (response.success) {
                setTimeout(async () => {
                    reset();
                    token_data
                        ? telegramback(response.message)
                        : window.history.back();
                    if (
                        (client_id && amount && designation) ||
                        data.objet ===
                            "Frais de l'installation du pompage solaire."
                    ) {
                        const id = client_id || data.client_id;
                        try {
                            const res = await fetch(
                                `/api/paiement/client/${id}`,
                                {
                                    method: "GET",
                                }
                            );

                            const json = await res.json();
                            console.log("Mise à jour is_payed:", json);
                        } catch (err) {
                            console.error("Erreur mise à jour client:", err);
                        }
                    }
                }, 3000);

                const telegram_chat_id = token_data ? token_data.chat_id : null;

                const res = await sendPdfByEmail(data, email, telegram_chat_id);
                if (res.success) {
                    setAlert({
                        open: true,
                        message: res.message,
                        type: res.success ? "success" : "error",
                    });
                }
            }
        } catch (error) {
            console.error("Error submitting payment:", error);
            setAlert({
                open: true,
                message: "Erreur lors de l'enregistrement du paiement",
                type: "error",
            });
        }
    };

    return (
        <div className="min-h-screen p-4 bg-gray-100 sm:p-6 lg:p-10 dark:bg-gray-900 dark:text-white">
            <Head
                title={isEditing ? "Modifier Paiement" : "Formulaire Paiement"}
            />
            <Snackbar
                message={alert.message}
                type={alert.type}
                duration={3000}
                position="top-right"
                show={alert.open}
                onClose={() => setAlert({ ...alert, message: "", open: false })}
            />

            <div className="relative p-4 mx-auto bg-white rounded-lg shadow-lg max-w-7xl sm:p-6 dark:bg-gray-800">
                <div className="flex items-center justify-between p-2 mb-6 text-white rounded-lg">
                    <div className="flex items-center">
                        <img src={logo} alt="logo" className="w-12 h-12 mr-2" />
                        <img src={titre} alt="titre" className="w-auto h-9" />
                    </div>
                    <DangerButton
                        onClick={() =>
                            token_data ? telegramback() : window.history.back()
                        }
                        className="text-sm capitalize sm:text-base"
                    >
                        Retour
                    </DangerButton>
                </div>

                <div className="mb-6 text-xl font-bold text-center sm:text-2xl lg:text-3xl sm:mb-8">
                    {isEditing ? "Modifier Paiement" : "Formulaire de Paiement"}
                </div>

                <div className="mb-6 sm:mb-8">
                    <InfoPaiement
                        data={data}
                        errors={errors}
                        setData={setData}
                        validationErrors={validationErrors}
                        setValidationErrors={setValidationErrors}
                    />
                </div>

                <div className="w-full my-4 border-b sm:my-6 opacity-35"></div>

                <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2 sm:gap-6 lg:gap-8 sm:mb-8">
                    <div className="space-y-4">
                        <InfoVendeur
                            data={data}
                            errors={errors}
                            setData={setData}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                        />
                    </div>
                    <div className="space-y-4">
                        <InfoMaraicher
                            clients={clients}
                            data={data}
                            errors={errors}
                            handleSelect={handleSelect}
                            setData={setData}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                        />
                    </div>
                </div>

                <div className="w-full my-4 border-b sm:my-6 opacity-35"></div>

                <div className="grid grid-cols-1 gap-4 my-6 md:grid-cols-2 sm:my-10">
                    <div className="w-full">
                        <InputLabel htmlFor="objet" value="Observation" />
                        <TextInput
                            id="objet"
                            name="objet"
                            value={data.objet}
                            className="block w-full mt-1"
                            autoComplete="objet"
                            onChange={(e) => setData("objet", e.target.value)}
                            required
                            onFocus={() =>
                                setValidationErrors({
                                    ...validationErrors,
                                    objet: "",
                                })
                            }
                            placeholder="Ajouter l'objet du paiement"
                        />
                        <InputError
                            message={validationErrors.objet || errors.objet}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="w-full my-4 border-b sm:my-6 opacity-35"></div>

                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-start mb-4">
                        <span className="text-lg font-bold sm:text-xl">
                            Désignations
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <DesignationComponent
                            data={data}
                            setData={setData}
                            errors={errors}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                        />
                    </div>
                </div>

                <div className="w-full my-4 border-b sm:my-6 opacity-35"></div>

                <div className="mb-6 sm:mb-8">
                    <PaiementFooter
                        data={data}
                        errors={errors}
                        setData={setData}
                        setValidationErrors={setValidationErrors}
                        typePaiement={typePaiement}
                        validationErrors={validationErrors}
                    />
                </div>

                <div className="flex flex-col items-center justify-end gap-4 mt-6 sm:flex-row sm:mt-8">
                    <PrimaryButton
                        className="w-full px-6 py-2 text-sm sm:w-auto sm:px-10 sm:text-base"
                        onClick={handleSubmit}
                    >
                        {isEditing ? "Mettre à jour" : "Enregistrer"}
                    </PrimaryButton>
                </div>
            </div>

            <div className="hidden">
                {showPdf && paiementData && (
                    <div ref={contentRef}>
                        <FichierPaiementPdf data={paiementData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormulairePaiement;
