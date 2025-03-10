import ConfirmDialog from '@/Components/ConfirmDialog'
import DataTable from '@/Components/DataTable'
import PaiementFormulaire from '@/Components/Paiement/PaiementFormulaire'
import Snackbar from '@/Components/Snackbar'
import { formatdate, nodata2, parsedate } from '@/constant'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { deletePaiement, getPaiements } from '@/Services/PaiementService'
import { Head } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go'
import { TbEdit } from 'react-icons/tb'
import TypePaiement from './TypePaiement'
import HeaderPage from '@/Components/HeaderPage'

const PaiementPage = () => {
    const [search, setsearch] = useState('');
    const [dataToModify, setDataToModify] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [paiements, setPaiements] = useState([]);
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
    const [isType, setIsType] = useState(false);
    const [id, setId] = useState(false);

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'nom', label: 'Nom client' },
        { key: 'montant', label: 'Montant ($)' },
        { key: 'type_paiement', label: 'Mode de paiement' },
        { key: 'periode_couverte', label: 'Periode couverte' },
        { key: 'date_paiement', label: 'Date de paiement' },
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

    const handleNewPaiement = () => {
        setOpen(true);
    }

    const getPaiementDB = async () => {
        try {
            const { data } = await getPaiements();
            const datas = data.map(el => ({
                id: el.id,
                client_id: el.client_id,
                nom: `${el.client.nom} ${el.client.prenom}`,
                montant: el.montant,
                type_paiement: el.type_paiement.name,
                mode_paiement: el.mode_paiement,
                periode_couverte: el.periode_couverte,
                date_paiement: formatdate(el.date_paiement),
            }))
            setPaiements(datas);
            setFilteredData(datas);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPaiementDB();
    }, [])

    const onFilteredData = (value) => {
        setsearch(value);

        setCurrentPage(1);

        const filtered = paiements.filter(
            (el) =>
                el.nom.toLowerCase().includes(value.toLowerCase()) ||
                el.montant.toLowerCase().includes(value.toLowerCase()) ||
                el.type_paiement.toLowerCase().includes(value.toLowerCase()) ||
                el.periode_couverte.toLowerCase().includes(value.toLowerCase()) ||
                el.mode_paiement.toLowerCase().includes(value.toLowerCase()) ||
                el.date_paiement.toString().toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filtered);
    }

    const onCloseFormulaire = (message) => {
        getPaiementDB();
        message && setAlert({ ...alert, message, open: true });
        setDataToModify({});
    }

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer la paiement du ${item.nom} le ${item.date_paiement} ?`,
            id: item.id
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
        const paiementDate = item.date_paiement ? item.date_paiement : 'Invalid date';
        setDataToModify({
            ...item,
            date_paiement: parsedate(paiementDate)
        });
        setOpen(true);
    };

    return (
        <AuthenticatedLayout setId={setId}>
            <Head title='Paiements' />
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
            {!id && <span className='flex items-center w-40 p-1 mb-2 border border-gray-300 rounded-md dark:border-gray-700'>
                <div
                    onClick={() => setIsType(false)}
                    className={`w-1/2 cursor-pointer text-center py-1 rounded-md text-sm transition-colors duration-300 ${!isType ? 'bg-gray-300 dark:bg-gray-700' : 'bg-transparent'}`}
                >
                    Tous
                </div>
                <div
                    onClick={() => setIsType(true)}
                    className={`w-1/2 cursor-pointer text-center py-1 rounded-md text-sm transition-colors duration-300 ${isType ? 'bg-gray-300 dark:bg-gray-700' : 'bg-transparent'}`}
                >
                    Types
                </div>
            </span>}
            {!isType ?
                <div>
                    <HeaderPage
                        title='Liste des Paiements'
                        handleClick={handleNewPaiement}
                        search={search}
                        onSearch={onFilteredData}
                    />
                    {filteredData.length > 0 ?
                        <DataTable
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
                </div> :
                <TypePaiement />
            }
        </AuthenticatedLayout>
    )
}

export default PaiementPage
