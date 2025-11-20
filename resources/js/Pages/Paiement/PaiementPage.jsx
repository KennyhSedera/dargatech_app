import ConfirmDialog from "@/Components/ConfirmDialog";
import DataTable from "@/Components/DataTable";
import PaiementFormulaire from "@/Components/Paiement/PaiementFormulaire";
import Snackbar from "@/Components/Snackbar";
import { formatdate, parsedate } from "@/constant";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { deletePaiement, getPaiements } from "@/Services/PaiementService";
import { Head, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import TypePaiement from "./TypePaiement";
import HeaderPage from "@/Components/HeaderPage";
import { TbEdit } from "react-icons/tb";
import EmptyState from "@/Components/EmptyState";
import { FaEye } from "react-icons/fa6";

const PaiementPage = () => {
    const [search, setsearch] = useState("");
    const [dataToModify, setDataToModify] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [paiements, setPaiements] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [suppression, setSuppression] = useState({
        open: false,
        message: "",
        id: 0,
    });
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success",
    });
    const [isType, setIsType] = useState(false);
    const [id, setId] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const headers = [
        { key: "id", label: "ID", sortable: true },
        { key: "numero", label: "Numero", sortable: true },
        { key: "nom", label: "Nom client", sortable: true },
        { key: "montant", label: "Montant (CFA)" },
        { key: "mode_paiement", label: "Mode de paiement" },
        { key: "periode_couverte", label: "Periode couverte" },
        { key: "date_paiement", label: "Date de paiement", sortable: true },
        {
            key: "statut_paiement",
            label: "Statut",
            sortable: true,
            customRender: (value, row) => (
                <span
                    className={`px-2 py-1 rounded-full flex text-nowrap cursor-pointer text-white ${
                        value === "En attente"
                            ? "bg-yellow-500/50"
                            : value === "Payé"
                            ? "bg-green-500/50"
                            : "bg-red-500/50"
                    }`}
                >
                    {value}
                </span>
            ),
        },
        { key: "observation", label: "Observation" },
    ];

    const actions = [
        {
            label: <FaEye className="text-base" />,
            color: "text-green-500",
            hoverColor: "text-green-600",
            handler: (row) => router.visit(`/paiement/${row.id}/view`),
        },
        {
            label: <TbEdit className="text-lg" />,
            color: "text-blue-500",
            hoverColor: "text-blue-600",
            handler: (row) => editItem(row),
        },
        {
            label: <GoTrash className="text-base" />,
            color: "text-red-500",
            hoverColor: "text-red-600",
            handler: (row) => handleDelete(row),
        },
    ];

    const handleNewPaiement = () => {
        router.visit("/form/paiement");
    };

    const getPaiementDB = async () => {
        try {
            setIsLoading(true);
            const { data } = await getPaiements();
            const datas = data.map((el) => ({
                id: el.id,
                numero: el.numero,
                client_id: el.client_id,
                nom: `${el.client.nom} ${el.client.prenom}`,
                montant: el.montant,
                mode_paiement: el.mode_paiement,
                periode_couverte: el.periode_couverte,
                date_paiement: formatdate(el.date_echeance),
                statut_paiement: el.statut_paiement,
                observation: el.observation,
            }));
            setPaiements(datas);
            setFilteredData(datas);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPaiementDB();
    }, []);

    const onFilteredData = (value) => {
        setsearch(value);

        setCurrentPage(1);

        const filtered = paiements.filter(
            (el) =>
                el?.numero?.toLowerCase().includes(value.toLowerCase()) ||
                el?.nom?.toLowerCase().includes(value.toLowerCase()) ||
                el?.montant
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.periode_couverte
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.mode_paiement
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.date_paiement
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
        );

        setFilteredData(filtered);
    };

    const onCloseFormulaire = (message) => {
        getPaiementDB();
        message && setAlert({ ...alert, message, open: true });
        setDataToModify({});
    };

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer la paiement du ${item.nom} le ${item.date_paiement} ?`,
            id: item.id,
        });
    };

    const confirmDelete = async () => {
        const { message } = await deletePaiement(suppression.id);
        setAlert({ ...alert, message, open: true });
        setSuppression({ ...suppression, open: false, id: 0 });
        getPaiementDB();
        setCurrentPage(1);
    };

    const editItem = (item) => {
        const paiementDate = item.date_paiement
            ? item.date_paiement
            : "Invalid date";
        setDataToModify({
            ...item,
            date_paiement: parsedate(paiementDate),
        });
        router.visit("/form/paiement?id=" + item.id);
    };

    return (
        <AuthenticatedLayout setId={setId}>
            <Head title="Paiements" />
            <PaiementFormulaire
                open={open}
                setOpen={setOpen}
                onCloseFormulaire={onCloseFormulaire}
                dataModify={dataToModify}
            />
            <Snackbar
                message={alert.message}
                type={alert.type}
                duration={3000}
                position="top-right"
                show={alert.open}
                onClose={() => setAlert({ ...alert, message: "", open: false })}
            />
            <ConfirmDialog
                open={suppression.open}
                message={suppression.message}
                btnAcceptName="Supprimer"
                title="Suppression"
                btnAcceptColor="bg-red-500 text-white"
                close={() => setSuppression({ ...suppression, open: false })}
                accept={confirmDelete}
            />
            {!id && (
                <span className="flex items-center w-40 p-1 mb-2 border border-gray-300 rounded-md dark:border-gray-700">
                    <div
                        onClick={() => setIsType(false)}
                        className={`w-1/2 cursor-pointer text-center py-1 rounded-md text-sm transition-colors duration-300 ${
                            !isType
                                ? "bg-gray-300 dark:bg-gray-700"
                                : "bg-transparent"
                        }`}
                    >
                        Tous
                    </div>
                    <div
                        onClick={() => setIsType(true)}
                        className={`w-1/2 cursor-pointer text-center py-1 rounded-md text-sm transition-colors duration-300 ${
                            isType
                                ? "bg-gray-300 dark:bg-gray-700"
                                : "bg-transparent"
                        }`}
                    >
                        Types
                    </div>
                </span>
            )}
            {!isType ? (
                <div>
                    <HeaderPage
                        title={`Liste des paiements ( Total : ${paiements.length} )`}
                        handleClick={handleNewPaiement}
                        search={search}
                        onSearch={onFilteredData}
                    />
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div>
                            {filteredData.length > 0 ? (
                                <DataTable
                                    headers={headers}
                                    rows={filteredData}
                                    itemsPerPage={itemsPerPage}
                                    actions={actions}
                                    className="mt-4"
                                    currentPage={currentPage}
                                    onPageChange={setCurrentPage}
                                    masqueColumns={["client_id"]}
                                    onItemsPerPageChange={(n) =>
                                        setItemsPerPage(n)
                                    }
                                />
                            ) : (
                                <EmptyState nom="paiement" search={search} />
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <TypePaiement />
            )}
        </AuthenticatedLayout>
    );
};

export default PaiementPage;
