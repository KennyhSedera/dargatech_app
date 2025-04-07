import { useEffect, useState } from "react";

export default function useTheme() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (selectedTheme) => {
            if (selectedTheme === "dark" ||
                (selectedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        };

        applyTheme(theme);
        localStorage.setItem("theme", theme);

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const changeListener = (e) => applyTheme(e.matches ? "dark" : "light");
            mediaQuery.addEventListener("change", changeListener);
            return () => mediaQuery.removeEventListener("change", changeListener);
        }
    }, [theme]);

    return { theme, setTheme };
}
