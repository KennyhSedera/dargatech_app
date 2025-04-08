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
    if (!data.ville.trim()) {
        errors.ville = 'La ville est obligatoire.';
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

    if (data.client_id <= 0) {
        errors.client_id = 'Le nom client est obligatoire.';
    }
    if (!data.montant.trim()) {
        errors.montant = 'Le montant est obligatoire.';
    } else if (isNaN(data.montant) || data.montant <= 0) {
        errors.montant = 'Le montant doit être un nombre positif.';
    }
    if (data.mode_paiement <= 0) {
        errors.mode_paiement = 'La mode de paiment est obligatoire.';
    }
    if (!data.periode_couverte.trim()) {
        errors.periode_couverte = 'La période couverte est obligatoire.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}


export const validateFormTypePaiement = (data, setValidationErrors) => {
    const errors = {};

    if (!data.name.trim()) {
        errors.name = 'Le nom du type est obligatoire.';
    }
    if (data.logo_path === null) {
        errors.logo_path = 'Logo est obligatoire.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}

export const validateFormMaintenance = (data, setValidationErrors) => {
    const errors = {};

    if (data.installation_id <= 0) {
        errors.installation_id = 'Le nom client avec date d\'installation est obligatoire.';
    }
    if (!data.description_probleme.trim()) {
        errors.description_probleme = 'La description du problème est obligatoire.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}

export const validateFormTechnicien = (data, setValidationErrors) => {
    const errors = {};

    if (!data.name.trim()) {
        errors.name = 'Le nom est obligatoire.';
    }
    if (!data.email.trim()) {
        errors.email = 'L\' adresse email est obligatoire.';
    }
    if (!data.adress.trim()) {
        errors.adress = 'L\'adresse est obligatoire.';
    }
    if (!data.speciality.trim()) {
        errors.speciality = 'La spécialité est obligatoire.';
    }
    if (!data.contact.trim()) {
        errors.contact = 'Le contact est obligatoire.';
    } else if (!/^\d{10}$/.test(data.contact)) {
        errors.contact = 'Le contact doit contenir 10 chiffres.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}

export function validateFormLogin(data, setValidationErrors) {
    const errors = {};

    if (!data.email.trim()) {
        errors.email = 'L\'email est obligatoire.';
    }
    if (!data.password.trim()) {
        errors.password = 'Le mot de passe est obligatoire.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}


export function validateFormAlert(data, setValidationErrors) {
    const errors = {};

    if (!data.message.trim()) {
        errors.message = 'La message est obligatoire.';
    }
    if (!data.type_alert.trim()) {
        errors.type_alert = 'Le type d\'alerte est obligatoire.';
    }
    if (data.client_id <= 0) {
        errors.client_id = 'Le nom client est obligatoire.';
    }
    if (data.installation_id <= 0) {
        errors.installation_id = 'Le code d\'installation est obligatoire.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
}

export const validateRapportMaintenanceForm = (data, setValidationErrors) => {
    const errors = {};

    if (!data.description_probleme.trim()) {
        errors.description_probleme = 'Le problème rapporté est obligatoire';
    }

    if (!data.verifications_preliminaires.trim()) {
        errors.verifications_preliminaires = 'Les vérifications préliminaires sont obligatoires';
    }

    if (!data.resultat_diagnostic.trim()) {
        errors.resultat_diagnostic = 'Le résultat du diagnostic est obligatoire';
    }

    if (!data.actions_correctives.trim()) {
        errors.actions_correctives = 'Les actions correctives sont obligatoires';
    }

    if (!data.verification_fonctionnement.trim()) {
        errors.verification_fonctionnement = 'La vérification du fonctionnement est obligatoire';
    }

    if (!data.date_intervention) {
        errors.date_intervention = 'La date d\'intervention est obligatoire';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
};