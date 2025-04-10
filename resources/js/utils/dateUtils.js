/**
 * Formate une date en format français (jour mois année)
 * @param {string|Date} date - La date à formater
 * @returns {string} - La date formatée
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) return '';
  
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  return dateObj.toLocaleDateString('fr-FR', options);
};

/**
 * Formate une date et heure en format français
 * @param {string|Date} date - La date à formater
 * @returns {string} - La date et heure formatées
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) return '';
  
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return dateObj.toLocaleDateString('fr-FR', options);
};

/**
 * Calcule la différence en jours entre deux dates
 * @param {string|Date} date1 - La première date
 * @param {string|Date} date2 - La deuxième date
 * @returns {number} - La différence en jours
 */
export const daysBetween = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  // Vérifier si les dates sont valides
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}; 