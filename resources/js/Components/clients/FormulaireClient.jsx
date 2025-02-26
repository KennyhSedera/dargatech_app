import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import TextInput from '../inputs/TextInput';
import InputLabel from '../inputs/InputLabel';
import InputError from '../inputs/InputError';
import { useForm } from '@inertiajs/react';
import { createClients, updateClients } from '@/Services/clientService';
import { validateFormClient } from '../validateForm';

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
        telephone: '',
        localisation: '',
        surface_cultivee: '',
        type_activite_agricole: '',
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
        setBtnTitle('Loanding ...');
        try {
            let message;
            if (btnTitle === 'Enregistrer') {
                ({ message } = await createClients(data));
            } else {
                ({ message } = await updateClients(dataModify.id, data));
            }
            onClose(message);
        } catch (error) {
            console.error('Error submitting payment:', error);
        } finally {
            setLoad(false);
            setBtnTitle('Enregistrer');
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
                {dataModify.nom ? 'Modifier un Client' : 'Ajouter un Client'}
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
                    <InputLabel htmlFor="localisation" value="Localisation" />
                    <TextInput
                        id="localisation"
                        name="localisation"
                        value={data.localisation}
                        className="mt-1 block w-full"
                        autoComplete="localisation"
                        onChange={(e) => setData('localisation', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'localisation': '' })}
                    />
                    <InputError message={validationErrors.localisation || errors.localisation} className="mt-2" />
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
