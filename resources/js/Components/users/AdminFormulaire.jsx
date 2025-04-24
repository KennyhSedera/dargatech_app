import React, { useState } from 'react'
import Modal from '../Modal'
import { useForm } from '@inertiajs/react';
import InputLabel from '../inputs/InputLabel';
import TextInput from '../inputs/TextInput';
import InputError from '../inputs/InputError';
import axios from 'axios';

const AdminFormulaire = ({
  open,
  closeForm,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [load, setLoad] = useState(false);

  const { data, setData, errors, reset, setErrors } = useForm({
    name: '',
    email: '',
    contact: '',
    adress: ''
  });

  const onClose = (message) => {
    closeForm(message);
    clearForm();
  }

  const clearForm = () => {
    reset();
    setValidationErrors({});  
    setLoad(false);
  }

  const validateForm = (data, setValidationErrors) => {
    const errors = {};
    if (!data.name) {
      errors.name = 'Le nom est obligatoire';
    }
    if (!data.email) {
      errors.email = 'L\'email est obligatoire';
    }
    if (!data.contact) {
      errors.contact = 'Le contact est obligatoire';
    }
    if (!data.adress) {
      errors.adress = 'L\'adresse est obligatoire';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const submit = () => {
    if (!validateForm(data, setValidationErrors)) {
      return;
    }

    setLoad(true);
    axios.post('create/admin', data)
      .then((response) => {
        setLoad(false);
        onClose(response.data.message);
      })
      .catch((error) => {
        setLoad(false);
        if (error.response && error.response.data) {
          setValidationErrors(error.response.data.errors || {});
        }
      })
  }

  return (
    <Modal
      show={open}
      maxWidth='xl'
      onClose={() => onClose('')}
      closeable={false}
    >
      <div className='text-center font-semibold text-2xl'>
        Créer un Administrateur
      </div>
      <form className='w-full my-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <InputLabel htmlFor="name" value="Nom" />
          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            isFocused={true}
            onChange={(e) => setData('name', e.target.value)}
            required
            onFocus={() => setValidationErrors({ ...validationErrors, 'name': '' })}
          />
          <InputError message={validationErrors.name || errors.name} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="email"
            onChange={(e) => setData('email', e.target.value)}
            required
            onFocus={() => setValidationErrors({ ...validationErrors, 'email': '' })}
          />
          <InputError message={validationErrors.email || errors.email} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="contact" value="Contact" />
          <TextInput
            id="contact"
            name="contact"
            value={data.contact}
            className="mt-1 block w-full"
            autoComplete="contact"
            type='number'
            onChange={(e) => setData('contact', e.target.value)}
            required
            onFocus={() => setValidationErrors({ ...validationErrors, 'contact': '' })}
          />
          <InputError message={validationErrors.contact || errors.contact} className="mt-2" />
        </div>
        <div>
          <InputLabel htmlFor="adress" value="adress" />
          <TextInput
            id="adress"
            name="adress"
            value={data.adress}
            className="mt-1 block w-full"
            autoComplete="adress"
            onChange={(e) => setData('adress', e.target.value)}
            required
            onFocus={() => setValidationErrors({ ...validationErrors, 'adress': '' })}
          />
          <InputError message={validationErrors.adress || errors.adress} className="mt-2" />
        </div>
      </form>
      <div className='flex items-center justify-end gap-4 px-1'>
        <button
          type="button"
          className='rounded-md py-1 px-4 text-red-500 bg-red-400/10'
          onClick={() => onClose('')}
        >
          Fermer
        </button>
        <button
          type="submit"
          className={`disabled:cursor-not-allowed rounded-md py-1 px-4 bg-blue-500 text-white ${load && 'opacity-25'}`}
          disabled={load}
          onClick={submit}
        >
          Enregistrer
        </button>
      </div>
    </Modal>
  )
}

export default AdminFormulaire