import React from 'react'
import { GoTrash } from 'react-icons/go'

const TypePaimentCard = ({ item, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-white dark:border-gray-800 rounded-lg relative shadow-md">
      <div className="absolute right-2 top-2">
        <button
          onClick={() => onDelete(item)}
          className="p-2 text-red-500 rounded-full bg-red-100 transition-colors"
        >
          <GoTrash className="text-lg" />
        </button>
      </div>
      <div className="h-40 w-full bg-gray-100 dark:bg-gray-900 rounded-t-lg overflow-hidden">
        {item.logo_path ? (
          <img 
            src={item.logo_path} 
            alt={`Logo ${item.name}`} 
            className="h-full w-full object-cover" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            No Logo
          </div>
        )}
      </div>
      <div className="text-center p-4 font-semibold">{item.name}</div>
    </div>
  )
}

export default TypePaimentCard