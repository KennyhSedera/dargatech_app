import { createType_paiement } from '@/Services/TypePaiementService';
import { useForm } from '@inertiajs/react'
import React, { useRef, useState } from 'react'
import InputError from '../inputs/InputError';
import InputLabel from '../inputs/InputLabel';
import TextInput from '../inputs/TextInput';
import Snackbar from '../Snackbar';
import InputImage from '../inputs/InputImage';
import { validateFormTypePaiement } from '../validateForm';
import axios from 'axios';
import { url } from '@/Services/api';

const FormulaireTypePaiement = ({ reload = () => { } }) => {
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
    const [btnname, setbtnname] = useState('Ajouter');
    const [load, setload] = useState(false);

    const handleSubmit = async () => {
        if (!validateFormTypePaiement(data, setValidationErrors)) {
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('logo_path', data.logo_path);

        setload(true);
        setbtnname('Loading ...');

        try {
            const { data: response } = await axios.post(`${url}/type_paiement`, formData);
            setAlert({ open: true, message: response.message, type: 'success' });
        } catch (error) {
            console.error('Erreur:', error.response?.data || error.message);
        } finally {
            clearform();
        }
    };

    const onLoadFile = (file) => {
        setData({ ...data, logo_path: file });
    }

    const clearform = () => {
        reset();
        setbtnname('Ajouter');
        setload(false);
        setValidationErrors({});
        reload();
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
                    <InputLabel htmlFor="type_name" value="Nom" />
                    <TextInput id="type_name" isFocused={true} name="type_name" value={data.name} className="block w-full mt-1" autoComplete="type_name" onChange={(e) => setData('name', e.target.value)} required placeholder="Nom de la type" onFocus={() => setValidationErrors({ ...validationErrors, 'name': '' })} />
                    <InputError message={validationErrors.name || errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="logo_path" value="Logo" />
                    <InputImage ref={fileInputRef} selectedFile={data.logo_path} onLoadFile={onLoadFile} onFocus={() => setValidationErrors({ ...validationErrors, 'logo_path': '' })} />
                    <InputError message={validationErrors.logo_path || errors.logo_path} className="mt-2" />
                </div>
            </form>
            <div className='text-right'>
                <button className='w-auto px-4 py-1 mr-2 text-red-600 rounded-md bg-red-400/20 disabled:cursor-not-allowed' onClick={clearform}>Annuler</button>
                <button disabled={load} className='w-auto px-4 py-1 text-white bg-blue-500 rounded-md disabled:cursor-not-allowed disabled:opacity-10 ' onClick={handleSubmit}>{btnname}</button>
            </div>
        </div>
    )
}

export default FormulaireTypePaiement;
