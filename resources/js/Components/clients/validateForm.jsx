export const validateFormClient = (data, setValidationErrors) => {
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

export const validateFormInstalation = (data, setValidationErrors) => {
    const errors = {};

    if (data.client_id <= 0) {
        errors.client_id = 'Le nom client est obligatoire.';
    }
    if (!data.puissance_pompe.trim()) {
        errors.puissance_pompe = 'La puissance de pompe est obligatoire.';
    } else if (isNaN(data.puissance_pompe) || data.puissance_pompe <= 0) {
        errors.puissance_pompe = 'La puissance de pompe doit être un nombre positif.';
    }
    if (!data.profondeur_forage.trim()) {
        errors.profondeur_forage = 'La profondeur de la forage est obligatoire.';
    } else if (isNaN(data.profondeur_forage) || data.profondeur_forage <= 0) {
        errors.profondeur_forage = 'La profondeur de la forage doit être un nombre positif.';
    }
    if (!data.debit_nominal.trim()) {
        errors.debit_nominal = 'Le débit nominal est obligatoire.';
    } else if (isNaN(data.debit_nominal) || data.debit_nominal <= 0) {
        errors.debit_nominal = 'Le débit nominal doit être un nombre positif.';
    }
    if (!data.surface_panneaux.trim()) {
        errors.surface_panneaux = 'La surface du panneaux solaires est obligatoire.';
    } else if (isNaN(data.surface_panneaux) || data.surface_panneaux <= 0) {
        errors.surface_panneaux = 'La surface du panneaux solaires doit être un nombre positif.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}

export const validateFormPaiement = (data, setValidationErrors) => {
    const errors = {};

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}
