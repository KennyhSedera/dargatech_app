import Alertformulaire from '@/Components/alert/AlertFormulaire'
import ConfirmDialog from '@/Components/ConfirmDialog'
import DataTable from '@/Components/DataTable'
import HeaderPage from '@/Components/HeaderPage'
import Snackbar from '@/Components/Snackbar'
import { formatdate, nodata2 } from '@/constant'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { deleteAlert, getAlerts } from '@/Services/alertService'
import { Head } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go'

const AlertPage = () => {
    const [open, setopen] = useState(false);
    const [search, setsearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [alerts, setalerts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
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
        { key: 'id', label: 'Id' },
        { key: 'code', label: 'Code Iins' },
        { key: 'nom', label: 'Nom client' },
        { key: 'message', label: 'Profondeur du forage (m)' },
        {
            key: 'resolue', label: 'Statut', customRender: (value) => (
                <div className='w-auto text-white flex text-nowrap cursor-pointer'>
                    <span className={`px-2 py-1 rounded-full ${value ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                        {value ? 'Résolut' : 'En attente'}
                    </span>
                </div>
            )
        },
        { key: 'createdAt', label: 'Date d\'alert' },
    ];

    const actions = [
        {
            label: <GoTrash className="text-base" />,
            color: 'text-red-500',
            hoverColor: 'text-red-600',
            handler: (row) => handleDelete(row),
        },
    ];

    const onsearch = (value) => {
        setsearch(value);
        setCurrentPage(1);

        const filteredData = alerts.filter(
            (el) =>
                el.nom.toLowerCase().includes(value.toLowerCase()) ||
                el.message.toLowerCase().includes(value.toLowerCase()) ||
                el.code.toLowerCase().includes(value.toLowerCase()) ||
                el.created_at.toString().toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filteredData);
    }

    const fetchDataDB = async () => {
        const { data } = await getAlerts();
        const values = data.map(el => ({
            ...el,
            nom: `${el.client.nom} ${el.client.prenom}`,
            code: el.installation.code_installation,
            createdAt: formatdate(el.created_at)
        }))
        setalerts(values);
        setFilteredData(values);
    }

    useEffect(() => {
        fetchDataDB();
    }, [])

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer l'alert du ${item.client.nom} le ${item.createdAt} ?`,
            id: item.id
        });
    };

    const confirmDelete = async () => {
        const { message } = await deleteAlert(suppression.id);
        setAlert({ ...alert, message, open: true });
        setSuppression({ ...suppression, open: false, id: 0 });
        fetchDataDB();
        setCurrentPage(1);
    };

    const handleOpen = () => {
        setopen(true);
    }

    const onCloseFormulaire = (message) => {
        setopen(false);
        fetchDataDB();
        message && setAlert({ open: true, message, type: 'success' });
    }

    return (
        <AuthenticatedLayout>
            <Head title='Alerts' />
            <HeaderPage
                handleClick={handleOpen}
                title='Liste des alerts'
                search={search}
                onSearch={onsearch}
            />
            <Alertformulaire
                setOpen={setopen}
                open={open}
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
            <div>
                {filteredData.length > 0 ? <DataTable
                    headers={headers}
                    rows={filteredData}
                    itemsPerPage={10}
                    actions={actions}
                    className="mt-4"
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    masqueColumns={['client_id']}
                /> :
                    <div className='flex justify-center'>
                        <img src={nodata2} alt="no data" className='max-w-md opacity-50 mt-2' />
                    </div>
                }
            </div>
        </AuthenticatedLayout>
    )
}

export default AlertPage
