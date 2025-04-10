import ConfirmDialog from '@/Components/ConfirmDialog';
import DataTable from '@/Components/DataTable';
import HeaderPage from '@/Components/HeaderPage'
import FormulaireMaintenance from '@/Components/maintenances/FormulaireMaintenance';
import FormulaireRapportMaintenance from '@/Components/maintenances/FormulaireRapportMaintenance';
import Snackbar from '@/Components/Snackbar';
import { formatdate, nodata2, parsedate } from '@/constant';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { deletemaintenances, getmaintenances } from '@/Services/maintenanceService';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go';
import { TbEdit } from 'react-icons/tb';

const InterventionPage = () => {
    const [search, setsearch] = useState('');
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
        message: '',
        id: 0,
    });
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        type: 'success'
    });

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'code_installation', label: 'Installation' },
        { key: 'nom', label: 'Client' },
        { key: 'type_intervention', label: 'Type' },
        { key: 'description_probleme', label: 'Problème' },
        { key: 'date_intervention', label: 'Date d\'intervenir' },
        {
            key: 'status_intervention', label: 'Statuts', customRender: (value) => (
                <span className={`px-2 py-1 rounded-full text-white flex text-nowrap ${value === 'terminée' ? 'bg-green-500/50' : value === 'en attente' ? 'bg-blue-500/50' : 'bg-red-500/50'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'status_intervention', label: 'Rapport', customRender: (value, row) => (
                <span onClick={() => value === 'terminée' ? router.visit('/rapport', { data: { intervention_id: row.id } }) : handleNewRapport(row)}
                    className={`px-2 py-1 rounded-full flex text-nowrap cursor-pointer ${value === 'terminée' ? 'text-green-500' : 'text-blue-500'}`}>
                    {value === 'terminée' ? 'Consulter' : 'Ajouter'}
                </span>
            )
        },
    ];

    const actions = [
        {
            label: <TbEdit className="text-lg" />,
            color: 'text-blue-500',
            hoverColor: 'text-blue-600',
            handler: (row) => editItem(row),
        },
        {
            label: <GoTrash className="text-base" />,
            color: 'text-red-500',
            hoverColor: 'text-red-600',
            handler: (row) => handleDelete(row),
        },
    ];

    const handleNewIntervention = () => {
        setOpen(true)
    }

    const handleNewRapport = (data) => {
        setOpenRapport(true);
        setDataRapport(data);
    }

    const fetchDataDB = async () => {
        setIsLoading(true);
        const { data } = await getmaintenances();

        const intervention = data.map(el => ({
            id: el.id,
            installation_id: el.installation_id,
            code_installation: el.installation.code_installation,
            nom: el.installation.client.nom + ' ' + el.installation.client.prenom,
            idclient: el.installation.client.id,
            type_intervention: el.type_intervention,
            description_probleme: el.description_probleme,
            status_intervention: el.status_intervention,
            date_intervention: formatdate(el.date_intervention),
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
                el.nom.toLowerCase().includes(value.toLowerCase()) ||
                el.type_intervention.toLowerCase().includes(value.toLowerCase()) ||
                el.description_probleme.toLowerCase().includes(value.toLowerCase()) ||
                el.date_intervention.toString().toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filteredData);
    };

    const onCloseFormulaire = (message) => {
        fetchDataDB();
        message && setAlert({ ...alert, message, open: true });
        setDataToModify({});
    }

    const onCloseFormulaireRapport = (message) => {
        fetchDataDB();
        message && setAlert({ ...alert, message, open: true });
        setDataRapport({});
    }

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer l'intervention du ${item.nom} le ${item.date_intervention} ?`,
            id: item.id
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
        const interventionDate = item.date_intervention ? item.date_intervention : 'Invalid date';
        setDataToModify({
            ...item,
            date_intervention: parsedate(interventionDate)
        });
        setOpen(true);
    };

    return (
        <AuthenticatedLayout setId={setid}>
            <Head title='Maintenance' />
            <HeaderPage
                search={search}
                onSearch={onFiltredData}
                title='Liste des interventions'
                handleClick={handleNewIntervention}
            />
            <Snackbar
                message={alert.message}
                type={alert.type}
                duration={3000}
                position="top-right"
                show={alert.open}
                onClose={() => setAlert({ ...alert, message: '', open: false })}
            />
            <ConfirmDialog
                open={suppression.open}
                message={suppression.message}
                btnAcceptName='Supprimer'
                title='Suppression'
                btnAcceptColor='bg-red-500 text-white'
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
            <div>
                {filteredData.length > 0 ?
                    <DataTable
                        headers={headers}
                        rows={filteredData}
                        itemsPerPage={6}
                        actions={actions}
                        className="mt-4"
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        masqueColumns={['client_id']}
                    /> :
                    <div className='flex justify-center'>
                        <img src={nodata2} alt="no data" className='max-w-md mt-2 opacity-50' />
                    </div>
                }
                </div>
            )}
        </AuthenticatedLayout>
    )
}

export default InterventionPage;
