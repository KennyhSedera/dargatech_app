import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import TextInput from '../inputs/TextInput';
import InputLabel from '../inputs/InputLabel';
import { useForm } from '@inertiajs/react';
import InputError from '../inputs/InputError';
import { validateFormInstalation } from '../validateForm';
import { createinstallations, getinstallations, updateinstallations } from '@/Services/installationService';
import InputAutocomplete from '../inputs/InputAutocomplete ';
import { getClients } from '@/Services/clientService';
import { formatDate, incrementCodeInstallation } from '@/constant';
import SelectInput from '../inputs/SelectInput';

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
        numero_serie: '',
        code_installation: '',
        source_eau: 'Puits',
        hmt: '',
    });

    const getClient = async () => {
        const [{ clients }, installation] = await Promise.all([getClients(), getinstallations()]);
        const clientFormat = clients.map(el => ({
            id: el.id,
            nom: el.nom + ' ' + el.prenom,
        }));

        const maxCode = installation.data.reduce((max, el) => {
            const currentNumber = parseInt(el.code_installation.replace(/\D/g, ''), 10);
            return currentNumber > max ? currentNumber : max;
        }, 0);

        const newCode = `${incrementCodeInstallation('I' + String(maxCode).padStart(4, '0'))}`;

        setClients(clientFormat);
        if (!dataModify.id) {
            setData('code_installation', newCode);
        }

    }

    const onClose = (message) => {
        setOpen(false);
        clearForm();
        onCloseFormulaire(message);
    };

    const clearForm = () => {
        setData({
            client_id: 0,
            date_installation: new Date().toISOString().split('T')[0],
            puissance_pompe: '',
            profondeur_forage: '',
            debit_nominal: '',
            numero_serie: '',
            code_installation: 'I0001',
            source_eau:'Puits',
            hmt:''
        });
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
                numero_serie: dataModify.numero_serie || '',
                code_installation: dataModify.code_installation || '',
                source_eau: dataModify.source_eau || '',
                hmt: dataModify.hmt || '',
            });
            setBtnTitle('Modifier');
        } else {
            clearForm();
        }
    }, [dataModify, setData]);

    const submit = async () => {
        if (btnTitle ==='Enregistrer' && !validateFormInstalation(data, setValidationErrors)) {
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
            clearForm();
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
                        isFocused={true}
                        defaultValue={data.client_id ?? 0}
                        onFocus={() => setValidationErrors({ ...validationErrors, 'client_id': '' })}
                    />
                    <InputError message={validationErrors.client_id || errors.client_id} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="numero_serie" value="Numéro de série de la pompe" />
                    <TextInput
                        id="numero_serie"
                        name="numero_serie"
                        value={data.numero_serie}
                        className="block w-full mt-1"
                        autoComplete="numero_serie"
                        onChange={(e) => setData('numero_serie', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'numero_serie': '' })}
                    />
                    <InputError message={validationErrors.numero_serie || errors.numero_serie} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="source_eau" value="Source d'eau" />
                    <SelectInput
                        id="source_eau"
                        type="source_eau"
                        name="source_eau"
                        value={data.source_eau}
                        className="block w-full mt-1"
                        autoComplete="source_eau"
                        onChange={(e) => setData('source_eau', e.target.value)}
                        required
                    >
                        <option value="Puits">Puits</option>
                        <option value="Forage">Forage</option>
                        <option value="Etang">Etang</option>
                        <option value="Barrage">Barrage</option>
                        <option value="Puits">Rivière</option>
                    </SelectInput>
                    <InputError message={validationErrors.source_eau || errors.source_eau} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="hmt" value="HMT (m)" />
                    <TextInput
                        id="hmt"
                        name="hmt"
                        value={data.hmt}
                        className="block w-full mt-1"
                        autoComplete="hmt"
                        onChange={(e) => setData('hmt', e.target.value)}
                        required
                        type='number'
                        onFocus={() => setValidationErrors({ ...validationErrors, 'hmt': '' })}
                    />
                    <InputError message={validationErrors.hmt || errors.hmt} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="profondeur_forage" value="Distance maximale pompe champ PV (m)" />
                    <TextInput
                        id="profondeur_forage"
                        name="profondeur_forage"
                        value={data.profondeur_forage}
                        className="block w-full mt-1"
                        autoComplete="profondeur_forage"
                        onChange={(e) => setData('profondeur_forage', e.target.value)}
                        required
                        type='number'
                        onFocus={() => setValidationErrors({ ...validationErrors, 'profondeur_forage': '' })}
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
                        onFocus={() => setValidationErrors({ ...validationErrors, 'debit_nominal': '' })}
                    />
                    <InputError message={validationErrors.debit_nominal || errors.debit_nominal} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="puissance_pompe" value="Puissance crête installé (W)" />
                    <TextInput
                        id="puissance_pompe"
                        name="puissance_pompe"
                        value={data.puissance_pompe ?? 0}
                        className="block w-full mt-1"
                        autoComplete="puissance_pompe"
                        onChange={(e) => setData('puissance_pompe', e.target.value)}
                        required
                        type='number'
                        onFocus={() => setValidationErrors({ ...validationErrors, 'puissance_pompe': '' })}
                    />
                    <InputError message={validationErrors.puissance_pompe || errors.puissance_pompe} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="date_installation" value="Date de l'installation" />
                    <TextInput
                        id="date_installation"
                        name="date_installation"
                        value={data.date_installation}
                        className="block w-full mt-1"
                        autoComplete="date_installation"
                        type='date'
                        onChange={(e) => setData('date_installation', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'date_installation': '' })}
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
