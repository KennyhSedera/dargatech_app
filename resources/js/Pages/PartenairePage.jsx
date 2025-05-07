import React, { useState, useEffect } from 'react';
import HeaderPage from '@/Components/HeaderPage';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PartenaireCard from '@/Components/partenaire/PartenaireCard';
import { getPartenaires } from '@/Services/partenaireService';
import PartenaireFormulaire from '@/Components/partenaire/PartenaireFormulaire';
import Snackbar from '@/Components/Snackbar';
import EmptyState from '@/Components/EmptyState';

const PartenairePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partenaires, setPartenaires] = useState([]);
  const [filteredPartenaires, setFilteredPartenaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    message: '',
    type: 'success',
    open: false,
  });

  const findAllPartenaires = async () => {
    const response = await getPartenaires();
    const data = response.map(partenaire => ({
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
      user_id: partenaire.user_id,
      created_at: partenaire.created_at,
      updated_at: partenaire.updated_at,
    }));
    setPartenaires(data);
    setFilteredPartenaires(data);
    setIsLoading(false);
  }

  useEffect(() => {
    findAllPartenaires();
  }, []);

  const handleAlert = (message, type) => {
    setAlert({
      message,
      type,
      open: true,
    });
  };

  const onCloseFormulaire = (message) => {
    setOpen(false);
    if (message) {
      handleAlert(message, 'success');
    }
    findAllPartenaires();
  };

  const onClose  = (message) => {
    setOpen(false);
    if (message) {
      handleAlert(message, 'success');
    }
    findAllPartenaires();
  };

  // Filtrer les partenaires en fonction du terme de recherche
  const onFiltredData = (value) => {
    setSearchTerm(value);

    const filteredData = partenaires.filter(
        (el) =>
            el.name.toLowerCase().includes(value.toLowerCase()) ||
            el.email.toLowerCase().includes(value.toLowerCase()) ||
            el.categorie.toLowerCase().includes(value.toLowerCase()) ||
            el.description.toLowerCase().includes(value.toLowerCase()) ||
            el.adresse.toLowerCase().includes(value.toLowerCase()) ||
            el.ville.toLowerCase().includes(value.toLowerCase()) ||
            el.pays.toLowerCase().includes(value.toLowerCase()) ||
            el.telephone.toLowerCase().includes(value.toLowerCase()) ||
            el.siteWeb.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPartenaires(filteredData);
};

  return (
    <AuthenticatedLayout>
      <Head title='Partenaires' />
      <HeaderPage
        title='Liste des partenaires'
        handleClick={() => setOpen(true)}
        onSearch={onFiltredData}
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
        <div>
          {filteredPartenaires.length > 0 ? (
            <div className='w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-12'>
              {filteredPartenaires.map(partenaire => (
                <PartenaireCard key={partenaire.id} partenaire={partenaire} onClose={onClose} />
              ))}
            </div>
          ) : (
            <EmptyState nom='partenaire' search={searchTerm} />
          )}
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default PartenairePage;