const validateForm = (data, setValidationErrors) => {
    const errors = {};

    if (!data.nom.trim()) {
        errors.nom = 'Le nom est obligatoire.';
    }
    if (!data.prenom.trim()) {
        errors.prenom = 'Le prénom est obligatoire.';
    }
    if (!data.telephone.trim()) {
        errors.telephone = 'Le téléphone est obligatoire.';
    } else if (!/^\d{10}$/.test(data.telephone)) {
        errors.telephone = 'Le téléphone doit contenir 10 chiffres.';
    }
    if (!data.localisation.trim()) {
        errors.localisation = 'La localisation est obligatoire.';
    }
    if (!data.surface_cultivee) {
        errors.surface_cultivee = 'La surface cultivée est obligatoire.';
    } else if (isNaN(data.surface_cultivee) || data.surface_cultivee <= 0) {
        errors.surface_cultivee = 'La surface cultivée doit être un nombre positif.';
    }
    if (!data.type_activite_agricole.trim()) {
        errors.type_activite_agricole = 'Le type d\'activité agricole est obligatoire.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}

export default validateForm;
