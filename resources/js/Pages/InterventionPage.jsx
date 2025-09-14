import ConfirmDialog from "@/Components/ConfirmDialog";
import DataTable from "@/Components/DataTable";
import EmptyState from "@/Components/EmptyState";
import HeaderPage from "@/Components/HeaderPage";
import FormulaireMaintenance from "@/Components/maintenances/FormulaireMaintenance";
import FormulaireRapportMaintenance from "@/Components/maintenances/FormulaireRapportMaintenance";
import Snackbar from "@/Components/Snackbar";
import { formatdate, parsedate } from "@/constant";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    deletemaintenances,
    getmaintenances,
} from "@/Services/maintenanceService";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import { RiTelegramFill } from "react-icons/ri";
import { TbEdit, TbWorldCheck } from "react-icons/tb";

const InterventionPage = () => {
    const [search, setsearch] = useState("");
    const [id, setid] = useState(0);
    const [open, setOpen] = useState(false);
    const [openRapport, setOpenRapport] = useState(false);
    const [dataToModify, setDataToModify] = useState({});
    const [dataRapport, setDataRapport] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [maintenances, setMaintenances] = useState([]);
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
    const user = usePage().props.auth.user;
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const headers = [
        { key: "id", label: "ID", sortable: true },
        { key: "code_installation", label: "Installation", sortable: true },
        { key: "nom", label: "Client", sortable: true },
        { key: "type_intervention", label: "Type" },
        {
            key: "description_probleme",
            label: "Problème",
            customRender: (value) => (
                <div className="relative max-w-md group">
                    <span className="line-clamp-2">{value}</span>

                    <div className="absolute bottom-0 left-0 z-50 hidden max-w-md p-2 mt-2 text-sm text-gray-800 bg-white border border-gray-300 rounded shadow-md group-hover:block">
                        {value}
                    </div>
                </div>
            ),
        },
        {
            key: "date_intervention",
            label: "Date d'intervenir",
            sortable: true,
        },
        {
            key: "status_intervention",
            label: "Statuts",
            customRender: (value) => (
                <span
                    className={`px-2 py-1 rounded-full text-white flex text-nowrap ${
                        value === "terminée"
                            ? "bg-green-500/50"
                            : value === "en attente"
                            ? "bg-blue-500/50"
                            : "bg-red-500/50"
                    }`}
                >
                    {value}
                </span>
            ),
        },
        {
            key: "status_intervention",
            label: "Rapport",
            sortable: true,
            customRender: (value, row) => (
                <span
                    onClick={() =>
                        value === "terminée"
                            ? router.visit("/rapport", {
                                  data: { intervention_id: row.id },
                              })
                            : user.user_role?.name === "partenaire"
                            ? null
                            : handleNewRapport(row)
                    }
                    className={`px-2 py-1 rounded-full flex text-nowrap ${
                        user.user_role?.name === "partenaire" &&
                        value !== "terminée"
                            ? "cursor-default"
                            : "cursor-pointer"
                    } ${
                        value === "terminée"
                            ? "text-green-500"
                            : user.user_role?.name === "partenaire"
                            ? "text-gray-300"
                            : "text-blue-500"
                    }`}
                >
                    {value === "terminée"
                        ? "Consulter"
                        : user.user_role?.name === "partenaire"
                        ? "En attente"
                        : "Ajouter"}
                </span>
            ),
        },
        {
            key: "created_via",
            label: "Via",
            customRender: (row) => (
                <span className="text-xl font-medium text-gray-900 dark:text-white">
                    {row === "web" ? (
                        <TbWorldCheck />
                    ) : (
                        <RiTelegramFill className="text-blue-400" />
                    )}
                </span>
            ),
        },
    ];

    const actions = [
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

    const handleNewIntervention = () => {
        setOpen(true);
    };

    const handleNewRapport = (data) => {
        if (user.user_role?.name === "partenaire") {
            router.visit("/rapport", { data: { intervention_id: data.id } });
        } else {
            setOpenRapport(true);
            setDataRapport(data);
        }
    };

    const fetchDataDB = async () => {
        setIsLoading(true);
        const { data } = await getmaintenances();

        const intervention = data.map((el) => ({
            id: el.id,
            installation_id: el.installation_id,
            code_installation: el.installation.code_installation,
            nom:
                el.installation.client.nom +
                " " +
                el.installation.client.prenom,
            idclient: el.installation.client.id,
            type_intervention: el.type_intervention,
            description_probleme: el.description_probleme,
            status_intervention: el.status_intervention,
            date_intervention: formatdate(el.date_intervention),
            created_via: el.created_via,
        }));

        setMaintenances(intervention);
        setFilteredData(intervention);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDataDB();
    }, []);

    const onFiltredData = (value) => {
        setsearch(value);
        setCurrentPage(1);

        const filteredData = maintenances.filter(
            (el) =>
                el?.nom.toLowerCase().includes(value.toLowerCase()) ||
                el?.type_intervention
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.description_probleme
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.date_intervention
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.code_installation
                    .toLowerCase()
                    .includes(value.toLowerCase())
        );

        setFilteredData(filteredData);
    };

    const onCloseFormulaire = (message) => {
        fetchDataDB();
        message && setAlert({ ...alert, message, open: true });
        setDataToModify({});
    };

    const onCloseFormulaireRapport = (message) => {
        fetchDataDB();
        message && setAlert({ ...alert, message, open: true });
        setDataRapport({});
    };

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer l'intervention du ${item.nom} le ${item.date_intervention} ?`,
            id: item.id,
        });
    };

    const confirmDelete = async () => {
        const { message } = await deletemaintenances(suppression.id);
        setAlert({ ...alert, message, open: true });
        setSuppression({ ...suppression, open: false, id: 0 });
        fetchDataDB();
        setCurrentPage(1);
    };

    const editItem = (item) => {
        const interventionDate = item.date_intervention
            ? item.date_intervention
            : "Invalid date";
        setDataToModify({
            ...item,
            date_intervention: parsedate(interventionDate),
        });
        setOpen(true);
    };

    return (
        <AuthenticatedLayout setId={setid}>
            <Head title="Maintenance" />
            <HeaderPage
                search={search}
                onSearch={onFiltredData}
                title={`Liste des interventions ( Total: ${maintenances.length} )`}
                handleClick={handleNewIntervention}
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
            <FormulaireMaintenance
                open={open}
                setOpen={setOpen}
                dataModify={dataToModify}
                onCloseFormulaire={onCloseFormulaire}
                idTechnicien={id}
            />
            <FormulaireRapportMaintenance
                open={openRapport}
                setOpen={setOpenRapport}
                dataModify={dataRapport}
                onCloseFormulaire={onCloseFormulaireRapport}
                idTechnicien={id}
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
                            onItemsPerPageChange={(n) => setItemsPerPage(n)}
                        />
                    ) : (
                        <EmptyState nom="intervention" search={search} />
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default InterventionPage;
