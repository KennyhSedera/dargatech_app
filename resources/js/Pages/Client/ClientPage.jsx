import FormulaireClient from '@/Components/clients/FormulaireClient';
import ConfirmDialog from '@/Components/ConfirmDialog';
import DataTable from '@/Components/DataTable';
import EmptyState from '@/Components/EmptyState';
import HeaderPage from '@/Components/HeaderPage';
import Snackbar from '@/Components/Snackbar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { deleteClients, getClients } from '@/Services/clientService';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { TbEdit } from 'react-icons/tb';

const ClientPage = () => {
    const [search, setSearch] = useState('');
    const [openFormulaire, setOpenFormulaire] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [clients, setClients] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dataToEdit, setDataToEdit] = useState({});
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

    const fetchClients = async () => {
        setIsLoading(true);
        const data = await getClients();
        const clients = data.clients.map(el => ({
            id: el.id,
            nom: el.nom,
            prenom: el.prenom,
            CIN: el.CIN,
            email: el.email,
            telephone: el.telephone,
            localisation: el.localisation,
            surface_cultivee: el.surface_cultivee,
            type_activite_agricole: el.type_activite_agricole
        }));

        setClients(clients);
        setFilteredData(clients);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const onFiltredData = (value) => {
        setSearch(value);
        setCurrentPage(1);

        const filteredData = clients.filter(
            (el) =>
                el.nom.toLowerCase().includes(value.toLowerCase()) ||
                el.prenom.toLowerCase().includes(value.toLowerCase()) ||
                el.telephone.toLowerCase().includes(value.toLowerCase()) ||
                el.surface_cultivee.toLowerCase().includes(value.toLowerCase()) ||
                el.type_activite_agricole.toLowerCase().includes(value.toLowerCase()) ||
                el.localisation.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filteredData);
    };

    const handleNewClient = () => {
        setOpenFormulaire(true);
    };

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'nom', label: 'Nom' },
        { key: 'prenom', label: 'Prénom' },
        { key: 'CIN', label: 'CIN' },
        { key: 'email', label: 'Email' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'localisation', label: 'Localisation' },
        { key: 'surface_cultivee', label: 'Surface cultivée (ha)' },
        { key: 'type_activite_agricole', label: 'Type d\'activité agricole' },
    ];

    const actions = [
        {
            label: <FaEye className="text-base" />,
            color: 'text-green-500',
            hoverColor: 'text-green-600',
            handler: (row) => ShowDetail(row.id),
        },
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

    const onCloseFormulaire = (message) => {
        fetchClients();
        message && setAlert({ ...alert, message, open: true });
        setDataToEdit({});
    }

    const editItem = (item) => {
        setDataToEdit(item);
        setOpenFormulaire(true);
    }

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer ${item.nom} ${item.prenom}?`,
            id: item.id
        });
    };

    const confirmDelete = async () => {
        const { message } = await deleteClients(suppression.id);
        setAlert({ ...alert, message, open: true });
        setSuppression({ ...suppression, open: false, id: 0 });
        fetchClients();
        setCurrentPage(1);
    };

    const ShowDetail = async (id) => {
        router.visit(`/client/${id}`);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Maraîchers" />
            <HeaderPage
                title="Liste des Maraîchers"
                handleClick={handleNewClient}
                onSearch={onFiltredData}
                search={search}
            />
            <FormulaireClient
                setOpen={setOpenFormulaire}
                open={openFormulaire}
                dataModify={dataToEdit}
                onCloseFormulaire={onCloseFormulaire}
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
                        itemsPerPage={10}
                        actions={actions}
                        className="mt-4"
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    /> :
                    <EmptyState nom='maraîcher' search={search} />
                }
            </div>
            )}
        </AuthenticatedLayout>
    );
};

export default ClientPage;
