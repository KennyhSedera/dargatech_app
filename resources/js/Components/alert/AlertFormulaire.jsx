import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import { useForm } from '@inertiajs/react';
import { validateFormAlert } from '../validateForm';
import InputError from '../inputs/InputError';
import InputLabel from '../inputs/InputLabel';
import TextInput from '../inputs/TextInput';
import InputAutocomplete from '../inputs/InputAutocomplete ';
import { getClientInstalations } from '@/Services/clientService';
import { createAlert } from '@/Services/alertService';

const Alertformulaire = ({
    open = true,
    setOpen,
    dataModify = {},
    onCloseFormulaire = () => { },
}) => {
    const [btnTitle, setBtnTitle] = useState('Enregistrer');
    const [load, setLoad] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [clients, setClients] = useState([]);
    const [installations, setinstallations] = useState([]);
    const { data, setData, errors, reset } = useForm({
        client_id: 0,
        message: '',
        type_alert: '',
        installation_id: 0,
    });

    const onClose = (message) => {
        setOpen(false);
        clearForm();
        onCloseFormulaire(message);
    };

    const clearForm = () => {
        reset();
        setLoad(false);
        setBtnTitle('Enregistrer');
        setValidationErrors({});
    };

    const fetchDataDB = async () => {
        const { clients } = await getClientInstalations();
        const data = clients.map(el => ({
            id: el.id,
            nom: `${el.nom} ${el.prenom}`,
            installations: el.installations
        }))
        setClients(data.filter(el => el.installations.length > 0))
    }

    useEffect(() => {
        fetchDataDB();
    }, [])

    const submit = async () => {
        if (!validateFormAlert(data, setValidationErrors)) {
            return;
        }

        setLoad(true);
        setBtnTitle('Chargement...');

        try {
            let message;
            if (btnTitle === 'Enregistrer') {
                ({ message } = await createAlert(data));
            }
            onClose(message);
        } catch (error) {
            console.error('Error submitting alert:', error);
        } finally {
            clearForm();
        }
    };

    const handleSelect = (item) => {
        setData('client_id', item.id);
        const data = item.installations.map(el => ({
            id: el.id,
            nom: el.code_installation
        }))
        setinstallations(data);
    };

    const handleSelectInstallation = (item) => {
        setData('installation_id', item.id);
    };

    return (
        <Modal
            show={open}
            onClose={onClose}
            closeable={false}
            role="dialog"
            aria-labelledby="modal-title"
            maxWidth='xl'
        >
            <div className='text-2xl font-semibold text-center'>
                {dataModify.nom ? 'Modifier une alert' : 'Ajouter une alert'}
            </div>
            <form className='grid w-full gap-4 my-6 sm:grid-cols-2'>
                <div className='w-full'>
                    <InputLabel htmlFor="client_id" value="Nom client" />
                    <InputAutocomplete
                        data={clients}
                        className="block w-full mt-1"
                        onSelect={handleSelect}
                        isFocused={true}
                        defaultValue={data.client_id ?? 0}
                        onFocus={() => setValidationErrors({ ...validationErrors, 'client_id': '' })}
                    />
                    <InputError message={validationErrors.client_id || errors.client_id} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="type_alert" value="Type d'alert" />
                    <TextInput
                        id="type_alert"
                        name="type_alert"
                        value={data.type_alert ?? ''}
                        className="block w-full mt-1"
                        autoComplete="type_alert"
                        onChange={(e) => setData('type_alert', e.target.value)}
                        required
                        type='text'
                        onFocus={() => setValidationErrors({ ...validationErrors, 'type_alert': '' })}
                    />
                    <InputError message={validationErrors.type_alert || errors.type_alert} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="message" value="Message" />
                    <TextInput
                        id="message"
                        name="message"
                        value={data.message ?? ''}
                        className="block w-full mt-1"
                        autoComplete="message"
                        onChange={(e) => setData('message', e.target.value)}
                        required
                        type='text'
                        onFocus={() => setValidationErrors({ ...validationErrors, 'message': '' })}
                    />
                    <InputError message={validationErrors.message || errors.message} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="installation_id" value="Code installation" />
                    <InputAutocomplete
                        data={installations}
                        className="block w-full mt-1"
                        onSelect={handleSelectInstallation}
                        defaultValue={data.installation_id ?? 0}
                        onFocus={() => setValidationErrors({ ...validationErrors, 'installation_id': '' })}
                    />
                    <InputError message={validationErrors.installation_id || errors.installation_id} className="mt-2" />
                </div>
            </form>
            <div className='flex items-center justify-end gap-4 px-1'>
                <button type="button" className='px-4 py-1 text-red-500 rounded-md bg-red-400/10' onClick={() => onClose('')}>
                    Fermer
                </button>
                <button type="submit" className={`rounded-md py-1 px-4 disabled:cursor-not-allowed bg-blue-500 text-white ${load && 'opacity-25'}`} disabled={load} onClick={submit}>
                    {btnTitle}
                </button>
            </div>
        </Modal>
    )
}

export default Alertformulaire
