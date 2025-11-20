import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import { deleteUser, getUsers } from "@/Services/userService";
import { Head } from "@inertiajs/react";
import HeaderPage from "@/Components/HeaderPage";
import Snackbar from "@/Components/Snackbar";
import ConfirmDialog from "@/Components/ConfirmDialog";
import UserCard from "@/Components/users/UserCard";
import EmptyState from "@/Components/EmptyState";
import AdminFormulaire from "@/Components/users/AdminFormulaire";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteForm, setDeleteForm] = useState({
        open: false,
        message: "",
        id: 0,
    });
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success",
    });
    const [open, setopen] = useState(false);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (value) => {
        setSearch(value);
        const filtered = users.filter(
            (user) =>
                user?.name?.toLowerCase().includes(value.toLowerCase()) ||
                user?.email?.toLowerCase().includes(value.toLowerCase()) ||
                user?.technicien?.contact
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                user?.technicien?.adress
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                user?.user_role.name
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                user?.profile?.adress
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                user?.profile?.contact
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                user?.partenaire?.telephone
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                user?.partenaire?.adresse
                    ?.toLowerCase()
                    .includes(value.toLowerCase()) ||
                user?.partenaire?.site_web
                    ?.toLowerCase()
                    .includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const closeForm = (mess) => {
        if (mess) {
            setAlert({
                open: true,
                message: mess,
                type: "success",
            });
        }
        setopen(false);
        fetchUsers();
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "/path/to/default-avatar.png";
    };

    const handleDelete = (id) => {
        setDeleteForm({
            open: true,
            message: "Voulez-vous vraiment supprimer cet utilisateur ?",
            id: id,
        });
    };

    const confirmDeleteUser = async () => {
        const response = await deleteUser(deleteForm.id);
        if (response.success) {
            setAlert({
                ...alert,
                open: true,
                message: "Utilisateur supprimé avec succès",
                type: "success",
            });
            setDeleteForm({ ...deleteForm, open: false });
            fetchUsers();
        } else {
            setAlert({
                ...alert,
                open: true,
                message: response.message,
                type: "error",
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            <HeaderPage
                title={`Liste des utilisateurs ( Total: ${users.length} )`}
                onSearch={handleSearch}
                search={search}
                handleClick={() => setopen(true)}
            />
            <ConfirmDialog
                open={deleteForm.open}
                message={deleteForm.message}
                btnAcceptName="Supprimer"
                title="Suppression"
                btnAcceptColor="bg-red-500 text-white"
                accept={confirmDeleteUser}
                close={() =>
                    setDeleteForm({ ...deleteForm, open: false, id: 0 })
                }
            />
            <AdminFormulaire closeForm={closeForm} open={open} />
            <Snackbar
                message={alert.message}
                type={alert.type}
                duration={3000}
                position="top-right"
                show={alert.open}
                onClose={() => setAlert({ ...alert, message: "", open: false })}
            />
            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <EmptyState nom="utilisateur" search={search} />
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {filteredUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    handleDelete={handleDelete}
                                    handleImageError={handleImageError}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UsersPage;
