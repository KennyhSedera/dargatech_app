import React, { useState, useEffect } from 'react';
import HeaderPage from '@/Components/HeaderPage';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PartenaireCard from '@/Components/PartenaireCard';
import { getPartenaires } from '@/Services/partenaireService';
import PartenaireFormulaire from '@/Components/partenaire/PartenaireFormulaire';
import Snackbar from '@/Components/Snackbar';
import { nodata2 } from '@/constant';

const PartenairePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partenaires, setPartenaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    message: '',
    type: 'success',
    open: false,
  });

  useEffect(() => {
    getPartenaires().then(setPartenaires).finally(() => setIsLoading(false));
  }, []);

  console.log(partenaires);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAlert = (message, type) => {
    setAlert({
      message,
      type,
      open: true,
    });
  };

  const onCloseFormulaire = (message) => {
    if (message) {
      handleAlert(message, 'success');
    }
    setOpen(false);
  };

  const data = partenaires.map(partenaire => ({
    id: partenaire.id,
    name: partenaire.user.name,
    logo: partenaire.logo,
    email: partenaire.user.email,
    adresse: partenaire.adresse,
    ville: partenaire.ville,
    pays: partenaire.pays,
    telephone: partenaire.telephone,
    siteWeb: partenaire.site_web,
    categorie: partenaire.categorie,
    description: partenaire.description,
    highlighted: partenaire.highlighted,
  }));

  // Filtrer les partenaires en fonction du terme de recherche
  const filteredPartenaires = data.filter(partenaire =>
    partenaire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.telephone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.siteWeb.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthenticatedLayout>
      <Head title='Partenaires' />
      <HeaderPage
        title='Liste des partenaires'
        handleClick={() => setOpen(true)}
        onSearch={handleSearch}
        search={searchTerm}
      />

      <PartenaireFormulaire
        open={open}
        setOpen={setOpen}
        onCloseFormulaire={onCloseFormulaire}
      />

      <Snackbar
        message={alert.message}
        type={alert.type}
        duration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        position="top-right"
        show={alert.open}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className='w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-12'>
          {filteredPartenaires.length > 0 ? (
            filteredPartenaires.map(partenaire => (
              <PartenaireCard key={partenaire.id} partenaire={partenaire} />
            ))
          ) : (
            <div className='flex justify-center'>
              <img src={nodata2} alt="no data" className='max-w-md mt-2 opacity-50' />
            </div>
          )}
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default PartenairePage;