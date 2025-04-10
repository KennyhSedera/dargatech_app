import React, { useEffect, useState, useRef } from 'react'
import { Head, useForm } from '@inertiajs/react'
import InputLabel from '@/Components/inputs/InputLabel';
import TextInput from '@/Components/inputs/TextInput';
import InputError from '@/Components/inputs/InputError';
import useTheme from '@/hooks/useTheme';
import DangerButton from '@/Components/buttons/DangerButton';
import { getType_paiements } from '@/Services/TypePaiementService';
import { getClients } from '@/Services/clientService';
import PrimaryButton from '@/Components/buttons/PrimaryButton';
import DesignationComponent from '@/Components/Paiement/DesignationComponent';
import InfoPaiement from '@/Components/Paiement/InfoPaiement';
import InfoMaraicher from '@/Components/Paiement/InfoMaraicher';
import InfoVendeur from '@/Components/Paiement/InfoVendeur';
import PaiementFooter from '@/Components/Paiement/PaiementFooter';
import { createPaiement } from '@/Services/PaiementService';
import Snackbar from '@/Components/Snackbar';
import html2pdf from 'html2pdf.js';
import FichierPaiementPdf from '@/Components/paiements/FichierPaiementPdf';
import moment from 'moment';
import { sendPdfByEmail } from '@/Services/envoyePdfEmail';

