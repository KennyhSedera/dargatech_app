import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

export default function RapportPdf({ data }) {
  const rapportRef = useRef();

  const handleDownloadPDF = () => {
    const element = rapportRef.current;
    const opt = {
      margin: 0.5,
      filename: 'rapport-maintenance.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="flex flex-col  items-center p-8 bg-gray-100 min-h-screen">
      <button
        onClick={handleDownloadPDF}
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Télécharger en PDF
      </button>

      <div ref={rapportRef} className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full text-gray-800">
        <h1 className="text-2xl font-bold text-center underline mb-8">Rapport de maintenance du kit solaire Dargatech</h1>

        {/* Client Info */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Identification du client</h2>
          <p><strong>Nom :</strong> {data.client.prenom} {data.client.nom}</p>
          <p><strong>Localisation :</strong> {data.client.localisation}</p>
          <p><strong>Date de l’intervention :</strong> {data.date_intervention}</p>
          <p><strong>Contact :</strong> {data.client.telephone}</p>
        </section>

        {/* Panne */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2. Description de la Panne</h2>
          <p>{data.description_panne}</p>

          {data.photo_probleme && (
            <img
              src={`/${data.photo_probleme}`} // à adapter selon ton serveur
              alt="Photo du problème"
              className="rounded-lg shadow-md my-4 mx-auto"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          )}
        </section>

        {/* Diagnostic */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. Diagnostic initial</h2>
          <p>{data.diagnostic_initial}</p>
        </section>

        {/* Cause */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">4. Cause identifiée</h2>
          <p>{data.cause_identifiee}</p>
        </section>

        {/* Intervention */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">5. Intervention réalisée</h2>
          <p>{data.intervention_realisee}</p>
        </section>

        {/* Vérification */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">6. Vérification du fonctionnement</h2>
          <p>{data.verification_fonctionnement}</p>
        </section>

        {/* Recommandations */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">7. Recommandation au client</h2>
          <p>{data.recommandation_client}</p>
        </section>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-8">Rapport généré le {new Date(data.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
