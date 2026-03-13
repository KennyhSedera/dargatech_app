export function formatRelativeDate(date) {
    const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
    const diff = Math.round(
        (new Date(date) - new Date()) / (1000 * 60 * 60 * 24),
    );

    if (Math.abs(diff) < 1) return "aujourd'hui";
    if (Math.abs(diff) < 7) return rtf.format(diff, "day");
    if (Math.abs(diff) < 30) return rtf.format(Math.round(diff / 7), "week");
    if (Math.abs(diff) < 365) return rtf.format(Math.round(diff / 30), "month");
    return rtf.format(Math.round(diff / 365), "year");
}

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
