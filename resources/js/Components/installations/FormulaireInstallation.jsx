import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import TextInput from '../inputs/TextInput';
import InputLabel from '../inputs/InputLabel';
import { useForm } from '@inertiajs/react';
import InputError from '../inputs/InputError';
import { validateFormInstalation } from '../clients/validateForm';
import { createinstallations, updateinstallations } from '@/Services/installationService';
import InputAutocomplete from '../inputs/InputAutocomplete ';
import { getClients } from '@/Services/clientService';
import { formatDate } from '@/constant';

const FormulaireInstallation = ({
    open = true,
    setOpen,
    dataModify = {},
    onCloseFormulaire = () => { },
}) => {
    const [btnTitle, setBtnTitle] = useState('Enregistrer');
    const [load, setLoad] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [clients, setClients] = useState([]);
    const { data, setData, errors, reset } = useForm({
        client_id: 0,
        date_installation: new Date().toISOString().split('T')[0],
        puissance_pompe: '',
        profondeur_forage: '',
        debit_nominal: '',
        surface_panneaux: '',
    });

    const getClient = async () => {
        const { clients } = await getClients();
        const clientFormat = clients.map(el => ({
            id: el.id,
            nom: el.nom + ' ' + el.prenom,
        }));
        setClients(clientFormat)
    }

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

    useEffect(() => {
        getClient();
        if (dataModify.id) {
            setData({
                client_id: dataModify.client_id || 0,
                date_installation: formatDate(dataModify.date_installation) || new Date().toISOString().split('T')[0],
                puissance_pompe: dataModify.puissance_pompe || '',
                profondeur_forage: dataModify.profondeur_forage || '',
                debit_nominal: dataModify.debit_nominal || '',
                surface_panneaux: dataModify.surface_panneaux || '',
            });
            setBtnTitle('Modifier');
        } else {
            clearForm();
        }
    }, [dataModify, setData]);

    const submit = async () => {
        if (!validateFormInstalation(data, setValidationErrors)) {
            return;
        }

        setLoad(true);
        setBtnTitle('Chargement...');

        try {
            let message;
            if (btnTitle === 'Enregistrer') {
                ({ message } = await createinstallations(data));
            } else {
                ({ message } = await updateinstallations(dataModify.id, data));
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

    return (
        <Modal show={open} closeable={false} onClose={onClose} maxWidth='xl'>
            <div className='text-2xl font-semibold text-center'>
                {dataModify.nom ? 'Modifier une Installation' : 'Ajouter une Installation'}
            </div>
            <form className='grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2'>
                <div>
                    <InputLabel htmlFor="client_id" value="Nom client" />
                    <InputAutocomplete
                        data={clients}
                        className="block w-full mt-1"
                        onSelect={handleSelect}
                        defaultValue={data.client_id}
                    />
                    <InputError message={validationErrors.client_id || errors.client_id} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="puissance_pompe" value="Puissance du pompe (W)" />
                    <TextInput
                        id="puissance_pompe"
                        name="puissance_pompe"
                        value={data.puissance_pompe}
                        className="block w-full mt-1"
                        autoComplete="puissance_pompe"
                        onChange={(e) => setData('puissance_pompe', e.target.value)}
                        required
                        type='number'
                    />
                    <InputError message={validationErrors.puissance_pompe || errors.puissance_pompe} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="profondeur_forage" value="Profondeur du forage (m)" />
                    <TextInput
                        id="profondeur_forage"
                        name="profondeur_forage"
                        value={data.profondeur_forage}
                        className="block w-full mt-1"
                        autoComplete="profondeur_forage"
                        onChange={(e) => setData('profondeur_forage', e.target.value)}
                        required
                        type='number'
                    />
                    <InputError message={validationErrors.profondeur_forage || errors.profondeur_forage} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="debit_nominal" value="Débit nominal (m³/h)" />
                    <TextInput
                        id="debit_nominal"
                        name="debit_nominal"
                        value={data.debit_nominal}
                        className="block w-full mt-1"
                        autoComplete="debit_nominal"
                        onChange={(e) => setData('debit_nominal', e.target.value)}
                        required
                        type='number'
                    />
                    <InputError message={validationErrors.debit_nominal || errors.debit_nominal} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="surface_panneaux" value="Surface des panneaux solaires (m²)" />
                    <TextInput
                        id="surface_panneaux"
                        name="surface_panneaux"
                        value={data.surface_panneaux}
                        className="block w-full mt-1"
                        autoComplete="surface_panneaux"
                        onChange={(e) => setData('surface_panneaux', e.target.value)}
                        required
                        type='number'
                    />
                    <InputError message={validationErrors.surface_panneaux || errors.surface_panneaux} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="date_installation" value="Date d'installation" />
                    <TextInput
                        id="date_installation"
                        name="date_installation"
                        value={data.date_installation}
                        className="block w-full mt-1"
                        autoComplete="date_installation"
                        type='date'
                        onChange={(e) => setData('date_installation', e.target.value)}
                        required
                    />
                    <InputError message={validationErrors.date_installation || errors.date_installation} className="mt-2" />
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
    );
};

export default FormulaireInstallation;
