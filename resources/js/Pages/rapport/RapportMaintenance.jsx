import useTheme from '@/hooks/useTheme';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { FaArrowLeft, FaUser, FaPrint, FaCheck, FaInfo, FaTools, FaListAlt, FaCalendarAlt } from "react-icons/fa";
import { IoWarning, IoSunny } from "react-icons/io5";
import DangerButton from '@/Components/buttons/DangerButton';
import { logo } from '@/constant';
import RapportPdf from './RapportPdf';
import { FaDownload } from 'react-icons/fa6';

const RapportMaintenance = ({ intervention_id }) => {
  const { theme, setTheme } = useTheme();
  const [rapport, setRapport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('information');
  const [isPrinting, setIsPrinting] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setTheme(theme || 'light');
  }, [theme]);

  useEffect(() => {
    const fetchRapport = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/rapport/maintenance/${intervention_id}`);
        setRapport(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    if (intervention_id) {
      fetchRapport();
    }
  }, [intervention_id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDownloadPDF = () => {
    const element = contentRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `rapport-maintenance-${rapport?.id+'-du-'+rapport?.client?.nom+'-'+rapport?.client?.prenom || 'undefined'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">Chargement du rapport...</h2>
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
              <IoWarning className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Erreur</h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <DangerButton onClick={() => window.history.back()} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-sm">
              Retour
            </DangerButton>
          </div>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors w-full ${activeTab === id
          ? 'bg-teal-500 text-white shadow-md'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Head title="Rapport de maintenance - Dargatech" />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
      <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${isPrinting ? 'print-container' : ''}`}>
        {/* Header */}
        <div className={`mb-8 flex flex-col md:flex-row md:items-center md:justify-between ${isPrinting ? 'print-header' : ''}`}>
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow no-print"
            >
              <FaArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full flex items-center justify-center mr-3">
                <img src={logo} alt="logo" className={`w-16 ${isPrinting ? 'print-logo' : ''}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isPrinting ? 'print-title' : ''}`}>Dargatech</h1>
                <p className={`text-sm text-slate-500 dark:text-slate-400 ${isPrinting ? 'print-subtitle' : ''}`}>Solutions solaires durables</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm text-slate-500 dark:text-slate-400">Maintenance #{rapport?.maintenanceId}</div>
            <div className="text-lg font-semibold mt-1">Rapport d'intervention #{rapport?.id}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formatDate(rapport?.date_intervention)}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Sidebar navigation - hidden in print */}
          <div className="lg:w-64 flex-shrink-0 space-y-2 no-print sm:border-r-0 lg:border-r-2 pr-1">
            <TabButton
              id="information"
              label="Information client"
              icon={<FaUser className="h-4 w-4" />}
            />
            <TabButton
              id="probleme"
              label="Problème"
              icon={<IoWarning className="h-4 w-4" />}
            />
            <TabButton
              id="diagnostic"
              label="Diagnostic"
              icon={<FaListAlt className="h-4 w-4" />}
            />
            <TabButton
              id="intervention"
              label="Intervention"
              icon={<FaTools className="h-4 w-4" />}
            />
            <TabButton
              id="verification"
              label="Vérification"
              icon={<FaCheck className="h-4 w-4" />}
            />
            <TabButton
              id="recommandation"
              label="Recommandations"
              icon={<FaCalendarAlt className="h-4 w-4" />}
            />

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg transition-colors shadow-sm"
              >
                <FaDownload className="h-4 w-4" />
                <span>Télécharger en PDF</span>
              </button>
            </div>
          </div>

          {/* Main content area */}
          <div className={`flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden ${isPrinting ? 'print-content' : ''}`}>
            {/* Information Client */}
            {activeTab === 'information' && (
              <div className={`p-6 ${isPrinting ? 'print-section' : ''}`}>
                <div className="flex items-center mb-6">
                  <FaUser className="h-5 w-5 text-teal-500 mr-3" />
                  <h2 className={`text-xl font-bold ${isPrinting ? 'print-section-title' : ''}`}>Information du client</h2>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isPrinting ? 'print-grid' : ''}`}>
                  <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${isPrinting ? 'print-card' : ''}`}>
                    <div className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${isPrinting ? 'print-card-title' : ''}`}>Nom complet</div>
                    <div className={`font-medium ${isPrinting ? 'print-card-content' : ''}`}>{rapport?.client?.nom} {rapport?.client?.prenom}</div>
                  </div>
                  <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${isPrinting ? 'print-card' : ''}`}>
                    <div className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${isPrinting ? 'print-card-title' : ''}`}>Téléphone</div>
                    <div className={`font-medium ${isPrinting ? 'print-card-content' : ''}`}>{rapport?.client?.telephone}</div>
                  </div>
                  <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${isPrinting ? 'print-card' : ''}`}>
                    <div className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${isPrinting ? 'print-card-title' : ''}`}>Localisation</div>
                    <div className={`font-medium ${isPrinting ? 'print-card-content' : ''}`}>{rapport?.client?.localisation}</div>
                  </div>
                  <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${isPrinting ? 'print-card' : ''}`}>
                    <div className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${isPrinting ? 'print-card-title' : ''}`}>Email</div>
                    <div className={`font-medium ${isPrinting ? 'print-card-content' : ''}`}>{rapport?.client?.email || 'Non spécifié'}</div>
                  </div>
                  <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${isPrinting ? 'print-card' : ''}`}>
                    <div className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${isPrinting ? 'print-card-title' : ''}`}>Technicien</div>
                    <div className={`font-medium ${isPrinting ? 'print-card-content' : ''}`}>{rapport?.technicien ? `${rapport.technicien.user.name}` : 'Non assigné'}</div>
                  </div>
                  <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${isPrinting ? 'print-card' : ''}`}>
                    <div className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${isPrinting ? 'print-card-title' : ''}`}>Date de l'intervention</div>
                    <div className={`font-medium ${isPrinting ? 'print-card-content' : ''}`}>{formatDate(rapport?.date_intervention)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Problème */}
            {activeTab === 'probleme' && (
              <div className={`p-6 ${isPrinting ? 'print-section' : ''}`}>
                <div className="flex items-center mb-6">
                  <IoWarning className="h-5 w-5 text-red-500 mr-3" />
                  <h2 className={`text-xl font-bold ${isPrinting ? 'print-section-title' : ''}`}>Description de la panne</h2>
                </div>

                <div className="space-y-6">
                  {/* <div>
                    <h3 className="text-lg font-medium mb-3">Symptômes signalés</h3>
                    <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-red-500 ${isPrinting ? 'print-card' : ''}`}>
                      {rapport?.maintenance?.description_probleme || 'Non spécifié'}
                    </div>
                  </div> */}

                  <div>
                    <h3 className="text-lg font-medium mb-3">Problèmes rapportés</h3>
                    <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-teal-500 ${isPrinting ? 'print-card' : ''}`}>
                      {rapport?.description_panne || 'Non spécifié'}
                    </div>
                  </div>

                  {rapport?.photo_probleme && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Documentation visuelle</h3>
                      <div className={`flex justify-center bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${isPrinting ? 'print-card' : ''}`}>
                        <img
                          src={`/${rapport.photo_probleme}`}
                          alt="Photo du problème"
                          className="max-w-full h-auto max-h-96 rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Diagnostic */}
            {activeTab === 'diagnostic' && (
              <div className={`p-6 ${isPrinting ? 'print-section' : ''}`}>
                <div className="flex items-center mb-6">
                  <FaListAlt className="h-5 w-5 text-amber-500 mr-3" />
                  <h2 className={`text-xl font-bold ${isPrinting ? 'print-section-title' : ''}`}>Diagnostic & Cause</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Diagnostic initial</h3>
                    <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-amber-500 ${isPrinting ? 'print-card' : ''}`}>
                      {rapport?.diagnostic_initial || 'Non documenté'}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Cause identifiée</h3>
                    <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-orange-500 ${isPrinting ? 'print-card' : ''}`}>
                      {rapport?.cause_identifiee || 'Non identifiée'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Intervention */}
            {activeTab === 'intervention' && (
              <div className={`p-6 ${isPrinting ? 'print-section' : ''}`}>
                <div className="flex items-center mb-6">
                  <FaTools className="h-5 w-5 text-green-500 mr-3" />
                  <h2 className={`text-xl font-bold ${isPrinting ? 'print-section-title' : ''}`}>Interventions réalisées</h2>
                </div>

                <div className="mb-3">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                    {rapport?.maintenance?.type_intervention || 'Non spécifié'}
                  </span>
                </div>

                <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-green-500 ${isPrinting ? 'print-card' : ''}`}>
                  {rapport?.intervention_realisee || 'Aucune intervention documentée'}
                </div>
              </div>
            )}

            {/* Vérification */}
            {activeTab === 'verification' && (
              <div className={`p-6 ${isPrinting ? 'print-section' : ''}`}>
                <div className="flex items-center mb-6">
                  <FaCheck className="h-5 w-5 text-indigo-500 mr-3" />
                  <h2 className={`text-xl font-bold ${isPrinting ? 'print-section-title' : ''}`}>Test post réparation</h2>
                </div>

                <div className="mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${rapport?.maintenance?.status_intervention === 'terminée'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                    }`}>
                    {rapport?.maintenance?.status_intervention || 'Non spécifié'}
                  </span>
                </div>

                <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-indigo-500 ${isPrinting ? 'print-card' : ''}`}>
                  {rapport?.verification_fonctionnement || 'Non documenté'}
                </div>
              </div>
            )}

            {/* Recommandations */}
            {activeTab === 'recommandation' && (
              <div className={`p-6 ${isPrinting ? 'print-section' : ''}`}>
                <div className="flex items-center mb-6">
                  <FaCalendarAlt className="h-5 w-5 text-purple-500 mr-3" />
                  <h2 className={`text-xl font-bold ${isPrinting ? 'print-section-title' : ''}`}>Recommandations au client</h2>
                </div>

                <div className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-purple-500 ${isPrinting ? 'print-card' : ''}`}>
                  {rapport?.recommandation_client || 'Aucune recommandation spécifique'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 flex justify-between items-center ${isPrinting ? 'print-footer' : ''}`}>
          <div>Rapport généré le {new Date().toLocaleDateString('fr-FR')}</div>
          <div className="flex items-center">
            <span>Dargatech Solutions Solaires</span>
            <div className="w-1 h-1 rounded-full bg-slate-400 mx-2"></div>
            <span>Rapport #ID: {rapport?.id}</span>
            {isPrinting && <span className="ml-4">Page <span className="print-page-number"></span></span>}
          </div>
        </div>
      </div>
      )}
      <div className='hidden'>
        <RapportPdf
          data={rapport}
          ref={contentRef}
        />
      </div>
    </div>
  );
};

export default RapportMaintenance;