import moment from "moment";
import {
    MdHome,
    MdPayment,
    MdBuild,
    MdPeople,
    MdAssessment,
    // MdSettings,
    MdSolarPower
} from "react-icons/md";

const sidebarPages = [
    { route: "dashboard", label: "Tableau de bord", icon: MdHome },
    { route: "clients", label: "Clients", icon: MdPeople },
    { route: "pompes", label: "Pompes Solaires", icon: MdSolarPower },
    { route: "installations", label: "Installations", icon: MdBuild },
    { route: "paiements", label: "Paiements", icon: MdPayment },
    { route: "interventions", label: "Interventions", icon: MdAssessment },
    // { route: "parametres", label: "Paramètres", icon: MdSettings },
];

export default sidebarPages;

export const logo = '/images/logo.png';
export const titre = '/images/titre.png';

export const formatdate = (date) => {
    if (!date || moment(date).isValid()) {
        return moment(date).format('DD/MM/YYYY');
    } else {
        console.error('Date invalide:', date);
        return '';
    }
};

export const parsedate = (date) => {
    const parsed = moment(date, 'DD/MM/YYYY', true);
    if (parsed.isValid()) {
        return parsed.toDate();
    } else {
        console.error('Date invalide pour parsing:', date);
        return null;
    }
};


export const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('fr-CA');
};
