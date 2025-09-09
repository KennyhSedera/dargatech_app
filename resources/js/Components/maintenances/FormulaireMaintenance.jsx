import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import TextInput from "../inputs/TextInput";
import InputLabel from "../inputs/InputLabel";
import { useForm } from "@inertiajs/react";
import InputError from "../inputs/InputError";
import {
    getinstallations,
    getinstallationsenpanne,
} from "@/Services/installationService";
import InputAutocomplete from "../inputs/InputAutocomplete ";
import { formatdate, formatDate } from "@/constant";
import {
    createmaintenances,
    updatemaintenances,
} from "@/Services/maintenanceService";
import SelectInput from "../inputs/SelectInput";
import { validateFormMaintenance } from "../validateForm";
import { getTechniciens } from "@/Services/technicienService";
import TextArea from "../inputs/TextArea";
import InputImage from "../inputs/InputImage";

const FormulaireMaintenance = ({
    open = true,
    setOpen,
    dataModify = {},
    onCloseFormulaire = () => {},
    idTechnicien,
}) => {
    const [btnTitle, setBtnTitle] = useState("Enregistrer");
    const [load, setLoad] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [installation, setInstallation] = useState([]);
    const { data, setData, errors, reset } = useForm({
        installation_id: 0,
        date_intervention: new Date().toISOString().split("T")[0],
        type_intervention: "préventive",
        description_probleme: "",
        solutions_apportees: "",
        duree_intervention: "",
        technicien: idTechnicien,
        photo_probleme: [],
    });
    const fileInputRef = useRef(null);

    const getInstallation = async () => {
        const [{ data }] = await Promise.all([getinstallations()]);
        const installationFormat = data
            .filter((el) => el.statuts !== "en panne")
            .map((el) => ({
                id: el.id,
                nom: el.code_installation,
            }));
        setInstallation(installationFormat);
    };

    const onClose = (message) => {
        setOpen(false);
        clearForm();
        onCloseFormulaire(message);
    };

    const clearForm = () => {
        reset();
        setLoad(false);
        setBtnTitle("Enregistrer");
        setValidationErrors({});
    };

    useEffect(() => {
        getInstallation();
        if (dataModify.id) {
            setData({
                installation_id: dataModify.installation_id || 0,
                date_intervention:
                    formatDate(dataModify.date_intervention) ||
                    new Date().toISOString().split("T")[0],
                type_intervention: dataModify.type_intervention || "",
                description_probleme: dataModify.description_probleme || "",
                solutions_apportees: dataModify.solutions_apportees || "",
                duree_intervention: dataModify.duree_intervention || "",
                technicien: dataModify.technicien_id || 0,
            });
            setBtnTitle("Modifier");
        } else {
            clearForm();
        }
    }, [dataModify, setData]);

    useEffect(() => {
        if (idTechnicien) {
            setData("technicien", idTechnicien);
        }
    }, [idTechnicien, setData]);

    const submit = async () => {
        if (!validateFormMaintenance(data, setValidationErrors)) {
            return;
        }

        setLoad(true);
        setBtnTitle("Chargement...");
        try {
            let message;
            if (btnTitle === "Enregistrer") {
                ({ message } = await createmaintenances(data));
            } else {
                ({ message } = await updatemaintenances(dataModify.id, data));
            }
            onClose(message);
        } catch (error) {
            console.error("Error submitting payment:", error);
        } finally {
            setLoad(false);
            setBtnTitle("Enregistrer");
        }
    };

    const handleSelect = (item) => {
        setData({
            ...data,
            installation_id: item.id,
            description_probleme: item.message,
        });
    };

    const onLoadFile = (files) => {
        setData("photo_probleme", files);
        if (validationErrors.photo_probleme) {
            setValidationErrors({
                ...validationErrors,
                photo_probleme: "",
            });
        }
    };

    return (
        <Modal show={open} closeable={false} onClose={onClose} maxWidth="4xl">
            <div className="text-2xl font-semibold text-center">
                {dataModify.nom
                    ? "Modifier une Intervention"
                    : "Ajouter une Intervention"}
            </div>
            <form className="grid w-full grid-cols-2 gap-4 px-6 my-6">
                <div>
                    <InputLabel
                        htmlFor="installation_id"
                        value="Code d'instalation"
                    />
                    <InputAutocomplete
                        data={installation}
                        className="block w-full mt-1"
                        onSelect={handleSelect}
                        defaultValue={data.installation_id}
                        readOnly={dataModify.id}
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                installation_id: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            validationErrors.installation_id ||
                            errors.installation_id
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="type_intervention"
                        value="Type d'intervention"
                    />
                    <SelectInput
                        id="type_intervention"
                        type="type_intervention"
                        name="type_intervention"
                        value={data.type_intervention}
                        className="block w-full mt-1"
                        autoComplete="type_intervention"
                        onChange={(e) =>
                            setData("type_intervention", e.target.value)
                        }
                        required
                    >
                        <option value="préventive">Préventive</option>
                        <option value="curative">Curative</option>
                    </SelectInput>
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="col-span-2">
                    <InputLabel
                        htmlFor="description_probleme"
                        value="Description du problème"
                    />
                    <TextArea
                        id="description_probleme"
                        name="description_probleme"
                        value={data.description_probleme}
                        className="block w-full mt-1"
                        autoComplete="description_probleme"
                        onChange={(e) =>
                            setData("description_probleme", e.target.value)
                        }
                        required
                        rows={4}
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                description_probleme: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            validationErrors.description_probleme ||
                            errors.description_probleme
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="solutions_apportees"
                        value="Photo du problème"
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
                    <InputError
                        message={
                            validationErrors.photo_probleme ||
                            errors.photo_probleme
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="date_intervention"
                        value="Date d'intervention"
                    />
                    <TextInput
                        id="date_intervention"
                        name="date_intervention"
                        value={data.date_intervention}
                        className="block w-full mt-1"
                        autoComplete="date_intervention"
                        type="date"
                        onChange={(e) =>
                            setData("date_intervention", e.target.value)
                        }
                        required
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                date_intervention: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            validationErrors.date_intervention ||
                            errors.date_intervention
                        }
                        className="mt-2"
                    />
                </div>
            </form>
            <div className="flex items-center justify-end gap-4 px-6">
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
                    {btnTitle}
                </button>
            </div>
        </Modal>
    );
};

export default FormulaireMaintenance;
