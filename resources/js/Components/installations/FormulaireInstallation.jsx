import React, { useEffect, useState, useCallback, useRef } from "react";
import Modal from "../Modal";
import TextInput from "../inputs/TextInput";
import InputLabel from "../inputs/InputLabel";
import { useForm } from "@inertiajs/react";
import InputError from "../inputs/InputError";
import {
    createinstallations,
    getinstallations,
    updateinstallations,
} from "@/Services/installationService";
import InputAutocomplete from "../inputs/InputAutocomplete ";
import { getClients } from "@/Services/clientService";
import { formatDate } from "@/constant";
import SelectInput from "../inputs/SelectInput";
import { getLocationDetails } from "@/utils/geoLocationUtils";
import InputImage from "../inputs/InputImage";

const FormulaireInstallation = ({
    open = true,
    setOpen,
    dataModify = {},
    onCloseFormulaire = () => {},
    token_data,
}) => {
    const [btnTitle, setBtnTitle] = useState("Enregistrer");
    const [load, setLoad] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [clients, setClients] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const fileInputRef = useRef(null);

    const { data, setData, errors, reset } = useForm({
        client_id: "",
        date_installation: new Date().toISOString().split("T")[0],
        puissance_pompe: "",
        profondeur_forage: "",
        debit_nominal: "",
        numero_serie: "",
        code_installation: "",
        source_eau: "Puits",
        hmt: "",
        latitude: "",
        longitude: "",
        pays: "",
        ville: "",
        statuts: "installée",
        photos_installation: [],
        qte_eau: "",
        qte_co2: "",
    });

    const generateNextInstallationCode = useCallback((installations) => {
        if (!installations || installations.length === 0) {
            return "I0001";
        }

        const maxCode = installations.reduce((max, el) => {
            const match = el.code_installation?.match(/I(\d+)/);
            if (match) {
                const currentNumber = parseInt(match[1], 10);
                return currentNumber > max ? currentNumber : max;
            }
            return max;
        }, 0);

        const nextNumber = maxCode + 1;
        return `I${String(nextNumber).padStart(4, "0")}`;
    }, []);

    const getClient = useCallback(async () => {
        try {
            const [{ clients }, installation] = await Promise.all([
                getClients(),
                getinstallations(),
            ]);

            const clientFormat = clients
                .filter((el) => el.is_payed !== false)
                .map((el) => ({
                    id: el.id,
                    nom: `${el.nom} ${el.prenom}`,
                }));

            const newCode = generateNextInstallationCode(installation.data);

            setClients(clientFormat);
            if (!dataModify.id) {
                setData("code_installation", newCode);
            }
        } catch (error) {
            console.error("Error fetching clients and installations:", error);
        }
    }, [dataModify.id, setData, generateNextInstallationCode]);

    const onClose = useCallback(
        (message) => {
            setOpen(false);
            clearForm();
            onCloseFormulaire(message);
        },
        [setOpen, onCloseFormulaire]
    );

    const clearForm = useCallback(() => {
        setData({
            client_id: "",
            date_installation: new Date().toISOString().split("T")[0],
            puissance_pompe: "",
            profondeur_forage: "",
            debit_nominal: "",
            numero_serie: "",
            code_installation: "I0001",
            source_eau: "Puits",
            hmt: "",
            latitude: "",
            longitude: "",
            pays: "",
            ville: "",
            statuts: "installée",
            photos_installation: [],
            qte_eau: "",
            qte_co2: "",
        });
        setLoad(false);
        setBtnTitle("Enregistrer");
        setValidationErrors({});
    }, [setData]);

    const clearFieldError = useCallback((fieldName) => {
        setValidationErrors((prev) => ({
            ...prev,
            [fieldName]: "",
        }));
    }, []);

    useEffect(() => {
        getClient();

        if (dataModify.id) {
            setData({
                client_id: dataModify.client_id || "",
                date_installation:
                    formatDate(dataModify.date_installation) ||
                    new Date().toISOString().split("T")[0],
                puissance_pompe: dataModify.puissance_pompe || "",
                profondeur_forage: dataModify.profondeur_forage || "",
                debit_nominal: dataModify.debit_nominal || "",
                numero_serie: dataModify.numero_serie || "",
                code_installation: dataModify.code_installation || "",
                source_eau: dataModify.source_eau || "Puits",
                hmt: dataModify.hmt || "",
                ville: dataModify.localisation?.ville || "Kara",
                pays: dataModify.localisation?.pays || "Togo",
                latitude: dataModify.latitude || "",
                longitude: dataModify.longitude || "",
                statuts: dataModify.statuts || "installée",
                photos_installation: dataModify.photos_installation || [],
                created_via: dataModify.created_via || "web",
                qte_eau: dataModify.qte_eau || 0,
                qte_co2: dataModify.qte_co2 || 0,
            });
            setBtnTitle("Modifier");
        } else {
            clearForm();
        }
    }, [dataModify, setData, clearForm]);

    const getLocation = useCallback(
        async (lat, lng) => {
            if (!lat || !lng) {
                console.warn(
                    "Latitude and longitude are required for location lookup"
                );
                return;
            }

            setLocationLoading(true);
            try {
                const loc = await getLocationDetails(lat, lng);
                setData((prevData) => ({
                    ...prevData,
                    ville:
                        loc.region ||
                        loc.village ||
                        loc.adresse ||
                        prevData.ville,
                    pays: loc.pays || prevData.pays,
                }));
            } catch (error) {
                console.error("Error getting location:", error);
            } finally {
                setLocationLoading(false);
            }
        },
        [setData]
    );

    const validateForm = (formData) => {
        const errors = {};

        if (
            !formData.client_id ||
            formData.client_id === "" ||
            formData.client_id === 0
        ) {
            errors.client_id = "Veuillez sélectionner un client";
        }

        const numericFields = [
            "puissance_pompe",
            "profondeur_forage",
            "debit_nominal",
            "hmt",
        ];
        numericFields.forEach((field) => {
            if (!formData[field] || formData[field] === "") {
                errors[field] = `Le champ ${field} est requis`;
            } else if (
                isNaN(formData[field]) ||
                parseFloat(formData[field]) <= 0
            ) {
                errors[field] = `Le champ ${field} doit être un nombre positif`;
            }
        });
        const textFields = ["numero_serie", "code_installation"];
        textFields.forEach((field) => {
            if (!formData[field] || formData[field].trim() === "") {
                errors[field] = `Le champ ${field} est requis`;
            }
        });

        if (!formData.latitude || formData.latitude === "") {
            errors.latitude = "La latitude est requise";
        } else if (
            isNaN(formData.latitude) ||
            parseFloat(formData.latitude) < -90 ||
            parseFloat(formData.latitude) > 90
        ) {
            errors.latitude = "La latitude doit être comprise entre -90 et 90";
        }

        if (!formData.longitude || formData.longitude === "") {
            errors.longitude = "La longitude est requise";
        } else if (
            isNaN(formData.longitude) ||
            parseFloat(formData.longitude) < -180 ||
            parseFloat(formData.longitude) > 180
        ) {
            errors.longitude =
                "La longitude doit être comprise entre -180 et 180";
        }

        if (!formData.date_installation) {
            errors.date_installation = "La date d'installation est requise";
        } else if (new Date(formData.date_installation) > new Date()) {
            errors.date_installation =
                "La date d'installation ne peut pas être dans le futur";
        }

        if (!formData.qte_co2 || formData.qte_co2 === 0) {
            errors.qte_co2 = "La quantité de CO2 evité est requise";
        }

        if (!formData.qte_eau || formData.qte_eau === 0) {
            errors.qte_eau = "La quantité d'eau pompée est requise";
        }

        return { isValid: Object.keys(errors).length === 0, errors };
    };

    const submit = async () => {
        const isCreating = btnTitle === "Enregistrer";

        const validation = validateForm(data);
        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            return;
        }

        setLoad(true);
        setBtnTitle("Chargement...");

        try {
            let submitData;

            if (
                Array.isArray(data.photos_installation) &&
                data.photos_installation.length > 0
            ) {
                submitData = new FormData();

                submitData.append("client_id", parseInt(data.client_id));
                submitData.append("date_installation", data.date_installation);
                submitData.append(
                    "puissance_pompe",
                    parseFloat(data.puissance_pompe)
                );
                submitData.append(
                    "profondeur_forage",
                    parseFloat(data.profondeur_forage)
                );
                submitData.append(
                    "debit_nominal",
                    parseFloat(data.debit_nominal)
                );
                submitData.append("numero_serie", data.numero_serie);
                submitData.append("code_installation", data.code_installation);
                submitData.append("source_eau", data.source_eau);
                submitData.append("hmt", parseFloat(data.hmt));
                submitData.append("latitude", parseFloat(data.latitude));
                submitData.append("longitude", parseFloat(data.longitude));
                submitData.append("pays", data.pays || "");
                submitData.append("ville", data.ville || "");
                submitData.append("statuts", data.statuts);
                submitData.append(
                    "created_via",
                    token_data ? "telegram_bot" : "web"
                );

                data.photos_installation.forEach((file) => {
                    submitData.append("photos_installation[]", file);
                });

                submitData.append("qte_co2", parseFloat(data.qte_co2));
                submitData.append("qte_eau", parseFloat(data.qte_eau));
            } else {
                submitData = {
                    client_id: parseInt(data.client_id),
                    date_installation: data.date_installation,
                    puissance_pompe: parseFloat(data.puissance_pompe),
                    profondeur_forage: parseFloat(data.profondeur_forage),
                    debit_nominal: parseFloat(data.debit_nominal),
                    numero_serie: data.numero_serie,
                    code_installation: data.code_installation,
                    source_eau: data.source_eau,
                    hmt: parseFloat(data.hmt),
                    latitude: parseFloat(data.latitude),
                    longitude: parseFloat(data.longitude),
                    pays: data.pays || "",
                    ville: data.ville || "",
                    statuts: data.statuts,
                    created_via: token_data ? "telegram_bot" : "web",
                    qte_co2: parseFloat(data.qte_co2),
                    qte_eau: parseFloat(data.qte_eau),
                };
            }

            let message;
            if (isCreating) {
                ({ message } = await createinstallations(submitData));
            } else {
                ({ message } = await updateinstallations(
                    dataModify.id,
                    submitData
                ));
            }
            onClose(message);
        } catch (error) {
            console.error("Error submitting installation:", error);
            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                setValidationErrors({
                    general: "Une erreur est survenue lors de la soumission.",
                });
            }
        } finally {
            setLoad(false);
            setBtnTitle(isCreating ? "Enregistrer" : "Modifier");
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const isValidCoordinates = data.latitude && data.longitude;
            if (isValidCoordinates) {
                getLocation(data.latitude, data.longitude);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [data.latitude, data.longitude, getLocation]);

    const handleSelect = useCallback(
        (item) => {
            setData("client_id", item.id);
            clearFieldError("client_id");
        },
        [setData, clearFieldError]
    );

    const handleInputChange = useCallback(
        (field, value) => {
            setData(field, value);
            clearFieldError(field);
        },
        [setData, clearFieldError]
    );

    const onLoadFile = (file) => {
        setData((prevData) => ({ ...prevData, photos_installation: file }));
        clearFieldError("photos_installation");
    };

    return (
        <Modal show={open} closeable={false} onClose={onClose} maxWidth="4xl">
            <div className="text-2xl font-semibold text-center">
                {dataModify.id
                    ? "Modifier une Installation"
                    : "Ajouter une Installation"}
            </div>

            {validationErrors.general && (
                <div className="p-3 mt-4 text-red-700 bg-red-100 border border-red-300 rounded">
                    {validationErrors.general}
                </div>
            )}

            <form className="grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-3">
                <div>
                    <InputLabel htmlFor="client_id" value="Nom client *" />
                    <InputAutocomplete
                        data={clients}
                        className="block w-full mt-1"
                        onSelect={handleSelect}
                        defaultValue={data.client_id ?? ""}
                        onFocus={() => clearFieldError("client_id")}
                    />
                    <InputError
                        message={validationErrors.client_id || errors.client_id}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="numero_serie"
                        value="Numéro de série de la pompe *"
                    />
                    <TextInput
                        id="numero_serie"
                        name="numero_serie"
                        value={data.numero_serie}
                        className="block w-full mt-1"
                        autoComplete="numero_serie"
                        onChange={(e) =>
                            handleInputChange("numero_serie", e.target.value)
                        }
                        required
                        onFocus={() => clearFieldError("numero_serie")}
                    />
                    <InputError
                        message={
                            validationErrors.numero_serie || errors.numero_serie
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="source_eau" value="Source d'eau *" />
                    <SelectInput
                        id="source_eau"
                        name="source_eau"
                        value={data.source_eau}
                        className="block w-full mt-1"
                        autoComplete="source_eau"
                        onChange={(e) =>
                            handleInputChange("source_eau", e.target.value)
                        }
                        required
                    >
                        <option value="Puits">Puits</option>
                        <option value="Forage">Forage</option>
                        <option value="Etang">Etang</option>
                        <option value="Barrage">Barrage</option>
                        <option value="Rivière">Rivière</option>
                    </SelectInput>
                    <InputError
                        message={
                            validationErrors.source_eau || errors.source_eau
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="hmt" value="HMT (m) *" />
                    <TextInput
                        id="hmt"
                        name="hmt"
                        value={data.hmt}
                        className="block w-full mt-1"
                        autoComplete="hmt"
                        onChange={(e) =>
                            handleInputChange("hmt", e.target.value)
                        }
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        onFocus={() => clearFieldError("hmt")}
                    />
                    <InputError
                        message={validationErrors.hmt || errors.hmt}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="profondeur_forage"
                        value="Distance maximale pompe champ PV (m) *"
                    />
                    <TextInput
                        id="profondeur_forage"
                        name="profondeur_forage"
                        value={data.profondeur_forage}
                        className="block w-full mt-1"
                        autoComplete="profondeur_forage"
                        onChange={(e) =>
                            handleInputChange(
                                "profondeur_forage",
                                e.target.value
                            )
                        }
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        onFocus={() => clearFieldError("profondeur_forage")}
                    />
                    <InputError
                        message={
                            validationErrors.profondeur_forage ||
                            errors.profondeur_forage
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="debit_nominal"
                        value="Débit nominal (m³/h) *"
                    />
                    <TextInput
                        id="debit_nominal"
                        name="debit_nominal"
                        value={data.debit_nominal}
                        className="block w-full mt-1"
                        autoComplete="debit_nominal"
                        onChange={(e) =>
                            handleInputChange("debit_nominal", e.target.value)
                        }
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        onFocus={() => clearFieldError("debit_nominal")}
                    />
                    <InputError
                        message={
                            validationErrors.debit_nominal ||
                            errors.debit_nominal
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="puissance_pompe"
                        value="Puissance crête installé (W) *"
                    />
                    <TextInput
                        id="puissance_pompe"
                        name="puissance_pompe"
                        value={data.puissance_pompe}
                        className="block w-full mt-1"
                        autoComplete="puissance_pompe"
                        onChange={(e) =>
                            handleInputChange("puissance_pompe", e.target.value)
                        }
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        onFocus={() => clearFieldError("puissance_pompe")}
                    />
                    <InputError
                        message={
                            validationErrors.puissance_pompe ||
                            errors.puissance_pompe
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="qte_eau"
                        value="Quantité d'eau pompée (m³) *"
                    />
                    <TextInput
                        id="qte_eau"
                        name="qte_eau"
                        value={data.qte_eau}
                        className="block w-full mt-1"
                        autoComplete="qte_eau"
                        onChange={(e) =>
                            handleInputChange("qte_eau", e.target.value)
                        }
                        required
                        type="number"
                        min="0"
                        onFocus={() => clearFieldError("qte_eau")}
                    />
                    <InputError
                        message={validationErrors.qte_eau || errors.qte_eau}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="qte_co2"
                        value="Quantité de CO2 evité (Kg) *"
                    />
                    <TextInput
                        id="qte_co2"
                        name="qte_co2"
                        value={data.qte_co2}
                        className="block w-full mt-1"
                        autoComplete="qte_co2"
                        onChange={(e) =>
                            handleInputChange("qte_co2", e.target.value)
                        }
                        required
                        type="number"
                        min="0"
                        onFocus={() => clearFieldError("qte_co2")}
                    />
                    <InputError
                        message={validationErrors.qte_co2 || errors.qte_co2}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="latitude" value="Latitude *" />
                    <TextInput
                        id="latitude"
                        name="latitude"
                        value={data.latitude}
                        className="block w-full mt-1"
                        autoComplete="latitude"
                        type="number"
                        step="any"
                        min="-90"
                        max="90"
                        onChange={(e) =>
                            handleInputChange("latitude", e.target.value)
                        }
                        onFocus={() => clearFieldError("latitude")}
                        required
                    />
                    <InputError
                        message={validationErrors.latitude || errors.latitude}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="longitude" value="Longitude *" />
                    <TextInput
                        id="longitude"
                        name="longitude"
                        value={data.longitude}
                        className="block w-full mt-1"
                        autoComplete="longitude"
                        type="number"
                        step="any"
                        min="-180"
                        max="180"
                        onChange={(e) =>
                            handleInputChange("longitude", e.target.value)
                        }
                        onFocus={() => clearFieldError("longitude")}
                        required
                    />
                    <InputError
                        message={validationErrors.longitude || errors.longitude}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="pays" value="Localisation" />
                    <TextInput
                        id="pays"
                        name="pays"
                        value={data.pays + ", " + data.ville}
                        readOnly
                        className="block w-full mt-1 bg-gray-50"
                        autoComplete="pays"
                    />
                    {locationLoading && (
                        <p className="mt-1 text-sm text-blue-500">
                            Recherche de la localisation...
                        </p>
                    )}
                    <InputError
                        message={validationErrors.pays || errors.pays}
                        className="mt-2"
                    />
                </div>

                <div className="md:col-span-2">
                    <InputLabel
                        htmlFor="photos_installation"
                        value="Photo de l'installation"
                    />
                    <InputImage
                        ref={fileInputRef}
                        selectedFiles={data.photos_installation}
                        onLoadFile={onLoadFile}
                        onFocus={() => clearFieldError("photos_installation")}
                        multiple={true}
                        placeholder="Sélectionner une photo"
                    />
                    <InputError
                        message={
                            validationErrors.photos_installation ||
                            errors.photos_installation
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="date_installation"
                        value="Date de l'installation *"
                    />
                    <TextInput
                        id="date_installation"
                        name="date_installation"
                        value={data.date_installation}
                        className="block w-full mt-1"
                        autoComplete="date_installation"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                            handleInputChange(
                                "date_installation",
                                e.target.value
                            )
                        }
                        required
                        onFocus={() => clearFieldError("date_installation")}
                    />
                    <InputError
                        message={
                            validationErrors.date_installation ||
                            errors.date_installation
                        }
                        className="mt-2"
                    />
                </div>
            </form>

            <div className="flex items-center justify-end px-1">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="px-4 py-2 text-red-500 rounded-md bg-red-400/10 hover:bg-red-400/20"
                        onClick={() => onClose("")}
                    >
                        Fermer
                    </button>
                    <button
                        type="submit"
                        className={`rounded-md py-2 px-4 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 ${
                            load && "opacity-50"
                        }`}
                        disabled={load}
                        onClick={submit}
                    >
                        {btnTitle}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default FormulaireInstallation;
