import React, { useEffect, useState, useCallback } from 'react';
import Modal from '../Modal';
import TextInput from '../inputs/TextInput';
import InputLabel from '../inputs/InputLabel';
import { useForm } from '@inertiajs/react';
import InputError from '../inputs/InputError';
import { validateFormInstalation } from '../validateForm';
import { createinstallations, getinstallations, updateinstallations } from '@/Services/installationService';
import InputAutocomplete from '../inputs/InputAutocomplete ';
import { getClients } from '@/Services/clientService';
import { formatDate } from '@/constant';
import SelectInput from '../inputs/SelectInput';
import { getLocationDetails } from '@/utils/geoLocationUtils';

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
    const [locationLoading, setLocationLoading] = useState(false);

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
        latitude: '',
        longitude: '',
        pays: '',
        ville: '',
        statuts: 'installée'
    });

    // Memoized function to generate next installation code
    const generateNextInstallationCode = useCallback((installations) => {
        if (!installations || installations.length === 0) {
            return 'I0001';
        }

        const maxCode = installations.reduce((max, el) => {
            const match = el.code_installation?.match(/I(\d+)/);
            if (match) {
                const currentNumber = parseInt(match[1], 10);
                return currentNumber > max ? currentNumber : max;
            }
            return max;
        }, 0);

        const nextNumber = maxCode + 1;
        return `I${String(nextNumber).padStart(4, '0')}`;
    }, []);

    const getClient = useCallback(async () => {
        try {
            const [{ clients }, installation] = await Promise.all([
                getClients(),
                getinstallations()
            ]);

            const clientFormat = clients.map(el => ({
                id: el.id,
                nom: `${el.nom} ${el.prenom}`,
            }));

            const newCode = generateNextInstallationCode(installation.data);

            setClients(clientFormat);
            if (!dataModify.id) {
                setData('code_installation', newCode);
            }
        } catch (error) {
            console.error('Error fetching clients and installations:', error);
        }
    }, [dataModify.id, setData, generateNextInstallationCode]);

    const onClose = useCallback((message) => {
        setOpen(false);
        clearForm();
        onCloseFormulaire(message);
    }, [setOpen, onCloseFormulaire]);

    const clearForm = useCallback(() => {
        setData({
            client_id: 0,
            date_installation: new Date().toISOString().split('T')[0],
            puissance_pompe: '',
            profondeur_forage: '',
            debit_nominal: '',
            numero_serie: '',
            code_installation: 'I0001',
            source_eau: 'Puits',
            hmt: '',
            latitude: '',
            longitude: '',
            pays: '',
            ville: '',
            statuts: 'installée'
        });
        setLoad(false);
        setBtnTitle('Enregistrer');
        setValidationErrors({});
    }, [setData]);

    const clearFieldError = useCallback((fieldName) => {
        setValidationErrors(prev => ({
            ...prev,
            [fieldName]: ''
        }));
    }, []);

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
                source_eau: dataModify.source_eau || 'Puits',
                hmt: dataModify.hmt || '',
                ville: dataModify.localisation?.ville || 'Kara',
                pays: dataModify.localisation?.pays || 'Togo',
                latitude: dataModify.latitude || '',
                longitude: dataModify.longitude || '',
                statuts: dataModify.statuts || 'installée'
            });
            setBtnTitle('Modifier');
        } else {
            clearForm();
        }
    }, [dataModify, setData, getClient, clearForm]);

    const getLocation = useCallback(async () => {
        if (!data.latitude || !data.longitude) {
            console.warn('Latitude and longitude are required for location lookup');
            return;
        }

        setLocationLoading(true);
        try {
            const loc = await getLocationDetails(data.latitude, data.longitude);
            setData('ville', loc.region || loc.village || loc.adresse || prev.ville);
            setData('pays', loc.pays);

        } catch (error) {
            console.error('Error getting location:', error);
        } finally {
            setLocationLoading(false);
        }
    }, [data.latitude, data.longitude, setData]);

    const submit = async () => {
        const isCreating = btnTitle === 'Enregistrer';

        if (isCreating && !validateFormInstalation(data, setValidationErrors)) {
            return;
        }
        setLoad(true);
        setBtnTitle('Chargement...');


        try {
            let message;
            if (isCreating) {
                ({ message } = await createinstallations(data));
            } else {
                ({ message } = await updateinstallations(dataModify.id, data));
            }
            onClose(message);
        } catch (error) {
            console.error('Error submitting installation:', error);

            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                // Generic error handling
                setValidationErrors({
                    general: 'Une erreur est survenue lors de la soumission du formulaire.'
                });
            }
        } finally {
            setLoad(false);
            setBtnTitle(isCreating ? 'Enregistrer' : 'Modifier');
        }
    };

    useEffect(() => {
        const isValidCoordinates = data.latitude && data.longitude;
        if (!isValidCoordinates) return;

        getLocation();
    }, [data.latitude, data.longitude, getLocation]);

    const handleSelect = useCallback((item) => {
        setData('client_id', item.id);
        clearFieldError('client_id');
    }, [setData, clearFieldError]);

    const handleInputChange = useCallback((field, value) => {
        setData(field, value);
        clearFieldError(field);
    }, [setData, clearFieldError]);

    return (
        <Modal show={open} closeable={false} onClose={onClose} maxWidth='4xl'>
            <div className='text-2xl font-semibold text-center'>
                {dataModify.id ? 'Modifier une Installation' : 'Ajouter une Installation'}
            </div>

            {validationErrors.general && (
                <div className="p-3 mt-4 text-red-700 bg-red-100 border border-red-300 rounded">
                    {validationErrors.general}
                </div>
            )}

            <form className='grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-3'>
                <div>
                    <InputLabel htmlFor="client_id" value="Nom client" />
                    <InputAutocomplete
                        data={clients}
                        className="block w-full mt-1"
                        onSelect={handleSelect}
                        defaultValue={data.client_id ?? 0}
                        onFocus={() => clearFieldError('client_id')}
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
                        onChange={(e) => handleInputChange('numero_serie', e.target.value)}
                        required
                        onFocus={() => clearFieldError('numero_serie')}
                    />
                    <InputError message={validationErrors.numero_serie || errors.numero_serie} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="source_eau" value="Source d'eau" />
                    <SelectInput
                        id="source_eau"
                        name="source_eau"
                        value={data.source_eau}
                        className="block w-full mt-1"
                        autoComplete="source_eau"
                        onChange={(e) => handleInputChange('source_eau', e.target.value)}
                        required
                    >
                        <option value="Puits">Puits</option>
                        <option value="Forage">Forage</option>
                        <option value="Etang">Etang</option>
                        <option value="Barrage">Barrage</option>
                        <option value="Rivière">Rivière</option>
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
                        onChange={(e) => handleInputChange('hmt', e.target.value)}
                        required
                        type='number'
                        onFocus={() => clearFieldError('hmt')}
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
                        onChange={(e) => handleInputChange('profondeur_forage', e.target.value)}
                        required
                        type='number'
                        onFocus={() => clearFieldError('profondeur_forage')}
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
                        onChange={(e) => handleInputChange('debit_nominal', e.target.value)}
                        required
                        type='number'
                        onFocus={() => clearFieldError('debit_nominal')}
                    />
                    <InputError message={validationErrors.debit_nominal || errors.debit_nominal} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="puissance_pompe" value="Puissance crête installé (W)" />
                    <TextInput
                        id="puissance_pompe"
                        name="puissance_pompe"
                        value={data.puissance_pompe}
                        className="block w-full mt-1"
                        autoComplete="puissance_pompe"
                        onChange={(e) => handleInputChange('puissance_pompe', e.target.value)}
                        required
                        type='number'
                        onFocus={() => clearFieldError('puissance_pompe')}
                    />
                    <InputError message={validationErrors.puissance_pompe || errors.puissance_pompe} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="latitude" value="Latitude" />
                    <TextInput
                        id="latitude"
                        name="latitude"
                        value={data.latitude}
                        className="block w-full mt-1"
                        autoComplete="latitude"
                        type='number'
                        step="any"
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        onFocus={() => clearFieldError('latitude')}
                    />
                    <InputError message={validationErrors.latitude || errors.latitude} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="longitude" value="Longitude" />
                    <TextInput
                        id="longitude"
                        name="longitude"
                        value={data.longitude}
                        className="block w-full mt-1"
                        autoComplete="longitude"
                        type='number'
                        step="any"
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        onFocus={() => clearFieldError('longitude')}
                    />
                    <InputError message={validationErrors.longitude || errors.longitude} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="pays" value="Pays" />
                    <TextInput
                        id="pays"
                        name="pays"
                        value={data.pays}
                        readOnly
                        className="block w-full mt-1"
                        autoComplete="pays"
                        onChange={(e) => handleInputChange('pays', e.target.value)}
                        required
                        onFocus={() => clearFieldError('pays')}
                    />
                    <InputError message={validationErrors.pays || errors.pays} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="ville" value="Ville" />
                    <TextInput
                        id="ville"
                        name="ville"
                        value={data.ville}
                        readOnly
                        className="block w-full mt-1"
                        autoComplete="ville"
                        onChange={(e) => handleInputChange('ville', e.target.value)}
                        required
                        onFocus={() => clearFieldError('ville')}
                    />
                    <InputError message={validationErrors.ville || errors.ville} className="mt-2" />
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
                        onChange={(e) => handleInputChange('date_installation', e.target.value)}
                        required
                        onFocus={() => clearFieldError('date_installation')}
                    />
                    <InputError message={validationErrors.date_installation || errors.date_installation} className="mt-2" />
                </div>
            </form>

            <div className='flex items-center justify-end px-1'>
                <div className='flex items-center gap-4'>
                    <button
                        type="button"
                        className='px-4 py-2 text-red-500 rounded-md bg-red-400/10 hover:bg-red-400/20'
                        onClick={() => onClose('')}
                    >
                        Fermer
                    </button>
                    <button
                        type="submit"
                        className={`rounded-md py-2 px-4 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 ${load && 'opacity-50'}`}
                        disabled={load}
                        onClick={submit}
                    >
                        {btnTitle}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default FormulaireInstallation;
