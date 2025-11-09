import ConfirmDialog from "@/Components/ConfirmDialog";
import DataTable from "@/Components/DataTable";
import HeaderPage from "@/Components/HeaderPage";
import FormulaireInstallation from "@/Components/installations/FormulaireInstallation";
import Snackbar from "@/Components/Snackbar";
import { formatdate, parsedate } from "@/constant";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    deleteinstallations,
    getinstallations,
} from "@/Services/installationService";
import { Head, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import { TbEdit, TbWorldCheck } from "react-icons/tb";
import EmptyState from "@/Components/EmptyState";
import { RiTelegramFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";

const InstallationPage = () => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [dataToModify, setDataToModify] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [installations, setInstallations] = useState([]);
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
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const headers = [
        { key: "code_installation", label: "Code", sortable: true },
        { key: "nom", label: "Nom client", sortable: true },
        {
            key: "numero_serie",
            label: "Numéro de série de la pompe",
            sortable: true,
        },
        { key: "puissance_pompe", label: "Puissance crête installé (W)" },
        {
            key: "profondeur_forage",
            label: "Distance maximale pompe champ PV (m)",
        },
        { key: "debit_nominal", label: "Débit nominal (m³/h)" },
        { key: "source_eau", label: "Source d'eau" },
        { key: "hmt", label: "HMT (m)" },
        {
            key: "date_installation",
            label: "Date de l'installation",
            sortable: true,
        },
        {
            key: "statuts",
            label: "Statuts",
            customRender: (value) => (
                <span
                    className={`px-2 py-1 rounded-full text-white flex text-nowrap cursor-pointer ${
                        value === "installée"
                            ? "bg-green-500/50"
                            : value === "en cours"
                            ? "bg-blue-500/50"
                            : "bg-red-500/50"
                    }`}
                >
                    {value}
                </span>
            ),
        },
        {
            key: "created_via",
            label: "Via",
            customRender: (value) => (
                <span className="text-xl font-medium text-gray-900 dark:text-white">
                    {value === "web" ? (
                        <TbWorldCheck />
                    ) : (
                        <RiTelegramFill className="text-blue-400 bg-white" />
                    )}
                </span>
            ),
        },
    ];

    const actions = [
        {
            action: true,
            label: <FaEye className="text-base" />,
            color: "text-green-500",
            hoverColor: "text-green-600",
            handler: (row) => showItem(row.id),
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

    const handleNewInstallation = () => {
        setOpen(true);
    };

    const fetchInstallation = async () => {
        setIsLoading(true);
        const { data } = await getinstallations();

        const Installation = data.map((el) => ({
            id: el.id,
            code_installation: el.code_installation,
            client_id: el.client_id,
            nom: el.client.nom + " " + el.client.prenom,
            puissance_pompe: el.puissance_pompe,
            profondeur_forage: el.profondeur_forage,
            debit_nominal: el.debit_nominal,
            numero_serie: el.numero_serie,
            source_eau: el.source_eau,
            hmt: el.hmt,
            date_installation: formatdate(el.date_installation),
            statuts: el.statuts,
            latitude: el.localisation.latitude,
            longitude: el.localisation.longitude,
            created_via: el.created_via,
        }));

        setInstallations(Installation);
        setFilteredData(Installation);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchInstallation();
    }, []);

    const onFiltredData = (value) => {
        setSearch(value);
        setCurrentPage(1);

        const filteredData = installations.filter(
            (el) =>
                el?.nom?.toLowerCase().includes(value.toLowerCase()) ||
                el?.code_installation
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.numero_serie?.toLowerCase().includes(value.toLowerCase()) ||
                el?.source_eau?.toLowerCase().includes(value.toLowerCase()) ||
                el?.statuts?.toLowerCase().includes(value.toLowerCase()) ||
                el?.date_installation
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
        );

        setFilteredData(filteredData);
    };

    const onCloseFormulaire = (message) => {
        fetchInstallation();
        message && setAlert({ ...alert, message, open: true });
        setDataToModify({});
    };

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer l'installation numéro ${item.code_installation} du ${item.nom} le ${item.date_installation} ?`,
            id: item.id,
        });
    };

    const confirmDelete = async () => {
        const { message } = await deleteinstallations(suppression.id);
        setAlert({ ...alert, message, open: true });
        setSuppression({ ...suppression, open: false, id: 0 });
        fetchInstallation();
        setCurrentPage(1);
    };

    const editItem = (item) => {
        const installationDate = item.date_installation
            ? item.date_installation
            : "Invalid date";
        setDataToModify({
            ...item,
            date_installation: parsedate(installationDate),
        });
        setOpen(true);
    };

    const showItem = (id) => {
        router.visit(`/installation/${id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Installations" />
            <HeaderPage
                title={`Liste des Installations ( Total: ${installations.length} )`}
                handleClick={handleNewInstallation}
                onSearch={onFiltredData}
                search={search}
            />
            <FormulaireInstallation
                open={open}
                setOpen={setOpen}
                onCloseFormulaire={onCloseFormulaire}
                dataModify={dataToModify}
                token_data={null}
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
                            masqueColumns={[
                                "client_id",
                                "latitude",
                                "longitude",
                            ]}
                            onItemsPerPageChange={(n) => setItemsPerPage(n)}
                        />
                    ) : (
                        <EmptyState nom="installation" search={search} />
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default InstallationPage;
