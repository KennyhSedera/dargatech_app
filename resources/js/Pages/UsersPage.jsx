import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useEffect, useState } from 'react'
import { getUsers } from '@/Services/userService'
import { Head } from '@inertiajs/react'
import { FaUserCircle, FaEnvelope, FaPhone, FaTrash, FaEllipsisV, FaMapMarkerAlt } from 'react-icons/fa'
import HeaderPage from '@/Components/HeaderPage'
import { nodata2 } from '@/constant'

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  return (
    <AuthenticatedLayout>
      <Head title="Users" />
      <HeaderPage
        title="Liste des utilisateurs"
        onSearch={handleSearch}
        search={search}
        btn={false}
      />
      <div className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className='flex justify-center'>
              <img src={nodata2} alt="no data" className='max-w-md mt-2 opacity-50' />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  {/* Card Header with Gradient Background */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-700 opacity-90"></div>
                    <div className="relative pt-4 pb-14 px-6 flex justify-between items-start">
                      <h3 className="text-xl font-bold text-white">{user.name}</h3>
                      <div className="relative">
                        <button className="p-2 text-white hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Profile Image - Overlapping Style */}
                    <div className="absolute -bottom-12 left-6">
                      <div className="h-24 w-24 rounded-xl shadow-md overflow-hidden border-4 border-white dark:border-gray-800">
                        {user.profile?.photo || user.technicien?.photo || user.partenaire?.logo ? (
                          <img
                            src={user.profile?.photo || user.technicien?.photo || user.partenaire?.logo}
                            alt={`${user.name}'s profile`}
                            className="h-full w-full object-cover bg-gray-100 dark:bg-gray-900"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                            <FaUserCircle className="text-4xl text-gray-400 dark:text-gray-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="pt-14 px-6 pb-6">
                    <div className="mt-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white">
                        {user.user_role.name}
                      </span>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-center text-sm">
                        <FaEnvelope className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-gray-800 dark:text-gray-200">{user.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaPhone className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-gray-800 dark:text-gray-200">{user.technicien?.contact || user.profile?.contact || user.partenaire?.telephone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-gray-800 dark:text-gray-200">{user.technicien?.adress || user.profile?.adress || user.partenaire?.adresse}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default UsersPage