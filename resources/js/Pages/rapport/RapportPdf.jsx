import React, { forwardRef } from 'react';
import { logo } from '@/constant';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const RapportPdf = forwardRef(({ data }, ref) => {
  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <div ref={ref} className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full text-gray-800">
        <div className="flex justify-between mb-10">
          <div className="flex items-center">
            <div className="h-14 w-14 rounded-full flex items-center justify-center mr-3">
              <img src={logo} alt="logo" className={`w-24`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold`}>Dargatech</h1>
              <p className={`text-sm text-slate-500 dark:text-slate-400`}>Solutions solaires durables</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm text-slate-500 dark:text-slate-400">Maintenance #{data?.maintenanceId}</div>
            <div className="text-lg font-semibold mt-1">Rapport d'intervention #{data?.id}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{moment(data?.date_intervention).format('DD MMM YYYY')}</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Rapport de maintenance du kit solaire Dargatech</h1>

        {/* Client Info */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Identification du client</h2>
          <div className="flex gap-20 px-6">
            <ul className="list-disc list-inside">
              <li><strong>Nom :</strong> {data.client.prenom} {data.client.nom}</li>
              <li><strong>Localisation :</strong> {data.client.localisation}</li>
            </ul>
            <ul className="list-disc list-inside">
              <li><strong>Date de l'intervention :</strong> {moment(data.date_intervention).format('DD MMM YYYY')}</li>
              <li><strong>Technicien :</strong> {data.technicien?.user?.name}</li>
              <li><strong>Contact :</strong> {data.client.telephone}</li>
            </ul>
          </div>
        </section>

        {/* Panne */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2. Description de la Panne</h2>
          <ul className="list-disc list-inside text-black px-4">
            <li><strong>Signalement par le client :</strong> <br />
              <ul className="list-disc list-inside text-black px-12">
                <li>
                  <strong>Problèmes rapportés : </strong> {data.description_panne}

                  {data.photo_probleme && (
                    <img
                      src={`/${data.photo_probleme}`}
                      alt="Photo du problème"
                      className="rounded-lg shadow-md my-4 mx-auto"
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                  )}
                </li>
                <li><strong>Date et heure du signalement :</strong> le {moment(data.created_at).format('DD MMMM YYYY à HH:mm')}</li>
              </ul>
            </li>
          </ul>

        </section>

        {/* Diagnostic */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. Diagnostic initial</h2>
          <ul className="list-disc list-inside text-black px-4">
            <li><strong>Vérifications préliminaires : </strong>
              <ul className="list-disc list-inside text-black px-12">
                <li>{data.diagnostic_initial}</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Cause */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">4. Cause identifiée</h2>
          <ul className="list-disc list-inside text-black px-4">
            <li><strong>Résultat du diagnostic :</strong><br />
              <a className='px-12'>{data.cause_identifiee}</a>
            </li>
          </ul>
        </section>

        {/* Intervention */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">5. Intervention réalisée</h2>
          <ul className="list-disc list-inside text-black px-4">
            <li><strong>Actions correctives :</strong><br />
              <a className='px-12'>{data.intervention_realisee}</a>
            </li>
          </ul>
        </section>

        {/* Vérification */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">6. Test Post-Réparation
          </h2>
          <ul className="list-disc list-inside text-black px-4">
            <li><strong>Vérification du fonctionnement :</strong>
              <a className='px-1'>{data.verification_fonctionnement}</a>
            </li>
          </ul>
        </section>

        {/* Recommandations */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">7. Recommandation au client</h2>
          <p className='px-12'>{data.recommandation_client}</p>
        </section>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-8">Rapport généré le {new Date(data.created_at).toLocaleDateString()} par {data?.technicien?.user?.name}</p>
      </div>
    </div>
  );
});

RapportPdf.displayName = 'RapportPdf';

export default RapportPdf;
