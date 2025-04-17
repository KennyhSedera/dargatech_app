import ConfirmDialog from '@/Components/ConfirmDialog';
import DataTable from '@/Components/DataTable';
import HeaderPage from '@/Components/HeaderPage'
import FormulaireTypePaiement from '@/Components/Paiement/FormulaireTypePaiement';
import Snackbar from '@/Components/Snackbar';
import { deleteType_paiement, getType_paiements } from '@/Services/TypePaiementService';
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go';
import EmptyState from '@/Components/EmptyState';

const TypePaiement = () => {
    const [search, setsearch] = useState('');
    const [dataToModify, setDataToModify] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [typePaiements, setTypePaiements] = useState([]);
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
        { key: 'name', label: 'Nom' },
        {
            key: 'logo_path', label: 'logo', customRender: (value) => (
                <img src={value} alt="logo type" className="w-10 h-10 object-cover rounded-md" />
            )
        },
    ];

    const actions = [
        {
            label: <GoTrash className="text-base" />,
            color: 'text-red-500',
            hoverColor: 'text-red-600',
            handler: (row) => handleDelete(row),
        },
    ];
    const getTypePaiementDB = async () => {
        setIsLoading(true);
        try {
            const { type } = await getType_paiements();
            const datas = type.map(el => ({
                id: el.id,
                name: el.name,
                logo_path: el.logo_path,
            }))
            setTypePaiements(datas);
            setFilteredData(datas);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getTypePaiementDB();
    }, [])

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer la type de paiement par ${item.name} ?`,
            id: item.id
        });
    };

    const confirmDelete = async () => {
        const { message } = await deleteType_paiement(suppression.id);
        setAlert({ ...alert, message, open: true });
        setSuppression({ ...suppression, open: false, id: 0 });
        getTypePaiementDB();
        setCurrentPage(1);
    };

    const editItem = (item) => {
        setDataToModify({
            ...item
        });
    };

    const onFilteredData = (value) => {
        setsearch(value);
        setCurrentPage(1);

        const filteredData = typePaiements.filter(
            (el) =>
                el.name.toString().toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filteredData);
    }
    return (
        <div>
            <HeaderPage
                search={search}
                onSearch={onFilteredData}
                title='Liste des types de paiement'
                btn={false}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
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
                        <EmptyState nom='type de paiement' search={search} />
                    }
                </div>
                <div className="sm:col-span-1">
                    <FormulaireTypePaiement reload={() => getTypePaiementDB()} />
                </div>
            </div>
            )}
        </div>
    )
}

export default TypePaiement
