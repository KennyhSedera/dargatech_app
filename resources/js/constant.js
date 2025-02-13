import {
    MdHome,
    MdPayment,
    MdBuild,
    MdPeople,
    MdAssessment,
    MdSettings,
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
