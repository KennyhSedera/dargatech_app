import axios from 'axios';

// Fonction pour envoyer le PDF par email
export const sendPdfByEmail = async (pdfData, email) => {
  try {
    const response = await axios.post('/api/paiement/generate-and-send-pdf', {
      email: email,
      data: pdfData
    });
    
    if (response.data.success) {
      alert('Reçu envoyé avec succès à ' + email);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du PDF:', error);
    alert('Erreur lors de l\'envoi du PDF: ' + (error.response?.data?.message || error.message));
    throw error;
  }
};

// Exemple d'utilisation
export const handleSendPdf = (data) => {
  const email = 'kennyhsedera@gmail.com';
  
  // Utilisez les mêmes données que vous passeriez au composant React FichierPaiementPdf
  const pdfData = {
    numero: 'PDF-001',
    lieu_creation: 'Kara',
    date_creation: '2025-04-10',
    date: '2025-04-10',
    nom_vendeur: 'Darga Tech',
    ville_vendeur: 'Kara',
    pays_vendeur: 'Togo',
    civilite_acheteur: 'M.',
    nom_acheteur: 'Kanouh',
    ville_acheteur: 'Lomé',
    pays_acheteur: 'Togo',
    periode_couverte: '10/04/2025 au 10/04/2025',
    produits: [
      {
        designation: 'test',
        reference: '1',
        quantite: 1,
        prix_unitaire: 200,
        tva: 0
      },
      {
        designation: 'test2',
        reference: '1',
        quantite: 1,
        prix_unitaire: 200,
        tva: 0
      },
    ],
    a_payer: '0 Franc CFA',
    montant_paye: '200.00',
    mode_paiement: 'Espèce'
  };
  
  sendPdfByEmail(pdfData, email);
};