import ConfirmDialog from '@/Components/ConfirmDialog'
import DataTable from '@/Components/DataTable'
import HeaderPage from '@/Components/HeaderPage'
import Snackbar from '@/Components/Snackbar'
import TechnicienFormulaire from '@/Components/technicien/TechnicienFormulaire'
import { nodata2 } from '@/constant'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { deleteTechniciens, getTechniciens } from '@/Services/technicienService'
import { Head } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { GoTrash } from 'react-icons/go'

const Technicien = () => {
    const [search, setSearch] = useState('');
    const [open, setopen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [techniciens, setTechniciens] = useState([]);
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
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nom technichien' },
        { key: 'email', label: 'Adresse email' },
        { key: 'genre', label: 'Sexe' },
        { key: 'contact', label: 'Contact' },
        { key: 'adress', label: 'Adresse local' },
        { key: 'speciality', label: 'Spécialité' },
    ];

    const actions = [
        {
            label: <FaEye className="text-base" />,
            color: 'text-green-500',
            hoverColor: 'text-green-600',
            handler: (row) => showDetail(row.id),
        },
        {
            label: <GoTrash className="text-base" />,
            color: 'text-red-500',
            hoverColor: 'text-red-600',
            handler: (row) => handleDelete(row),
        },
    ];

    const fetchTechnicien = async () => {
        const { data } = await getTechniciens();

        const technichien = data.map(el => ({
            id: el.technicien.id,
            name: el.name,
            email: el.email,
            genre: el.genre,
            contact: el.technicien.contact,
            adress: el.technicien.adress,
            speciality: el.technicien.speciality,
        }));

        setTechniciens(technichien);
        setFilteredData(technichien);
    };

    useEffect(() => {
        fetchTechnicien();
    }, []);

    const onFiltered = (value) => {
        setSearch(value);
        setCurrentPage(1);

        const data = techniciens.filter(el =>
            el.name.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(data);
    }

    const onCloseFormulaire = (message) => {
        fetchTechnicien();
        message && setAlert({ ...alert, message, open: true });
    }

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer le technicien ${item.name} ?`,
            id: item.id
        });
    };

    const confirmDelete = async () => {
        const { message } = await deleteTechniciens(suppression.id);
        setAlert({ ...alert, message, open: true });
        setSuppression({ ...suppression, open: false, id: 0 });
        fetchTechnicien();
        setCurrentPage(1);
    };

    return (
        <AuthenticatedLayout>
            <Head title='Technicien' />
            <HeaderPage
                handleClick={() => setopen(true)}
                title='Liste des Techniciens'
                search={search}
                onSearch={onFiltered}
            />
            <TechnicienFormulaire
                open={open}
                setOpen={setopen}
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
            </div>
        </AuthenticatedLayout>
    )
}

export default Technicien;
