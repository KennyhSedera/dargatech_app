import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { createPartenaire } from '@/Services/partenaireService';
import InputLabel from '@/Components/inputs/InputLabel';
import InputError from '@/Components/inputs/InputError';
import InputImage from '@/Components/inputs/InputImage';
import TextInput from '@/Components/inputs/TextInput';
import SelectInput from '@/Components/inputs/SelectInput';

const PartenaireFormulaire = ({
  open = true,
  setOpen,
  dataModify = {},
  onCloseFormulaire = () => { },
}) => {

  const { data, setData, errors, reset } = useForm({
    name: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    pays: '',
    site_web: '',
    categorie: 'Partenaire',
    description: '',
    highlighted: false,
    logo: null,
  });
  const [validationErrors, setValidationErrors] = useState(errors);
  const [load, setLoad] = useState(false);
  const [btnname, setBtnname] = useState('Ajouter');

  const onClose = (message) => {
    clearform();
    setOpen(false);
    onCloseFormulaire(message);
  }

  const clearform = () => {
    reset();
    setValidationErrors({});
  }

  const handleSelect = (item) => {
    setData('categorie', item.value);
  }

  const onLoadFile = (file) => {
    setData('logo', file);
  }

  const handleSubmit = async () => {
    setLoad(true);
    await submit();
  }
  const submit = async () => {
    if (errors.length > 0) {
      setValidationErrors(errors);
      return; // on stoppe tout ici si erreurs
    }
  
    setLoad(true);
  
    const formData = new FormData();
    const fields = [
      'name', 'email', 'password_confirmation', 'telephone', 
      'adresse', 'ville', 'pays', 'site_web', 'categorie', 'description'
    ];
  
    fields.forEach(field => {
      formData.append(field, data[field]);
    });
  
    formData.append('highlighted', data.highlighted ? '1' : '0');
  
    if (data.logo instanceof File) {
      formData.append('logo', data.logo);
    }
  
    try {
      const response = await createPartenaire(formData);
      if (response.status === 200) {
        onClose(response.data.message);
        clearform();
      }
    } catch (error) {
      console.error('Erreur lors de la création du partenaire:', error);
      setValidationErrors(error.response?.data?.errors || {});
    } finally {
      setLoad(false);
    }
  };
  

  return (
    <Modal show={open} closeable={false} onClose={onClose} maxWidth='xl'>
      <div className='text-2xl font-semibold text-center'>
        {dataModify.id ? 'Modifier un partenaire' : 'Ajouter un partenaire'}
      </div>
      <form className='grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2'>
        <div>
          <InputLabel htmlFor="name" value="Nom" />
          <TextInput id="name" name="name" value={data.name} className="block w-full mt-1" autoComplete="name" onChange={(e) => setData('name', e.target.value)} required placeholder="Nom du partenaire" onFocus={() => setValidationErrors({ ...validationErrors, 'name': '' })} />
          <InputError message={validationErrors.name || errors.name} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput id="email" name="email" value={data.email} className="block w-full mt-1" autoComplete="email" onChange={(e) => setData('email', e.target.value)} required placeholder="Email du partenaire" onFocus={() => setValidationErrors({ ...validationErrors, 'email': '' })} />
          <InputError message={validationErrors.email || errors.email} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="telephone" value="Téléphone" />
          <TextInput id="telephone" name="telephone" value={data.telephone} className="block w-full mt-1" autoComplete="telephone" onChange={(e) => setData('telephone', e.target.value)} required placeholder="Téléphone du partenaire" onFocus={() => setValidationErrors({ ...validationErrors, 'telephone': '' })} />
          <InputError message={validationErrors.telephone || errors.telephone} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="adresse" value="Adresse" />
          <TextInput id="adresse" name="adresse" value={data.adresse} className="block w-full mt-1" autoComplete="adresse" onChange={(e) => setData('adresse', e.target.value)} required placeholder="Adresse du partenaire" onFocus={() => setValidationErrors({ ...validationErrors, 'adresse': '' })} />
          <InputError message={validationErrors.adresse || errors.adresse} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="ville" value="Ville" />
          <TextInput id="ville" name="ville" value={data.ville} className="block w-full mt-1" autoComplete="ville" onChange={(e) => setData('ville', e.target.value)} required placeholder="Ville du partenaire" onFocus={() => setValidationErrors({ ...validationErrors, 'ville': '' })} />
          <InputError message={validationErrors.ville || errors.ville} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="pays" value="Pays" />
          <TextInput id="pays" name="pays" value={data.pays} className="block w-full mt-1" autoComplete="pays" onChange={(e) => setData('pays', e.target.value)} required placeholder="Pays du partenaire" onFocus={() => setValidationErrors({ ...validationErrors, 'pays': '' })} />
          <InputError message={validationErrors.pays || errors.pays} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="site_web" value="Site web" />
          <TextInput id="site_web" name="site_web" value={data.site_web} className="block w-full mt-1" autoComplete="site_web" onChange={(e) => setData('site_web', e.target.value)} required placeholder="Site web du partenaire" onFocus={() => setValidationErrors({ ...validationErrors, 'site_web': '' })} />
          <InputError message={validationErrors.site_web || errors.site_web} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="categorie" value="Catégorie" />
          <SelectInput
            id="categorie"
            name="categorie"
            value={data.categorie}
            className="block w-full mt-1"
            onChange={(e) => setData('categorie', e.target.value)}
            required
            onFocus={() => setValidationErrors({ ...validationErrors, 'categorie': '' })}
          >
            <option value="Fournisseur">Fournisseur</option>
            <option value="Partenaire">Partenaire</option>
            <option value="Service">Service</option>
            <option value="Sponsor">Sponsor</option>
            <option value="autre">Autre</option>
          </SelectInput>
          <InputError message={validationErrors.categorie || errors.categorie} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="description" value="Description" />
          <TextInput id="description" name="description" value={data.description} className="block w-full mt-1" autoComplete="description" onChange={(e) => setData('description', e.target.value)} required placeholder="Description du partenaire" onFocus={() => setValidationErrors({ ...validationErrors, 'description': '' })} />
          <InputError message={validationErrors.description || errors.description} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="logo" value="Logo" />
          <InputImage
            id="logo"
            name="logo"
            className="block w-full mt-1"
            onLoadFile={onLoadFile}
            required
            onFocus={() => setValidationErrors({ ...validationErrors, 'logo': '' })}
          />
          <InputError message={validationErrors.logo || errors.logo} className="mt-2" />
        </div>
      </form>
      <div className='text-right'>
        <button type="button" className='w-auto px-4 py-1 mr-2 text-red-600 rounded-md bg-red-400/20 disabled:cursor-not-allowed' onClick={() => onClose('')}>Annuler</button>
        <button type="button" disabled={load} className='w-auto px-4 py-1 text-white bg-blue-500 rounded-md disabled:cursor-not-allowed disabled:opacity-10' onClick={handleSubmit}>{load ? 'Chargement...' : btnname}</button>
      </div>
    </Modal>
  )
}

export default PartenaireFormulaire