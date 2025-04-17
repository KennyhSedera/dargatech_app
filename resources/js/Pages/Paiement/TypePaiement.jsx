import ConfirmDialog from '@/Components/ConfirmDialog';
import HeaderPage from '@/Components/HeaderPage';
import FormulaireTypePaiement from '@/Components/Paiement/FormulaireTypePaiement';
import Snackbar from '@/Components/Snackbar';
import { deleteType_paiement, getType_paiements } from '@/Services/TypePaiementService';
import React, { useEffect, useState } from 'react';
import { GoTrash } from 'react-icons/go';
import EmptyState from '@/Components/EmptyState';
import TypePaimentCard from '@/Components/TypePaimentCard';

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

    // Pagination logic
    const itemsPerPage = 8;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const Pagination = () => {
        return (
            <div className="flex justify-center mt-8">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    Précédent
                </button>
                <div className="flex items-center mx-4">
                    <span className="text-gray-700">
                        Page {currentPage} sur {totalPages || 1}
                    </span>
                </div>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-4 py-2 mx-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    Suivant
                </button>
            </div>
        );
    };

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                        {filteredData.length > 0 ? (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
                                    {currentItems.map((item) => (
                                        <TypePaimentCard
                                            key={item.id}
                                            item={item}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                                {totalPages > 1 && <Pagination />}
                            </div>
                        ) : (
                            <EmptyState nom='type de paiement' search={search} />
                        )}
                    </div>
                    <div className="sm:col-span-1">
                        <FormulaireTypePaiement
                            reload={() => getTypePaiementDB()}
                            dataToModify={dataToModify}
                            setDataToModify={setDataToModify}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default TypePaiement