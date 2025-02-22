import { createType_paiement } from '@/Services/TypePaiementService';
import { useForm } from '@inertiajs/react'
import React, { useRef, useState } from 'react'
import InputError from '../inputs/InputError';
import InputLabel from '../inputs/InputLabel';
import TextInput from '../inputs/TextInput';
import Snackbar from '../Snackbar';
import InputImage from '../inputs/InputImage';
import { validateFormTypePaiement } from '../validateForm';

const FormulaireTypePaiement = () => {
    const { data, setData, errors, reset } = useForm({
        name: '',
        logo_path: null,
    });
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        type: 'success'
    });
    const [validationErrors, setValidationErrors] = useState({});
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSubmit = async () => {
        setData({ ...data, logo_path: selectedFile })
        if (!validateFormTypePaiement(data, setValidationErrors)) {
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('logo_path', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/api/type_paiement', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur de validation :", errorData);
                setValidationErrors(errorData.errors || {});
                return;
            }

            const result = await response.json();
            setAlert({ open: true, message: result.message, type: 'success' });
            clearform();
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            setAlert({ open: true, message: 'Échec de l\'envoi du formulaire.', type: 'error' });
        }
    };

    const clearform = () => {
        reset();
        setSelectedFile(null);
        setValidationErrors({});
    }

    return (
        <div className='w-full p-4 mt-4 bg-white rounded-lg shadow-sm dark:bg-gray-800'>
            <Snackbar
                message={alert.message}
                type={alert.type}
                duration={3000}
                position="top-right"
                show={alert.open}
                onClose={() => setAlert({ ...alert, message: '', open: false })}
            />
            <div className='text-lg font-semibold text-center'>Nouveau</div>
            <form className='grid w-full grid-cols-1 gap-2 mb-4'>
                <div>
                    <InputLabel htmlFor="name" value="Nom" />
                    <TextInput id="name" name="name" value={data.name} className="block w-full mt-1" autoComplete="name" onChange={(e) => setData('name', e.target.value)} required placeholder="Nom de la type" />
                    <InputError message={validationErrors.name || errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="logo_path" value="Logo" />
                    <InputImage ref={fileInputRef} setSelectedFile={setSelectedFile} selectedFile={selectedFile} />
                    <InputError message={validationErrors.logo_path || errors.logo_path} className="mt-2" />
                </div>
            </form>
            <div className='text-right'>
                <button className='w-auto px-4 py-1 mr-2 text-red-600 rounded-md bg-red-400/20 disabled:cursor-not-allowed' onClick={clearform}>Annuler</button>
                <button className='w-auto px-4 py-1 text-white bg-blue-500 rounded-md disabled:cursor-not-allowed ' onClick={handleSubmit}>Ajouter</button>
            </div>
        </div>
    )
}

export default FormulaireTypePaiement;
