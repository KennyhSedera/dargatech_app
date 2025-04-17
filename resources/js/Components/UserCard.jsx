import React from 'react'
import { FaTrash, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa' 

const UserCard = ({user, handleDelete, handleImageError}) => {
  return (
    <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-700 opacity-90"></div>
        <div className="relative pt-4 pb-14 px-6 flex justify-between items-start">
          <h3 className="text-xl font-bold text-white">{user.name}</h3>
          <div className="relative">
            {user.user_role.name !== 'admin' && <button onClick={() => handleDelete(user.id)} className="p-2 text-white hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-colors">
              <FaTrash />
            </button>}
          </div>
        </div>

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
  )
}

export default UserCard