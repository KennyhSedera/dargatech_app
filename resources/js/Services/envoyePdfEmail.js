import axios from 'axios';

// Fonction pour envoyer le PDF par email
export const sendPdfByEmail = async (pdfData, email) => {
  try {
    const response = await axios.post('/api/paiement/generate-and-send-pdf', {
      email: email,
      data: pdfData
    });
    
    if (response.data.success) {
      alert(response.data.message);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du PDF:', error);
    alert('Erreur lors de l\'envoi du PDF: ' + (error.response?.data?.message || error.message));
    throw error;
  }
};
