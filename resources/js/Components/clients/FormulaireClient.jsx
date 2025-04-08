import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import TextInput from '../inputs/TextInput';
import InputLabel from '../inputs/InputLabel';
import InputError from '../inputs/InputError';
import { useForm } from '@inertiajs/react';
import { createClients, updateClients } from '@/Services/clientService';
import { validateFormClient } from '../validateForm';
import SelectInput from '../inputs/SelectInput';
import { getCoordinates } from '../localisations/localisation';

const FormulaireClient = ({
    open = true,
    setOpen,
    dataModify = {},
    onCloseFormulaire = () => { },
}) => {
    const [btnTitle, setBtnTitle] = useState('Enregistrer');
    const [validationErrors, setValidationErrors] = useState({});
    const [load, setLoad] = useState(false);

    const { data, setData, errors, reset } = useForm({
        nom: '',
        prenom: '',
        email: '',
        genre: 'homme',
        CIN: '',
        telephone: '',
        pays: 'Togo',
        ville: 'Kara',
        latitude: '',
        longitude: '',
        localisation: '',
        surface_cultivee: '',
        type_activite_agricole: '',
        quartier: '',
        village: '',
    });

    const onClose = (message) => {
        setOpen(false);
        clearForm();
        onCloseFormulaire(message);
    };

    const clearForm = () => {
        reset();
        setBtnTitle('Enregistrer');
        setValidationErrors({});
        setLoad(false);
    };

    useEffect(() => {
        if (dataModify.id) {
            setData({
                nom: dataModify.nom || '',
                prenom: dataModify.prenom || '',
                genre: dataModify.genre || '',
                CIN: dataModify.CIN || '',
                telephone: dataModify.telephone || '',
                localisation: dataModify.localisation || '',
                surface_cultivee: dataModify.surface_cultivee || '',
                type_activite_agricole: dataModify.type_activite_agricole || '',
            });
            setBtnTitle('Modifier');
        } else {
            clearForm();
        }
    }, [dataModify, setData, setBtnTitle]);

    const submit = async () => {
        if (!validateFormClient(data, setValidationErrors)) {
            return;
        }

        setLoad(true);
        setBtnTitle("Loading ...");

        try {
            const { lat, lon } = await getCoordinates(data.ville, data.pays, data.village, data.quartier);
            
            const clientData = {
                ...data,
                latitude: lat,
                longitude: lon,
                localisation: `${data.pays} ${data.ville}${data.village ? ` ${data.village}` : ''}${data.quartier ? ` ${data.quartier}` : ''}`,
                quartier: data.quartier || 'Non spécifié',
                village: data.village || 'Non spécifié'
            };

            await enregistrerClient(clientData);
            
            onClose('Client créé avec succès !');
        } catch (error) {
            console.error("Erreur:", error);
            setLoad(false);
            setBtnTitle("Enregistrer");
        }
    };

    const enregistrerClient = async (updatedData) => {
        try {
            let message = '';
            if (btnTitle === "Enregistrer") {
                ({ message } = await createClients(updatedData));
            } else {
                ({ message } = await updateClients(dataModify.id, updatedData));
            }
            onClose(message);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du client:", error);
        } finally {
            setLoad(false);
            setBtnTitle("Enregistrer");
        }
    };

    return (
        <Modal
            show={open}
            closeable={false}
            onClose={onClose}
            maxWidth='xl'
        >
            <div className='text-center font-semibold text-2xl'>
                {dataModify.nom ? 'Modifier un Maraîcher' : 'Ajouter un Maraîcher'}
            </div>
            <form className='w-full my-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                    <InputLabel htmlFor="nom" value="Nom" />
                    <TextInput
                        id="nom"
                        name="nom"
                        value={data.nom}
                        className="mt-1 block w-full"
                        autoComplete="nom"
                        isFocused={true}
                        onChange={(e) => setData('nom', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'nom': '' })}
                    />
                    <InputError message={validationErrors.nom || errors.nom} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="prenom" value="Prénom" />
                    <TextInput
                        id="prenom"
                        name="prenom"
                        value={data.prenom}
                        className="mt-1 block w-full"
                        autoComplete="prenom"
                        onChange={(e) => setData('prenom', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'prenom': '' })}
                    />
                    <InputError message={validationErrors.prenom || errors.prenom} className="mt-2" />
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
                    <InputLabel htmlFor="genre" value="Sexe" />
                    <SelectInput
                        id="genre"
                        type="genre"
                        name="genre"
                        value={data.genre}
                        className="block w-full mt-1"
                        autoComplete="genre"
                        onChange={(e) => setData('genre', e.target.value)}
                        required
                    >
                        <option value="homme">Homme</option>
                        <option value="femme">Femme</option>
                    </SelectInput>
                    <InputError message={errors.genre} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="CIN" value="Pièce d'identité" />
                    <TextInput
                        id="CIN"
                        name="CIN"
                        value={data.CIN}
                        className="mt-1 block w-full"
                        autoComplete="CIN"
                        onChange={(e) => setData('CIN', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'CIN': '' })}
                    />
                    <InputError message={validationErrors.CIN || errors.CIN} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="telephone" value="Téléphone" />
                    <TextInput
                        id="telephone"
                        name="telephone"
                        value={data.telephone}
                        className="mt-1 block w-full"
                        autoComplete="telephone"
                        onChange={(e) => setData('telephone', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'telephone': '' })}
                    />
                    <InputError message={validationErrors.telephone || errors.telephone} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="pays" value="Pays" />
                    <TextInput
                        id="pays"
                        name="pays"
                        value={data.pays}
                        className="mt-1 block w-full"
                        autoComplete="pays"
                        onChange={(e) => setData('pays', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'pays': '' })}
                    />
                    <InputError message={validationErrors.pays || errors.pays} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="ville" value="Ville" />
                    <TextInput
                        id="ville"
                        name="ville"
                        value={data.ville}
                        className="mt-1 block w-full"
                        autoComplete="ville"
                        onChange={(e) => setData('ville', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'ville': '' })}
                    />
                    <InputError message={validationErrors.ville || errors.ville} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="village" value="Village" />
                    <TextInput
                        id="village"
                        name="village"
                        value={data.village}
                        className="mt-1 block w-full"
                        autoComplete="village"
                        onChange={(e) => setData('village', e.target.value)}
                        onFocus={() => setValidationErrors({ ...validationErrors, 'village': '' })}
                    />
                    <InputError message={validationErrors.village || errors.village} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="quartier" value="Quartier" />
                    <TextInput
                        id="quartier"
                        name="quartier"
                        value={data.quartier}
                        className="mt-1 block w-full"
                        autoComplete="quartier"
                        onChange={(e) => setData('quartier', e.target.value)}
                        onFocus={() => setValidationErrors({ ...validationErrors, 'quartier': '' })}
                    />
                    <InputError message={validationErrors.quartier || errors.quartier} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="type_activite_agricole" value="Type activité agricole" />
                    <TextInput
                        id="type_activite_agricole"
                        name="type_activite_agricole"
                        value={data.type_activite_agricole}
                        className="mt-1 block w-full"
                        autoComplete="type_activite_agricole"
                        onChange={(e) => setData('type_activite_agricole', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'type_activite_agricole': '' })}
                    />
                    <InputError message={validationErrors.type_activite_agricole || errors.type_activite_agricole} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="surface_cultivee" value="Surface cultivée (en ha)" />
                    <TextInput
                        id="surface_cultivee"
                        name="surface_cultivee"
                        value={data.surface_cultivee}
                        className="mt-1 block w-full"
                        autoComplete="surface_cultivee"
                        onChange={(e) => setData('surface_cultivee', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'surface_cultivee': '' })}
                    />
                    <InputError message={validationErrors.surface_cultivee || errors.surface_cultivee} className="mt-2" />
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
                    {btnTitle}
                </button>
            </div>
        </Modal>
    );
};

export default FormulaireClient;
