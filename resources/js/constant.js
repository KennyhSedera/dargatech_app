import moment from "moment";
import { HiMiniUsers, HiHome } from "react-icons/hi2";
import { IoAlertCircle, IoBuild } from "react-icons/io5";
// import { GiOilPump } from "react-icons/gi";
import { FaMoneyCheckDollar, FaPersonDigging } from "react-icons/fa6";
import { ImCogs } from "react-icons/im";

const sidebarPages = [
    { route: "dashboard", label: "Tableau de bord", icon: HiHome },
    { route: "clients", label: "Maraîchers", icon: HiMiniUsers },
    { route: "technicien", label: "Techniciens", icon: FaPersonDigging },
    // { route: "pompes", label: "Matériels", icon: GiOilPump },
    { route: "installations", label: "Installations", icon: IoBuild },
    // { route: "alert", label: "Alerts", icon: IoAlertCircle },
    { route: "interventions", label: "Maintenances", icon: ImCogs },
    { route: "paiements", label: "Paiements", icon: FaMoneyCheckDollar },
];

export const sidebarPagestech = [
    { route: "dashboard", label: "Tableau de bord", icon: HiHome },
    { route: "clients", label: "Maraîchers", icon: HiMiniUsers },
    { route: "installations", label: "Installations", icon: IoBuild },
    // { route: "alert", label: "Alerts", icon: IoAlertCircle },
    { route: "interventions", label: "Maintenances", icon: ImCogs },
    { route: "paiements", label: "Paiements", icon: FaMoneyCheckDollar },
];

export default sidebarPages;

export const logo = '/images/logo.png';
export const titre = '/images/titre.png';
export const nodata = '/images/nodata.webp';
export const nodata1 = '/images/nodata1.png';
export const nodata2 = '/images/nodata2.png';

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

export const generateRandomWord = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomWord = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomWord += characters[randomIndex];
    }
    return randomWord;
}

export function incrementCodeInstallation(code) {
    const prefix = code.slice(0, 1);
    const number = parseInt(code.slice(1), 10);
    const newNumber = (number + 1).toString().padStart(4, '0');
    return `${prefix}${newNumber}`;
}
