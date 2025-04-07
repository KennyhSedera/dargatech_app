import React, { useEffect, useRef, useState } from 'react';
import InputLabel from '../inputs/InputLabel';
import InputError from '../inputs/InputError';
import TextInput from '../inputs/TextInput';
import Modal from '../Modal';
import InputImage from '../inputs/InputImage';
import { useForm } from '@inertiajs/react';

const FormulaireRapportMaintenance = ({
    open = true,
    setOpen,
    dataModify = {},
    onCloseFormulaire = () => { },
    idTechnicien,
}) => {
    const { data, setData, errors, reset } = useForm({
        clientId: 0,
        technicienId: idTechnicien,
        maintenanceId: 0,
        description_probleme: '',
        photo_probleme: null,
        verifications_preliminaires: '',
        resultat_diagnostic: '',
        actions_correctives: '',
        verification_fonctionnement: '',
        recommandations: '',
    });
    const [load, setload] = useState(false);

    useEffect(() => {
        if (dataModify) {
            setData('maintenanceId', dataModify.id);
            setData('clientId', dataModify.idclient);
            setData('description_probleme', dataModify.description_probleme);
        }
    }, [dataModify])

    const fileInputRef = useRef(null);
    const [validationErrors, setValidationErrors] = useState({});

    const onClose = (message) => {
        setOpen(false);
        setData({
            clientId: 0,
            technicienId: idTechnicien,
            maintenanceId: 0,
            description_probleme: '',
            photo_probleme: null,
            verifications_preliminaires: '',
            resultat_diagnostic: '',
            actions_correctives: '',
            verification_fonctionnement: '',
            recommandations: '',
        });
        onCloseFormulaire(message);
    };

    const onLoadFile = (file) => {
        setData('photo_probleme', file);
    };

    const submit = () => {

    }

    return (
        <Modal show={open} closeable={false} onClose={onClose} maxWidth='xl'>
            <div className='text-2xl font-semibold text-center'>Formulaire rapport maintenance</div>
            <form className='grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2'>
                <div>
                    <InputLabel htmlFor="description_probleme" value="Problème rapporté" />
                    <TextInput
                        id="description_probleme"
                        name="description_probleme"
                        value={data.description_probleme}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) => setData('description_probleme', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, description_probleme: '' })}
                    />
                    <InputError message={validationErrors.description_probleme || errors.description_probleme} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="photo_probleme" value="Photo du problème" />
                    <InputImage ref={fileInputRef} selectedFile={data.photo_probleme} onLoadFile={onLoadFile} onFocus={() => setValidationErrors({ ...validationErrors, photo_probleme: '' })} />
                </div>
                <div>
                    <InputLabel htmlFor="verifications_preliminaires" value="Vérifications préliminaires" />
                    <TextInput
                        id="verifications_preliminaires"
                        name="verifications_preliminaires"
                        value={data.verifications_preliminaires}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) => setData('verifications_preliminaires', e.target.value)}
                        required
                    />
                    <InputError message={errors.verifications_preliminaires} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="resultat_diagnostic" value="Résultat du diagnostic" />
                    <TextInput
                        id="resultat_diagnostic"
                        name="resultat_diagnostic"
                        value={data.resultat_diagnostic}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) => setData('resultat_diagnostic', e.target.value)}
                        required
                    />
                    <InputError message={errors.resultat_diagnostic} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="actions_correctives" value="Actions correctives" />
                    <TextInput
                        id="actions_correctives"
                        name="actions_correctives"
                        value={data.actions_correctives}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) => setData('actions_correctives', e.target.value)}
                        required
                    />
                    <InputError message={errors.actions_correctives} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="verification_fonctionnement" value="Vérification du fonctionnement" />
                    <TextInput
                        id="verification_fonctionnement"
                        name="verification_fonctionnement"
                        value={data.verification_fonctionnement}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) => setData('verification_fonctionnement', e.target.value)}
                        required
                    />
                    <InputError message={errors.verification_fonctionnement} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="recommandations" value="Recommandations au Client" />
                    <TextInput
                        id="recommandations"
                        name="recommandations"
                        value={data.recommandations}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) => setData('recommandations', e.target.value)}
                    />
                    <InputError message={errors.recommandations} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="date_intervention" value="Date de l'intervention" />
                    <TextInput
                        id="date_intervention"
                        name="date_intervention"
                        value={data.date_intervention}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) => setData('date_intervention', e.target.value)}
                        type="date"
                    />
                    <InputError message={errors.date_intervention} className="mt-2" />
                </div>
            </form>
            <div className='flex items-center justify-end gap-4 px-1'>
                <button type="button" className='px-4 py-1 text-red-500 rounded-md bg-red-400/10' onClick={() => onClose('')}>
                    Fermer
                </button>
                <button type="submit" className={`rounded-md py-1 px-4 disabled:cursor-not-allowed bg-blue-500 text-white ${load && 'opacity-25'}`} disabled={load} onClick={submit}>
                    Enregistrer
                </button>
            </div>
        </Modal>
    );
};

export default FormulaireRapportMaintenance;
