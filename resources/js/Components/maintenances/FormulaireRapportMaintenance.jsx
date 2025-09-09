import React, { useEffect, useRef, useState } from "react";
import InputLabel from "../inputs/InputLabel";
import InputError from "../inputs/InputError";
import TextInput from "../inputs/TextInput";
import TextArea from "../inputs/TextArea";
import Modal from "../Modal";
import InputImage from "../inputs/InputImage";
import { useForm } from "@inertiajs/react";
import { createRapportMaintenance } from "@/Services/maintenanceService";
import Snackbar from "@/Components/Snackbar";

const FormulaireRapportMaintenance = ({
    open = true,
    setOpen,
    dataModify = {},
    onCloseFormulaire = () => {},
    idTechnicien,
}) => {
    const today = new Date().toISOString().split("T")[0];

    const { data, setData, errors, reset } = useForm({
        clientId: 0,
        technicienId: idTechnicien,
        maintenanceId: 0,
        description_probleme: "",
        photo_probleme: [],
        verifications_preliminaires: "",
        resultat_diagnostic: "",
        actions_correctives: "",
        verification_fonctionnement: "",
        recommandations: "",
        date_intervention: today,
    });

    const [load, setload] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        show: false,
        message: "",
        type: "info",
    });

    useEffect(() => {
        if (dataModify) {
            setData("maintenanceId", dataModify.id);
            setData("clientId", dataModify.idclient);
            setData("description_probleme", dataModify.description_probleme);
        }
    }, [dataModify]);

    const fileInputRef = useRef(null);
    const [validationErrors, setValidationErrors] = useState({});

    const onClose = (message) => {
        setOpen(false);
        setData({
            clientId: 0,
            technicienId: idTechnicien || 1,
            maintenanceId: 0,
            description_probleme: "",
            photo_probleme: [],
            verifications_preliminaires: "",
            resultat_diagnostic: "",
            actions_correctives: "",
            verification_fonctionnement: "",
            recommandations: "",
            date_intervention: today,
        });
        onCloseFormulaire(message);
    };

    const onLoadFile = (files) => {
        // files est déjà un tableau grâce à multiple=true
        setData("photo_probleme", files);
        if (validationErrors.photo_probleme) {
            setValidationErrors({
                ...validationErrors,
                photo_probleme: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!data.description_probleme.trim()) {
            newErrors.description_probleme =
                "Le problème rapporté est obligatoire";
        }

        if (!data.verifications_preliminaires.trim()) {
            newErrors.verifications_preliminaires =
                "Les vérifications préliminaires sont obligatoires";
        }

        if (!data.resultat_diagnostic.trim()) {
            newErrors.resultat_diagnostic =
                "Le résultat du diagnostic est obligatoire";
        }

        if (!data.actions_correctives.trim()) {
            newErrors.actions_correctives =
                "Les actions correctives sont obligatoires";
        }

        if (!data.verification_fonctionnement.trim()) {
            newErrors.verification_fonctionnement =
                "La vérification du fonctionnement est obligatoire";
        }

        if (!data.date_intervention) {
            newErrors.date_intervention =
                "La date d'intervention est obligatoire";
        }

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async () => {
        if (!validateForm()) {
            return;
        }

        data.technicienId = idTechnicien;

        try {
            setload(true);

            // Vérifier la taille des fichiers avant l'envoi
            if (data.photo_probleme && Array.isArray(data.photo_probleme)) {
                for (const file of data.photo_probleme) {
                    if (file.size > 5 * 1024 * 1024) {
                        // 5MB
                        setSnackbar({
                            show: true,
                            message: `Le fichier ${file.name} est trop volumineux (max 5MB)`,
                            type: "error",
                        });
                        return;
                    }
                }
            }

            const formData = new FormData();
            formData.append("clientId", data.clientId);
            formData.append("technicienId", data.technicienId);
            formData.append("maintenanceId", data.maintenanceId);
            formData.append("description_probleme", data.description_probleme);

            // Gestion correcte des photos
            if (
                data.photo_probleme &&
                Array.isArray(data.photo_probleme) &&
                data.photo_probleme.length > 0
            ) {
                data.photo_probleme.forEach((file, index) => {
                    formData.append(`photo_probleme[${index}]`, file);
                });
            }

            formData.append(
                "verifications_preliminaires",
                data.verifications_preliminaires
            );
            formData.append("resultat_diagnostic", data.resultat_diagnostic);
            formData.append("actions_correctives", data.actions_correctives);
            formData.append(
                "verification_fonctionnement",
                data.verification_fonctionnement
            );
            formData.append("recommandations", data.recommandations || "");
            formData.append("date_intervention", data.date_intervention);

            const res = await createRapportMaintenance(formData);
            onClose(res.message);
        } catch (error) {
            console.error("Erreur lors de la création du rapport:", error);

            let errorMessage =
                "Une erreur est survenue lors de la création du rapport";

            setSnackbar({
                show: true,
                message: errorMessage,
                type: "error",
            });
        } finally {
            setload(false);
        }
    };

    return (
        <Modal show={open} closeable={false} onClose={onClose} maxWidth="xl">
            <div className="text-2xl font-semibold text-center">
                Formulaire rapport maintenance
            </div>
            <form className="grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2">
                <div>
                    <InputLabel
                        htmlFor="description_probleme"
                        value="Problème rapporté *"
                    />
                    <TextArea
                        id="description_probleme"
                        name="description_probleme"
                        value={data.description_probleme}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) =>
                            setData("description_probleme", e.target.value)
                        }
                        required
                        rows={3}
                        readOnly={true}
                        onFocus={() =>
                            setFormErrors({
                                ...formErrors,
                                description_probleme: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            formErrors.description_probleme ||
                            validationErrors.description_probleme ||
                            errors.description_probleme
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="verifications_preliminaires"
                        value="Vérifications préliminaires *"
                    />
                    <TextArea
                        id="verifications_preliminaires"
                        name="verifications_preliminaires"
                        value={data.verifications_preliminaires}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) =>
                            setData(
                                "verifications_preliminaires",
                                e.target.value
                            )
                        }
                        required
                        rows={3}
                        onFocus={() =>
                            setFormErrors({
                                ...formErrors,
                                verifications_preliminaires: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            formErrors.verifications_preliminaires ||
                            errors.verifications_preliminaires
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="resultat_diagnostic"
                        value="Résultat du diagnostic *"
                    />
                    <TextArea
                        id="resultat_diagnostic"
                        name="resultat_diagnostic"
                        value={data.resultat_diagnostic}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) =>
                            setData("resultat_diagnostic", e.target.value)
                        }
                        required
                        rows={3}
                        onFocus={() =>
                            setFormErrors({
                                ...formErrors,
                                resultat_diagnostic: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            formErrors.resultat_diagnostic ||
                            errors.resultat_diagnostic
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="actions_correctives"
                        value="Actions correctives *"
                    />
                    <TextArea
                        id="actions_correctives"
                        name="actions_correctives"
                        value={data.actions_correctives}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) =>
                            setData("actions_correctives", e.target.value)
                        }
                        required
                        rows={3}
                        onFocus={() =>
                            setFormErrors({
                                ...formErrors,
                                actions_correctives: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            formErrors.actions_correctives ||
                            errors.actions_correctives
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="verification_fonctionnement"
                        value="Vérification du fonctionnement *"
                    />
                    <TextArea
                        id="verification_fonctionnement"
                        name="verification_fonctionnement"
                        value={data.verification_fonctionnement}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) =>
                            setData(
                                "verification_fonctionnement",
                                e.target.value
                            )
                        }
                        required
                        rows={3}
                        onFocus={() =>
                            setFormErrors({
                                ...formErrors,
                                verification_fonctionnement: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            formErrors.verification_fonctionnement ||
                            errors.verification_fonctionnement
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="recommandations"
                        value="Recommandations au Client (optionnel)"
                    />
                    <TextArea
                        id="recommandations"
                        name="recommandations"
                        value={data.recommandations}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) =>
                            setData("recommandations", e.target.value)
                        }
                        rows={3}
                        onFocus={() =>
                            setFormErrors({
                                ...formErrors,
                                recommandations: "",
                            })
                        }
                    />
                    <InputError
                        message={errors.recommandations}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="photo_probleme"
                        value="Photo du problème (optionnel)"
                    />
                    <InputImage
                        ref={fileInputRef}
                        selectedFiles={data.photo_probleme}
                        onLoadFile={onLoadFile}
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                photo_probleme: "",
                            })
                        }
                        multiple={true}
                        placeholder="Sélectionner des photos"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="date_intervention"
                        value="Date de l'intervention *"
                    />
                    <TextInput
                        id="date_intervention"
                        name="date_intervention"
                        value={data.date_intervention}
                        className="block w-full mt-1"
                        autoComplete="off"
                        onChange={(e) =>
                            setData("date_intervention", e.target.value)
                        }
                        type="date"
                        required
                        onFocus={() =>
                            setFormErrors({
                                ...formErrors,
                                date_intervention: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            formErrors.date_intervention ||
                            errors.date_intervention
                        }
                        className="mt-2"
                    />
                </div>
            </form>
            <div className="flex items-center justify-end gap-4 px-1">
                <button
                    type="button"
                    className="px-4 py-1 text-red-500 rounded-md bg-red-400/10"
                    onClick={() => onClose("")}
                >
                    Fermer
                </button>
                <button
                    type="submit"
                    className={`rounded-md py-1 px-4 disabled:cursor-not-allowed bg-blue-500 text-white ${
                        load && "opacity-25"
                    }`}
                    disabled={load}
                    onClick={submit}
                >
                    {load ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>
            <Snackbar
                show={snackbar.show}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar({ ...snackbar, show: false })}
            />
        </Modal>
    );
};

export default FormulaireRapportMaintenance;