const FormulairePaiement = () => {
    const { theme, setTheme } = useTheme();
    const contentRef = useRef(null);
    const [showPdf, setShowPdf] = useState(false);
    const [paiementData, setPaiementData] = useState(null);

    useEffect(() => {
        setTheme(theme || 'light')
    }, [theme])

    const { data, setData, errors, reset } = useForm({
        type: 'recu',
        numero: 'R1_TEST',
        date_creation: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        lieu_creation: 'Atakpamé',
        date_additionnel: 'Date de vente',
        periode_couverte: '',
        nom_vendeur: 'Darga',
        nom_vendeurs: 'DARGATECH TOGO',
        select1: 'Numéro TVA',
        num_tva: '',
        nom_rue_vendeur: 'Kara',
        ville_vendeur: 'Kara',
        pays_vendeur: 'Togo',
        civilite_acheteur: 'Mr.',
        prenom_acheteur: '',
        nom_acheteur: '',
        num_rue_acheteur: '',
        ville_acheteur: '',
        pays_acheteur: '',
        mode_paiement: 'Espèce',
        date_echeance: new Date().toISOString().split('T')[0],
        date_paiement: new Date().toISOString().split('T')[0],
        etat_paiment: 'Payé',
        montant_paye: '',
        objet: '',
        description: '',
        produits: [],
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [clients, setClients] = useState([]);
    const [typePaiement, setTypePaiement] = useState([]);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        type: 'success'
    });
    const [email, setEmail] = useState('');

    const getType = async () => {
        try {
            const [{ clients }, type] = await Promise.all([getClients(), getType_paiements()]);
            setClients(clients?.map(el => ({
                id: el.id,
                nom: el.prenom,
                nom_famille: el.nom,
                ville: el.localisation.ville,
                pays: el.localisation.pays,
                village: el.localisation.village,
                quartier: el.localisation.quartier,
                email: el.email,
                genre: el.genre,
                telephone: el.telephone,
                localisation: el.localisation.pays + ' ' + el.localisation.ville
            })));
            setTypePaiement(type.type?.map(el => ({ id: el.id, nom: el.name })));
        } catch (error) {
            console.error('Error fetching payment types:', error);
        }
    }

    useEffect(() => {
        getType();
    }, []);

    const handleSelect = (item) => {
        const cli = clients.find(el => el.id === item.id);
        if (cli) {
            setData('client_id', cli.id);
            setData('nom_acheteur', cli.nom_famille);
            setData('prenom_acheteur', cli.nom);
            setData('ville_acheteur', cli.ville);
            setData('pays_acheteur', cli.pays);
            setData('num_rue_acheteur', cli.village || cli.quartier);
            setData('civilite_acheteur', cli.genre === 'Homme' ? 'Mr.' : 'Mme.');
            setEmail(cli.email);
        }
    };

    const generatePDF = () => {
        const element = contentRef.current;
        if (!element) return;

        const opt = {
            margin: 0.5,
            filename: `${data.type === 'recu' ? 'recu' : 'facture'}-${data.numero}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

    const handleSubmit = async () => {
        data.periode_couverte = moment(data.date_creation).format('DD/MM/YYYY') + " au " + moment(data.date).format('DD/MM/YYYY');
        data.date_paiement = data.date_paiement ? new Date(data.date_paiement).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        data.observation = data.description;
        data.echeance = data.date_echeance;
        data.statut_paiement = data.etat_paiment;
        data.montant_paye = data.montant_paye || "0";
        data.montant = data.montant_paye || "0";
        try {
            const response = await createPaiement(data);
            setPaiementData(data);
            setShowPdf(true);
            setAlert({
                open: true,
                message: response.message,
                type: 'success'
            });
            setShowPdf(false);
            reset();
            window.history.back();
            
            setTimeout(() => {
                sendPdfByEmail(data, email);
            }, 500);
        } catch (error) {
            console.error('Error submitting payment:', error);
            setAlert({
                open: true,
                message: 'Erreur lors de l\'enregistrement du paiement',
                type: 'error'
            });
        }
    };

    return (
        <div className='bg-gray-100 dark:bg-gray-900 dark:text-white p-10'>
            <Head title='Formulaire Paiement' />
            <Snackbar
                message={alert.message}
                type={alert.type}
                duration={3000}
                position="top-right"
                show={alert.open}
                onClose={() => setAlert({ ...alert, message: '', open: false })}
            />
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg'>
                <DangerButton
                    onClick={() => window.history.back()}
                    className='absolute capitalize'
                >Retour</DangerButton>
                <div className='text-center text-2xl font-bold'>Formulaire de Paiement</div>

                {/* en tete */}
                <InfoPaiement
                    data={data}
                    errors={errors}
                    setData={setData}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                />

                <div className='border-b w-full my-6 opacity-35 '></div>

                {/* information vendeur et maraicher */}
                <div className='grid grid-cols-2 gap-8'>
                    <InfoVendeur
                        data={data}
                        errors={errors}
                        setData={setData}
                        setValidationErrors={setValidationErrors}
                        validationErrors={validationErrors}
                    />
                    <InfoMaraicher
                        clients={clients}
                        data={data}
                        errors={errors}
                        handleSelect={handleSelect}
                        setData={setData}
                        setValidationErrors={setValidationErrors}
                        validationErrors={validationErrors}
                    />
                </div>

                <div className='border-b w-full my-6 opacity-35 '></div>

                {/* objet */}
                <div className='my-10 grid grid-cols-2'>
                    <div>
                        <InputLabel htmlFor="objet" value="Objet" />
                        <TextInput
                            id="objet"
                            name="objet"
                            value={data.objet}
                            className="block w-full mt-1"
                            autoComplete="objet"
                            onChange={(e) => setData('objet', e.target.value)}
                            required
                            onFocus={() => setValidationErrors({ ...validationErrors, 'objet': '' })}
                        />
                        <InputError message={validationErrors.objet || errors.objet} className="mt-2" />
                    </div>
                </div>

                <div className='border-b w-full my-6 opacity-35 '></div>

                {/* designation */}
                <div className=''>
                    <div className='flex items-center justify-start'>
                        <span className='font-bold text-lg'>Désignations</span>
                    </div>
                    <DesignationComponent data={data} setData={setData} />
                </div>

                <div className='border-b w-full my-6 opacity-35 '></div>

                {/* payement */}
                <PaiementFooter
                    data={data}
                    errors={errors}
                    setData={setData}
                    setValidationErrors={setValidationErrors}
                    typePaiement={typePaiement}
                    validationErrors={validationErrors}
                />
                <div className='mt-8 flex items-center justify-end'>
                    {/* <button className='bg-blue-500 text-white px-4 py-1 mr-2 rounded-md' onClick={generatePDF}>Télécharger le PDF</button> */}
                    <PrimaryButton className='px-10' onClick={handleSubmit}>Enregistrer</PrimaryButton>
                </div>
            </div>

            {/* Composant PDF caché */}
            <div className="hidden">
                {showPdf && paiementData && (
                    <div ref={contentRef}>
                        <FichierPaiementPdf data={paiementData} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default FormulairePaiement
