import ConfirmDialog from "@/Components/ConfirmDialog";
import EmptyState from "@/Components/EmptyState";
import HeaderPage from "@/Components/HeaderPage";
import Snackbar from "@/Components/Snackbar";
import TechnicienCard from "@/Components/technicien/TechnicienCard";
import TechnicienFormulaire from "@/Components/technicien/TechnicienFormulaire";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    deleteTechniciens,
    getTechniciens,
} from "@/Services/technicienService";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const Technicien = () => {
    const [search, setSearch] = useState("");
    const [open, setopen] = useState(false);
    const [techniciens, setTechniciens] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
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

    const fetchTechnicien = async () => {
        setIsLoading(true);
        const { data } = await getTechniciens();

        const technichien = data.map((el) => ({
            id: el.technicien.id,
            name: el.name,
            email: el.email,
            genre: el.technicien.genre,
            contact: el.technicien.contact,
            adress: el.technicien.adress,
            speciality: el.technicien.speciality,
            photo: el.technicien.photo,
            telegram_username: el.technicien.telegram_username,
            bot_active: el.technicien.bot_active,
        }));

        setTechniciens(technichien);
        setFilteredData(technichien);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTechnicien();
    }, []);

    const onFiltered = (value) => {
        setSearch(value);
        setCurrentPage(1);

        const data = techniciens.filter(
            (el) =>
                el?.name?.toLowerCase().includes(value.toLowerCase()) ||
                el?.email?.toLowerCase().includes(value.toLowerCase()) ||
                el?.speciality?.toLowerCase().includes(value.toLowerCase()) ||
                el?.contact
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.telegram_username
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                el?.adress?.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(data);
    };

    const onCloseFormulaire = (message) => {
        fetchTechnicien();
        message && setAlert({ ...alert, message, open: true });
    };

    const showDetail = (id) => {
        // Handle view detail functionality
        console.log("View details for ID:", id);
    };

    const handleDelete = (item) => {
        setSuppression({
            open: true,
            message: `Êtes-vous sûr de vouloir supprimer le technicien ${item.name} ?`,
            id: item.id,
        });
    };

    const confirmDelete = async () => {
        const { message } = await deleteTechniciens(suppression.id);
        setAlert({ ...alert, message, open: true });
        setSuppression({ ...suppression, open: false, id: 0 });
        fetchTechnicien();
        setCurrentPage(1);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const pageNumbers = [];
    const maxPagesToShow = 5;

    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Technicien" />
            <HeaderPage
                handleClick={() => setopen(true)}
                title={`Liste des Techniciens ( Total: ${techniciens.length} )`}
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
                <div className="flex flex-col items-center justify-center h-64 p-8 rounded-xl">
                    <div className="w-12 h-12 mb-4 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {filteredData.length > 0 ? (
                        <div className="mt-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {currentItems.map((technician) => (
                                    <TechnicienCard
                                        key={technician.id}
                                        technician={technician}
                                        onDelete={handleDelete}
                                        onView={showDetail}
                                    />
                                ))}
                            </div>

                            {/* Enhanced Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="flex items-center px-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            className={`mx-1 p-2 rounded-md ${
                                                currentPage === 1
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-indigo-50"
                                            }`}
                                            title="Première page"
                                        >
                                            &laquo;
                                        </button>

                                        <button
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className={`mx-1 p-2 rounded-md ${
                                                currentPage === 1
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-indigo-50"
                                            }`}
                                            title="Page précédente"
                                        >
                                            &lsaquo;
                                        </button>

                                        {/* Page numbers */}
                                        {pageNumbers.map((number) => (
                                            <button
                                                key={number}
                                                onClick={() =>
                                                    setCurrentPage(number)
                                                }
                                                className={`mx-1 w-9 h-9 flex items-center justify-center rounded-md ${
                                                    currentPage === number
                                                        ? "bg-indigo-600 text-white font-medium"
                                                        : "text-gray-700 hover:bg-indigo-50"
                                                }`}
                                            >
                                                {number}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className={`mx-1 p-2 rounded-md ${
                                                currentPage === totalPages
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-indigo-50"
                                            }`}
                                            title="Page suivante"
                                        >
                                            &rsaquo;
                                        </button>

                                        <button
                                            onClick={() =>
                                                setCurrentPage(totalPages)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className={`mx-1 p-2 rounded-md ${
                                                currentPage === totalPages
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-indigo-50"
                                            }`}
                                            title="Dernière page"
                                        >
                                            &raquo;
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyState nom="technicien" search={search} />
                    )}
                </>
            )}
        </AuthenticatedLayout>
    );
};

export default Technicien;
