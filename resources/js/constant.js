import moment from "moment";
import { HiMiniUsers, HiHome } from "react-icons/hi2";
import { IoAlertCircle, IoBuild } from "react-icons/io5";
import { FaMoneyCheckDollar, FaPersonDigging } from "react-icons/fa6";
import { ImCogs } from "react-icons/im";
import { FaUserCircle } from "react-icons/fa";
import { LuHandshake } from "react-icons/lu";

const sidebarPages = [
    { route: "dashboard", label: "Tableau de bord", icon: HiHome },
    { route: "clients", label: "Maraîchers", icon: HiMiniUsers },
    { route: "technicien", label: "Techniciens", icon: FaPersonDigging },
    { route: "installations", label: "Installations", icon: IoBuild },
    { route: "interventions", label: "Maintenances", icon: ImCogs },
    { route: "paiements", label: "Paiements", icon: FaMoneyCheckDollar },
    { route: "users", label: "Utilisateurs", icon: FaUserCircle },
    { route: "partenaires", label: "Partenaires", icon: LuHandshake },
];

export const sidebarPagestech = [
    { route: "dashboard", label: "Tableau de bord", icon: HiHome },
    { route: "clients", label: "Maraîchers", icon: HiMiniUsers },
    { route: "installations", label: "Installations", icon: IoBuild },
    { route: "interventions", label: "Maintenances", icon: ImCogs },
    { route: "paiements", label: "Paiements", icon: FaMoneyCheckDollar },
];

export const sidebarPagespart = [
    { route: "dashboard", label: "Tableau de bord", icon: HiHome },
    { route: "clients", label: "Maraîchers", icon: HiMiniUsers },
    { route: "installations", label: "Installations", icon: IoBuild },
    { route: "interventions", label: "Maintenances", icon: ImCogs },
];
export default sidebarPages;

export const logo = "/images/logo.png";
export const titre = "/images/titre.png";
export const nodata = "/images/nodata.webp";
export const nodata1 = "/images/nodata1.png";
export const nodata2 = "/images/nodata2.png";
export const togo = "/images/togo.png";
export const marker = "/images/marker.png";
export const formatdate = (date) => {
    if (!date || moment(date).isValid()) {
        return moment(date).format("DD/MM/YYYY");
    } else {
        console.error("Date invalide:", date);
        return "";
    }
};

export const parsedate = (date) => {
    const parsed = moment(date, "DD/MM/YYYY", true);
    if (parsed.isValid()) {
        return parsed.toDate();
    } else {
        console.error("Date invalide pour parsing:", date);
        return null;
    }
};

export const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("fr-CA");
};

export const generateRandomWord = (length = 8) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomWord = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomWord += characters[randomIndex];
    }
    return randomWord;
};

export function incrementCodeInstallation(code) {
    const prefix = code.slice(0, 1);
    const number = parseInt(code.slice(1), 10);
    const newNumber = (number + 1).toString().padStart(4, "0");
    return `${prefix}${newNumber}`;
}

export function incrementRecuNumber(current) {
    const parts = current.split("_");
    const numberStr = parts[2];
    const number = parseInt(numberStr, 10) + 1;

    const newNumberStr = number.toString().padStart(numberStr.length, "0");

    return `${parts[0]}_${parts[1]}_${newNumberStr}`;
}

export function incrementEcheanceNumber(current) {
    if (!current) return "T01";
    const prefix = current.charAt(0);
    const number = parseInt(current.slice(1), 10);
    const newNumber = number + 1;
    const paddedNumber = newNumber.toString().padStart(2, "0");

    return `${prefix}${paddedNumber}`;
}

export function formatMontant(montant, options = {}) {
    const num = parseFloat(montant);

    if (isNaN(num)) return "0";
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    if (options.separateur) {
        return num.toLocaleString("fr-FR");
    }

    return num.toString();
}

export function addFavicon() {
    const favicon = document.createElement("link");
    favicon.rel = "shortcut icon";
    favicon.href = logo;
    favicon.type = "image/png";

    document.head.appendChild(favicon);

    return () => {
        document.head.removeChild(favicon);
    };
}
