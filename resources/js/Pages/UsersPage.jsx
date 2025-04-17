import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useEffect, useState } from 'react'
import { deleteUser, getUsers } from '@/Services/userService'
import { Head } from '@inertiajs/react'
import HeaderPage from '@/Components/HeaderPage'
import Snackbar from '@/Components/Snackbar'
import ConfirmDialog from '@/Components/ConfirmDialog'
import UserCard from '@/Components/UserCard'
import EmptyState from '@/Components/EmptyState'

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteForm, setDeleteForm] = useState({
    open: false,
    message: '',
    btnAcceptName: '',
    title: '',
    btnAcceptColor: '',
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.technicien?.contact.toLowerCase().includes(value.toLowerCase()) ||
      user.technicien?.adress.toLowerCase().includes(value.toLowerCase()) ||
      user.user_role.name.toLowerCase().includes(value.toLowerCase()) ||
      user.profile?.adress.toLowerCase().includes(value.toLowerCase()) ||
      user.profile?.contact.toLowerCase().includes(value.toLowerCase()) ||
      user.partenaire?.name.toLowerCase().includes(value.toLowerCase()) ||
      user.partenaire?.email.toLowerCase().includes(value.toLowerCase()) ||
      user.partenaire?.telephone.toLowerCase().includes(value.toLowerCase()) ||
      user.partenaire?.adress.toLowerCase().includes(value.toLowerCase()) ||
      user.partenaire?.site_web.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Function to handle image errors and provide fallback
  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = '/path/to/default-avatar.png'
  }

  const handleDelete = (id) => {
    setDeleteForm({
      open: true,
      message: 'Voulez-vous vraiment supprimer cet utilisateur ?',
      btnAcceptName: 'Supprimer',
      title: 'Suppression',
      btnAcceptColor: 'bg-red-500 text-white',
    });
    deleteUser(id).then(response => {
      if (response.success) {
        setAlert({ ...alert, open: true, message: 'Utilisateur supprimé avec succès', type: 'success' });
        setDeleteForm({ ...deleteForm, open: false });
        fetchUsers();
      } else {
        setAlert({ ...alert, open: true, message: response.message, type: 'error' });
      }
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Users" />
      <HeaderPage
        title="Liste des utilisateurs"
        onSearch={handleSearch}
        search={search}
        btn={false}
      />
      <ConfirmDialog
        open={deleteForm.open}
        message={deleteForm.message}
        btnAcceptName={deleteForm.btnAcceptName}
        title={deleteForm.title}
        btnAcceptColor={deleteForm.btnAcceptColor}
        close={deleteForm.close}
        accept={deleteForm.accept}
      />
      <Snackbar
        open={alert.open}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, open: false })}
      />
      <div className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState nom='utilisateur' search={search} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} handleDelete={handleDelete} handleImageError={handleImageError} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default UsersPage