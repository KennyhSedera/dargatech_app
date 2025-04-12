import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaGlobe, FaEllipsisV, FaEdit, FaTrash, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { deleteUser } from '../../Services/userService';
import Snackbar from '../Snackbar';
import ConfirmDialog from '../ConfirmDialog';
const PartenaireCard = ({ partenaire }) => {
  const {
    id,
    user_id,
    name,
    logo,
    email,
    adresse,
    ville,
    pays,
    telephone,
    siteWeb,
    categorie,
    description = "Partenaire commercial spécialisé dans les solutions technologiques",
    highlighted = false,
  } = partenaire;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    type: 'success'
  });


  // Générer une couleur de fond en fonction de la catégorie
  const getCategoryColor = (cat) => {
    const categories = {
      'Fournisseur': 'from-blue-500 to-indigo-600',
      'Client': 'from-green-500 to-emerald-600',
      'Partenaire': 'from-purple-500 to-violet-600',
      'Service': 'from-orange-500 to-amber-600',
      'Sponsor': 'from-red-500 to-rose-600'
    };
    return categories[cat] || 'from-gray-500 to-slate-600';
  };

  // Générer une couleur de badge en fonction de la catégorie
  const getCategoryBadgeColor = (cat) => {
    const categories = {
      'Fournisseur': 'bg-blue-600',
      'Client': 'bg-green-600',
      'Partenaire': 'bg-purple-600',
      'Service': 'bg-orange-600',
      'Sponsor': 'bg-red-600'
    };
    return categories[cat] || 'bg-gray-600';
  };

  const handleDelete = () => {
    setOpen(true);
  }

  const confirmDelete = () => {
    deleteUser(user_id).then(response => {
      if (response.success) {
        setAlert({ ...alert, open: true, message: 'Partenaire supprimé avec succès', type: 'success' });
      } else {
        setAlert({ ...alert, open: true, message: response.message, type: 'error' });
      }
    });
  }

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 
        hover:shadow-xl border ${highlighted ? 'border-yellow-400 dark:border-yellow-500' : 'border-gray-200 dark:border-gray-700'} 
        flex flex-col h-full transform hover:-translate-y-1 relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {setIsHovered(false); setIsMenuOpen(false);}}
    >

      {/* Confirmation de suppression */}
      <ConfirmDialog
        open={open}
        message="Voulez-vous vraiment supprimer ce partenaire ?"
        btnAcceptName='Supprimer'
        title='Suppression'
        btnAcceptColor='bg-red-500 text-white'
        close={() => setOpen(false)}
        accept={confirmDelete}
      />

      {/* Snackbar de confirmation */}
      <Snackbar
        show={alert.open}
        message="Partenaire supprimé avec succès"
        type='success'
        onClose={() => setAlert({ ...alert, open: false })}
      />

      {/* Indicateur partenaire en vedette */}
      {highlighted && (
        <div className="absolute top-2 left-2 z-10">
          <span className="flex items-center bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
            <FaStar className="mr-1" /> Partenaire privilégié
          </span>
        </div>
      )}
      
      {/* Menu d'options */}
      <div className="absolute top-2 right-2 z-10">
        <button 
          className={`p-2 rounded-full transition-colors`}
          onClick={handleDelete}
        >
          <FaTrash className="text-red-500 dark:text-red-600" />
        </button>
      </div> 
      
      {/* En-tête avec effet de gradient amélioré */}
      <div className="relative pb-6">
        {/* Bannière avec effet 3D et dynamique */}
        <div className={`h-24 bg-gradient-to-r ${getCategoryColor(categorie)} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] bg-repeat"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        {/* Logo avec ombre et effet de survol */}
        <div className="absolute top-8 left-20 transform -translate-x-1/2">
          <div className={`w-28 h-28 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-1.5 shadow-lg 
            transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
            {logo ? (
              <img 
                src={logo} 
                alt={`Logo ${name}`} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Badge catégorie avec couleur dynamique */}
        {categorie && (
          <div className="absolute top-3 right-12">
            <span className={`${getCategoryBadgeColor(categorie)} text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md`}>
              {categorie}
            </span>
          </div>
        )}
      </div>
      
      {/* Corps de la carte avec information et style améliorés */}
      <div className="p-6 pt-12 flex-grow">
        {/* name du partenaire */}
        <h3 className="absolute top-24 right-5 text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {name}
        </h3>
        
        {/* Description courte */}
        {/* <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
          {description}
        </p> */}
        
        {/* Séparateur stylisé */}
        <div className="flex items-center justify-center mb-4">
          {/* <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 mx-2"></div>
          <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700"></div> */}
        </div>

        {/* Informations de contact avec style amélioré */}
        <div className="space-y-3">
          {email && (
            <div className="flex items-center group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                <FaEnvelope />
              </div>
              <div className="ml-3 text-sm text-gray-700 dark:text-gray-300 truncate">
                {email}
              </div>
            </div>
          )}
          
          {adresse && (
            <div className="flex items-center group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors">
                <FaMapMarkerAlt />
              </div>
              <div className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                <div>{adresse}</div>
                {ville && pays && <div>{ville}, {pays}</div>}
              </div>
            </div>
          )}
          
          {telephone && (
            <div className="flex items-center group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors">
                <FaPhone />
              </div>
              <div className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {telephone}
              </div>
            </div>
          )}
          
          {siteWeb && (
            <div className="flex items-center group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30 transition-colors">
                <FaGlobe />
              </div>
              <div className="ml-3 text-sm text-gray-700 dark:text-gray-300 truncate">
              <a 
  href={siteWeb.startsWith('http') ? siteWeb : `https://${siteWeb}`} 
  target="_blank" 
  className="hover:text-blue-500" 
  rel="noopener noreferrer"
>
  {siteWeb}
</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartenaireCard;