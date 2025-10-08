import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export default function useTheme() {
    const user = usePage().props.auth.user;

    // Fonction pour récupérer le thème de l'utilisateur actuel
    const getUserTheme = () => {
        try {
            const stored = localStorage.getItem("themeSettings");
            if (stored) {
                const settings = JSON.parse(stored);
                const userSetting = settings.find((s) => s.user === user.id);
                return userSetting ? userSetting.theme : "light";
            }
        } catch (error) {
            console.error("Erreur lors de la lecture du thème:", error);
        }
        return "light";
    };

    const [theme, setThemeState] = useState(getUserTheme());

    // Fonction pour sauvegarder le thème de l'utilisateur actuel
    const saveUserTheme = (newTheme) => {
        try {
            const stored = localStorage.getItem("themeSettings");
            let settings = stored ? JSON.parse(stored) : [];

            const userIndex = settings.findIndex((s) => s.user === user.id);

            if (userIndex !== -1) {
                settings[userIndex].theme = newTheme;
            } else {
                settings.push({ theme: newTheme, user: user.id });
            }

            localStorage.setItem("themeSettings", JSON.stringify(settings));
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du thème:", error);
        }
    };

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        saveUserTheme(newTheme);
    };

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (selectedTheme) => {
            if (
                selectedTheme === "dark" ||
                (selectedTheme === "system" &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        };

        applyTheme(theme);

        if (theme === "system") {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            const changeListener = (e) => applyTheme(theme);
            mediaQuery.addEventListener("change", changeListener);
            return () =>
                mediaQuery.removeEventListener("change", changeListener);
        }
    }, [theme]);

    return { theme, setTheme };
}
