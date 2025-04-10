import React, { useRef, useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import FichierPaiementPdf from '@/Components/paiements/FichierPaiementPdf';
import axios from 'axios';

const AfficherPaiement = ({ paiement_id=3, returnUrl = '/paiements' }) => {
  const [paiement, setPaiement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchPaiement = async () => {
      try {
        const response = await axios.get(`/api/paiement/${paiement_id}`);
        setPaiement(response.data);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (paiement_id) {
      fetchPaiement();
    }
  }, [paiement_id]);

  const handleDownloadPDF = () => {
    const element = contentRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `facture-${paiement?.numero_facture || 'undefined'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">Chargement de la facture...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 max-w-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Erreur</h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Head title={`Facture #${paiement?.numero_facture || ''} - Dargatech`} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow no-print"
            >
              <FaArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Facture #{paiement?.numero_facture || ''}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Client: {paiement?.client?.nom} {paiement?.client?.prenom}
              </p>
            </div>
          </div>

          <div className="flex space-x-3 no-print">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <FaPrint className="h-4 w-4 mr-2 text-slate-600 dark:text-slate-300" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <FaDownload className="h-4 w-4 mr-2" />
              <span>Télécharger PDF</span>
            </button>
          </div>
        </div>

        {/* Contenu de la facture */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
          <FichierPaiementPdf data={paiement} ref={contentRef} />
        </div>

        {/* Pied de page */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 flex justify-between items-center no-print">
          <div>Facture générée le {new Date().toLocaleDateString('fr-FR')}</div>
          <div className="flex items-center">
            <span>Dargatech Solutions Solaires</span>
            <div className="w-1 h-1 rounded-full bg-slate-400 mx-2"></div>
            <span>Facture #ID: {paiement?.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfficherPaiement; 