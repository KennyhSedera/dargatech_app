import React, { forwardRef } from 'react';
import { logo, titre, togo } from '@/constant';
import moment from 'moment';

const FichierPaiementPdf = forwardRef(({ data }, ref) => {

  // Calculer les totaux
  const totalHT = data.produits?.reduce((sum, produit) => {
    return sum + (parseFloat(produit.quantite) * parseFloat(produit.prix_unitaire));
  }, 0) || 0;

  const totalTVA = data.produits?.reduce((sum, produit) => {
    return sum + (parseFloat(produit.quantite) * parseFloat(produit.prix_unitaire) * (produit.tva / 100));
  }, 0) || 0;

  const totalTTC = totalHT + totalTVA;

  data.banque = 'TG055';
  data.iban = 'TG53TG0550271314144776000172';

  return (
    <div ref={ref} className="p-4 bg-white text-black font-sans max-w-4xl mx-auto relative">


      {/* En-tête avec logo et informations du document */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center">
          <div className="mr-4">
            <img src={logo} alt="logo" className="w-20 h-20" />
          </div>

          <div>
            <div>
              <div className="flex items-end justify-end mb-1">
                <span className="text-blue-500 text-xs px-1 pb-1">TOGO</span>
                <img src={togo} alt="Togo Flag" className="h-5" />
              </div>
              <img src={titre} alt="logo" className="h-auto w-48" />
            </div>
            <div className="text-gray-500 text-xs">EXIGEZ LE MEILLEUR DU SOLAIRE</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-blue-500 font-bold">
            REÇU N°
            <div className="text-xl">{data.numero}</div>
          </div>
          <div className="text-sm mt-2">
            Lieu de création: {data.lieu_creation}<br />
            Date de création: {moment(data.date_creation).format('DD/MM/YYYY')}<br />
            Date de vente: {moment(data.date).format('DD/MM/YYYY')}
          </div>
        </div>
      </div>

      {/* Informations vendeur et acheteur */}
      <div className="flex mb-6">
        <div className="w-1/2 pr-2">
          <div className="bg-blue-500 text-white p-2">
            VENDEUR:
          </div>
          <div className="border border-t-0 border-blue-500 p-2">
            <strong>{data.nom_vendeur}</strong><br />
            {data.ville_vendeur}, {data.pays_vendeur}
          </div>
        </div>
        <div className="w-1/2 pl-2">
          <div className="bg-blue-500 text-white p-2">
            ACHETEUR:
          </div>
          <div className="border border-t-0 border-blue-500 p-2">
            <strong>{data.civilite_acheteur} {data.nom_acheteur}</strong><br />
            {data.ville_acheteur}, {data.pays_acheteur}
          </div>
        </div>
      </div>

      {/* Objet du document */}
      <div className="text-center text-blue-500 text-lg font-bold mb-4">
        SISAM - versement Loyer de la période du {data.periode_couverte}
      </div>

      {/* Tableau des produits */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-blue-500 p-2 text-center">N°</th>
              <th className="border border-blue-500 p-2 text-center">Désignation</th>
              <th className="border border-blue-500 p-2 text-center">Réf.</th>
              <th className="border border-blue-500 p-2 text-center">Qté</th>
              <th className="border border-blue-500 p-2 text-center">PU HT</th>
              <th className="border border-blue-500 p-2 text-center">Total HT</th>
              <th className="border border-blue-500 p-2 text-center">TVA</th>
              <th className="border border-blue-500 p-2 text-center">Montant TVA</th>
              <th className="border border-blue-500 p-2 text-center">Total TTC</th>
            </tr>
          </thead>
          <tbody>
            {data.produits.map((produit, index) => {
              const totalProduitHT = produit.quantite * produit.prix_unitaire;
              const montantTVA = totalProduitHT * (produit.tva / 100);
              const totalProduitTTC = totalProduitHT + montantTVA;

              return (
                <tr key={index}>
                  <td className="border border-blue-500 p-2 text-center">{index + 1}</td>
                  <td className="border border-blue-500 p-2">{produit.designation}</td>
                  <td className="border border-blue-500 p-2 text-center">{produit.reference}</td>
                  <td className="border border-blue-500 p-2 text-center">{produit.quantite}</td>
                  <td className="border border-blue-500 p-2 text-right">{produit.prix_unitaire.toLocaleString()}</td>
                  <td className="border border-blue-500 p-2 text-right">{totalProduitHT.toLocaleString()}</td>
                  <td className="border border-blue-500 p-2 text-center">{produit.tva}%</td>
                  <td className="border border-blue-500 p-2 text-right">{montantTVA.toLocaleString()}</td>
                  <td className="border border-blue-500 p-2 text-right">{totalProduitTTC.toLocaleString()}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="5" className="border border-blue-500 p-2 text-center font-bold">TOTAL</td>
              <td className="border border-blue-500 p-2 text-right font-bold">{totalHT.toLocaleString()}</td>
              <td className="border border-blue-500 p-2"></td>
              <td className="border border-blue-500 p-2 text-right font-bold">{totalTVA.toLocaleString()}</td>
              <td className="border border-blue-500 p-2 text-right font-bold">{totalTTC.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Résumé totaux */}
        <div className="flex justify-end mt-4">
          <table className="w-1/2 border-collapse">
            <tbody>
              <tr>
                <td className="text-right p-1">Total HT</td>
                <td className="text-right font-bold p-1">{totalHT.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="text-right p-1">Montant TVA (0%)</td>
                <td className="text-right font-bold p-1">{totalTVA.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="text-right p-1">Total TTC</td>
                <td className="text-right font-bold p-1">{totalTTC.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Informations de paiement */}
      <div className="border border-blue-500 mb-6">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="p-2">À payer:</td>
              <td className="p-2">{data.a_payer || '0 Franc CFA'}</td>
            </tr>
            <tr>
              <td className="p-2 ">Montant payé:</td>
              <td className="p-2">{data.montant_paye} Franc CFA</td>
            </tr>
            <tr>
              <td className="p-2 ">Mode de règlement:</td>
              <td className="p-2 ">{data.mode_paiement}</td>
            </tr>
            <tr>
              <td className="p-2">Banque:</td>
              <td className="p-2 ">{data.banque}</td>
              <td className="p-2">IBAN:</td>
              <td className="p-2 ">{data.iban}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Signature */}
      <div className="text-left">
        <div className="mb-2 text-blue-500">Nom du vendeur</div>
        <div className="font-bold">{data.nom_vendeur}</div>
      </div>

      {/* Pied de page avec informations DARGATECH */}
      <div className="text-center text-xs mt-8 border-t border-gray-300 pb-2">
        <div>DARGATECH TOGO, SARL - TG-LRL-01-2024-B12-00008</div>
        <div>KARA, TOGO - Tel : +228 93 18 96 06 -</div>
        <div>www.dargatech.com</div>
      </div>

    </div>
  );
});

FichierPaiementPdf.displayName = 'FichierPaiementPdf';

export default FichierPaiementPdf;