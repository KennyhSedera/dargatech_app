import { createPaiement, updatePaiement } from '@/Services/PaiementService';
import React, { useEffect, useState, useCallback } from 'react';
import { getClients } from '@/Services/clientService';
import TextInput from '../inputs/TextInput';
import InputLabel from '../inputs/InputLabel';
import InputError from '../inputs/InputError';
import { getType_paiements } from '@/Services/TypePaiementService';
import { useForm } from '@inertiajs/react';
import Modal from '../Modal';
import InputAutocomplete from '../inputs/InputAutocomplete ';
import { validateFormPaiement } from '../validateForm';
import { formatDate } from '@/constant';

const PaiementFormulaire = ({
    open = true,
    setOpen,
    dataModify = {},
    onCloseFormulaire = () => { },
}) => {
    const [btnTitle, setBtnTitle] = useState('Enregistrer');
    const [validationErrors, setValidationErrors] = useState({});
    const [load, setLoad] = useState(false);
    const [clients, setClients] = useState([]);
    const [typePaiement, setTypePaiement] = useState([]);
    const { data, setData, errors, reset } = useForm({
        client_id: '',
        montant: '',
        date_paiement: new Date().toISOString().split('T')[0],
        mode_paiement: '',
        periode_couverte: '',
        receipt_path: '',
    });

    const getClient = async () => {
        try {
            const [{ clients }, type] = await Promise.all([getClients(), getType_paiements()]);
            setClients(clients?.map(el => ({ id: el.id, nom: `${el.nom} ${el.prenom}` })));
            setTypePaiement(type.type?.map(el => ({ id: el.id, nom: el.name })));
        } catch (error) {
            console.error('Error fetching clients or payment types:', error);
        }
    };

    const updateFormData = useCallback(() => {
        if (dataModify.id) {
            setData({
                client_id: dataModify.client_id || '',
                montant: dataModify.montant || '',
                date_paiement: formatDate(dataModify.date_paiement) || new Date().toISOString().split('T')[0],
                mode_paiement: parseInt(dataModify.mode_paiement) || '',
                periode_couverte: dataModify.periode_couverte || '',
                receipt_path: dataModify.receipt_path || '',
            });
            setBtnTitle('Modifier');
        } else {
            clearForm();
        }
    }, [dataModify, setData]);

    const onClose = (message) => {
        setOpen(false);
        clearForm();
        onCloseFormulaire(message);
    };

    const clearForm = () => {
        reset();
        setBtnTitle('Enregistrer');
        setValidationErrors({});
    };

    useEffect(() => {
        getClient();
    }, []);

    useEffect(() => {
        updateFormData();
    }, [dataModify, updateFormData]);

    const submit = async () => {
        if (!validateFormPaiement(data, setValidationErrors)) {
            return;
        }

        setLoad(true);
        setBtnTitle('Loading ...');

        try {
            let message;
            if (btnTitle === 'Enregistrer') {
                ({ message } = await createPaiement(data));
            } else {
                ({ message } = await updatePaiement(dataModify.id, data));
            }
            onClose(message);
        } catch (error) {
            console.error('Error submitting payment:', error);
        } finally {
            setLoad(false);
            setBtnTitle('Enregistrer');
        }
    };

    const handleSelect = (item) => {
        setData('client_id', item.id);
    };

    const handleSelectType = (item) => {
        setData('mode_paiement', item.id);
    };

    return (
        <Modal show={open} closeable={false} onClose={onClose} maxWidth="xl">
            <div className="text-2xl font-semibold text-center">
                {dataModify.nom ? 'Modifier un Paiement' : 'Ajouter un Paiement'}
            </div>
            <form className="grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="client_id" value="Nom client" />
                    <InputAutocomplete data={clients} isFocused={true} className="block w-full mt-1" onSelect={handleSelect} defaultValue={data.client_id} onFocus={() => setValidationErrors({ ...validationErrors, 'client_id': '' })} />
                    <InputError message={validationErrors.client_id || errors.client_id} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="montant" value="Montant ($)" />
                    <TextInput id="montant" name="montant" value={data.montant} className="block w-full mt-1" autoComplete="montant" onChange={(e) => setData('montant', e.target.value)} required type="number"
                        onFocus={() => setValidationErrors({ ...validationErrors, 'montant': '' })} />
                    <InputError message={validationErrors.montant || errors.montant} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="mode_paiement" value="Mode paiement" />
                    <InputAutocomplete data={typePaiement} className="block w-full mt-1" onSelect={handleSelectType} defaultValue={data.mode_paiement} onFocus={() => setValidationErrors({ ...validationErrors, 'mode_paiement': '' })} />
                    <InputError message={validationErrors.mode_paiement || errors.mode_paiement} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="periode_couverte" value="Période couverte" />
                    <TextInput id="periode_couverte" name="periode_couverte" value={data.periode_couverte} className="block w-full mt-1" autoComplete="periode_couverte" onChange={(e) => setData('periode_couverte', e.target.value)} required onFocus={() => setValidationErrors({ ...validationErrors, 'periode_couverte': '' })} />
                    <InputError message={validationErrors.periode_couverte || errors.periode_couverte} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="date_paiement" value="Date de paiement" />
                    <TextInput id="date_paiement" name="date_paiement" value={data.date_paiement} className="block w-full mt-1" autoComplete="date_paiement" type="date" onChange={(e) => setData('date_paiement', e.target.value)} required onFocus={() => setValidationErrors({ ...validationErrors, 'date_paiement': '' })} />
                    <InputError message={validationErrors.date_paiement || errors.date_paiement} className="mt-2" />
                </div>
            </form>
            <div className="flex items-center justify-end gap-4 px-1">
                <button type="button" className="px-4 py-1 text-red-500 rounded-md bg-red-400/10" onClick={() => onClose('')}>
                    Fermer
                </button>
                <button type="submit" className={`disabled:cursor-not-allowed rounded-md py-1 px-4 bg-blue-500 text-white ${load && 'opacity-25'}`} disabled={load} onClick={submit}>
                    {btnTitle}
                </button>
            </div>
        </Modal>
    );
};

export default PaiementFormulaire;
