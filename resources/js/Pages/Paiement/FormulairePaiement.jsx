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
    getLastPaiements,
    getPaiement,
    updatePaiement,
} from "@/Services/PaiementService";
import Snackbar from "@/Components/Snackbar";
import FichierPaiementPdf from "@/Components/paiements/FichierPaiementPdf";
import moment from "moment";
import { sendPdfByEmail } from "@/Services/envoyePdfEmail";
import { extractDateRange } from "@/utils/getTwoDateUtils";
import { incrementRecuNumber } from "@/constant";

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
    });

    useEffect(() => {
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
        }));
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

                const dateRange = extractDateRange(paiement.periode_couverte);
                data.periode_couverte =
                    dateRange.startDate.original +
                    " au " +
                    dateRange.endDate.original;

                if (client) {
                    setData({
                        ...data,
                        numero: paiement.numero,
                        nom_acheteur: client.nom_famille,
                        prenom_acheteur: client.nom,
                        civilite_acheteur:
                            client.genre === "Homme" ? "Mr." : "Mme.",
                        ville_acheteur: client.ville,
                        pays_acheteur: client.pays,
                        num_rue_acheteur: client.village || client.quartier,
                        client_id: client.id,
                        objet: paiement.observation,
                        description: paiement.description,
                        mode_paiement: paiement.mode_paiement,
                        date_echeance: paiement.echeance,
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
                            dateRange.startDate.original,
                        date: paiement.date || dateRange.endDate.original,
                        lieu_creation: paiement.lieu_creation,
                        date_additionnel: paiement.date_additionnel,
                        nom_vendeur: paiement.nom_vendeur,
                        nom_vendeurs: paiement.nom_vendeurs,
                        select1: paiement.select1,
                        num_tva: paiement.num_tva,
                        nom_rue_vendeur: paiement.nom_rue_vendeur,
                        ville_vendeur: paiement.ville_vendeur,
                        pays_vendeur: paiement.pays_vendeur,
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
            console.log(client);

            if (client) {
                setData({
                    ...data,
                    client_id: id,
                    nom_acheteur: client.nom,
                    prenom_acheteur: client.prenom,
                    civilite_acheteur:
                        client.genre === "Homme" ? "Mr." : "Mme.",
                    ville_acheteur: client.localisation,
                    pays_acheteur: "Togo",
                    num_rue_acheteur: client.localisation,
                });
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
            setData("ville_acheteur", cli.ville);
            setData("pays_acheteur", cli.pays);
            setData("num_rue_acheteur", cli.village || cli.quartier);
            setData(
                "civilite_acheteur",
                cli.genre === "Homme" ? "Mr." : "Mme."
            );
            setEmail(cli.email);
        }
    };

    const handleSubmit = async () => {
        data.periode_couverte =
            moment(data.date_creation).format("DD/MM/YYYY") +
            " au " +
            moment(data.date).format("DD/MM/YYYY");
        data.date_paiement = data.date_paiement
            ? new Date(data.date_paiement).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
        data.observation = data.objet;
        data.echeance = data.date_echeance;
        data.statut_paiement = data.etat_paiment;
        data.montant_paye = data.montant_paye || "0";
        data.montant = data.montant_paye || "0";

        if (isEditing && paiementId) {
            data.id = paiementId;
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

                    if (client_id && amount && designation) {
                        try {
                            const res = await fetch(
                                `/api/paiement/client/${client_id}`,
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
                    token_data
                        ? telegramback(res.message)
                        : window.history.back();
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
                {/* Bouton retour responsive */}
                <div className="mb-6">
                    <DangerButton
                        onClick={() =>
                            token_data ? telegramback() : window.history.back()
                        }
                        className="text-sm capitalize sm:text-base"
                    >
                        ← Retour
                    </DangerButton>
                </div>

                {/* Titre responsive */}
                <div className="mb-6 text-xl font-bold text-center sm:text-2xl lg:text-3xl sm:mb-8">
                    {isEditing ? "Modifier Paiement" : "Formulaire de Paiement"}
                </div>

                {/* En-tête - Information paiement */}
                <div className="mb-6 sm:mb-8">
                    <InfoPaiement
                        data={data}
                        errors={errors}
                        setData={setData}
                        validationErrors={validationErrors}
                        setValidationErrors={setValidationErrors}
                    />
                </div>

                {/* Séparateur */}
                <div className="w-full my-4 border-b sm:my-6 opacity-35"></div>

                {/* Information vendeur et maraicher - Grid responsive */}
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

                {/* Séparateur */}
                <div className="w-full my-4 border-b sm:my-6 opacity-35"></div>

                {/* Objet - Responsive grid */}
                <div className="grid grid-cols-1 gap-4 my-6 md:grid-cols-2 sm:my-10">
                    <div className="w-full">
                        <InputLabel htmlFor="objet" value="Objet" />
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
                        />
                        <InputError
                            message={validationErrors.objet || errors.objet}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Séparateur */}
                <div className="w-full my-4 border-b sm:my-6 opacity-35"></div>

                {/* Désignations */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-start mb-4">
                        <span className="text-lg font-bold sm:text-xl">
                            Désignations
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <DesignationComponent data={data} setData={setData} />
                    </div>
                </div>

                {/* Séparateur */}
                <div className="w-full my-4 border-b sm:my-6 opacity-35"></div>

                {/* Paiement */}
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

                {/* Bouton d'action - Responsive */}
                <div className="flex flex-col items-center justify-end gap-4 mt-6 sm:flex-row sm:mt-8">
                    <PrimaryButton
                        className="w-full px-6 py-2 text-sm sm:w-auto sm:px-10 sm:text-base"
                        onClick={handleSubmit}
                    >
                        {isEditing ? "Mettre à jour" : "Enregistrer"}
                    </PrimaryButton>
                </div>
            </div>

            {/* Composant PDF caché */}
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
