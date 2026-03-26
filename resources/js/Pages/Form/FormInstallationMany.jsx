import InputAutocomplete from "@/Components/inputs/InputAutocomplete ";
import InputError from "@/Components/inputs/InputError";
import InputLabel from "@/Components/inputs/InputLabel";
import SelectInput from "@/Components/inputs/SelectInput";
import TextInput from "@/Components/inputs/TextInput";
import Snackbar from "@/Components/Snackbar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getClients } from "@/Services/clientService";
import { getLocationDetails } from "@/utils/geoLocationUtils";
import { Head } from "@inertiajs/react";
import React, { useCallback, useEffect, useState } from "react";

const FormInstallationMany = ({ datas = [] }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState(
        datas.map(() => ({})),
    );
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success",
    });
    const [clients, setClients] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [data, setData] = useState(
        datas.map((el) => ({
            id: el.id,
            client_id: el.client_id ?? 0,
            code_installation: el.code_installation ?? "",
            date_installation: el.date_installation ?? "",
            debit_nominal: el.debit_nominal ?? "",
            hmt: el.hmt ?? "",
            numero_serie: el.numero_serie ?? "",
            profondeur_forage: el.profondeur_forage ?? "",
            puissance_pompe: el.puissance_pompe ?? "",
            source_eau: el.source_eau ?? "Puits",
            created_via: el.created_via ?? "web",
            latitude: el.localisation?.latitude ?? "",
            longitude: el.localisation?.longitude ?? "",
            pays: el.localisation?.pays ?? "",
            ville: el.localisation?.ville ?? "",
            localisation_id: el.localisation_id,
        })),
    );

    const getClient = useCallback(async () => {
        try {
            const [{ clients }] = await Promise.all([getClients()]);
            const clientFormat = clients
                .filter((el) => el.is_payed !== false)
                .map((el) => ({
                    id: el.id,
                    nom: `${el.nom} ${el.prenom}`,
                }));
            setClients(clientFormat);
        } catch (error) {
            console.error("Error fetching clients and installations:", error);
        }
    }, []);

    const clearFieldError = useCallback((fieldName, i) => {
        setValidationErrors((prev) =>
            prev.map((err, idx) =>
                idx === i ? { ...err, [fieldName]: "" } : err,
            ),
        );
    }, []);

    useEffect(() => {
        getClient();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleChange = (index, field, value) => {
        setData((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const handleSelect = useCallback(
        (item, i) => {
            handleChange(i, "client_id", item.id);
            clearFieldError("client_id", i);
        },
        [clearFieldError],
    );

    const getLocation = useCallback(
        async (lat, lng, index) => {
            if (!lat || !lng) return;
            setLocationLoading(true);
            try {
                const loc = await getLocationDetails(lat, lng);
                setData((prevData) =>
                    prevData.map((item, i) =>
                        i === index
                            ? {
                                  ...item,
                                  ville:
                                      loc.adresse || loc.village || loc.region,
                                  pays: loc.pays,
                              }
                            : item,
                    ),
                );
            } catch (error) {
                console.error("Error getting location:", error);
            } finally {
                setLocationLoading(false);
            }
        },
        [setData],
    );

    const coordinatesKey = data
        .map((d) => `${d.latitude},${d.longitude}`)
        .join("|");

    useEffect(() => {
        const timeouts = data.map((item, index) => {
            return setTimeout(() => {
                if (item.latitude && item.longitude) {
                    getLocation(item.latitude, item.longitude, index);
                }
            }, 500);
        });

        return () => timeouts.forEach(clearTimeout);
    }, [coordinatesKey]);

    const handleSubmit = async () => {
        setBtnLoading(true);
        try {
            const { data: result } = await axios.put(
                "/api/installation/update-many",
                { installations: data },
            );
            setAlert({
                open: true,
                message: result.message,
                type: "success",
            });

            setTimeout(() => {
                window.history.back();
                setBtnLoading(false);
            }, 3000);
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                console.error("Erreurs validation:", errors);

                const newErrors = data.map((_, i) => {
                    const itemErrors = {};
                    Object.keys(errors).forEach((key) => {
                        const match = key.match(/^installations\.(\d+)\.(.+)$/);
                        if (match && parseInt(match[1]) === i) {
                            itemErrors[match[2]] = errors[key][0];
                        }
                    });
                    return itemErrors;
                });

                setValidationErrors(newErrors);
            } else {
                console.error(
                    "Erreur:",
                    error.response?.data?.message || error.message,
                );
            }

            setBtnLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Form Installation" />
            <Snackbar
                message={alert.message}
                type={alert.type}
                duration={3000}
                position="top-right"
                show={alert.open}
                onClose={() => setAlert({ ...alert, message: "", open: false })}
            />
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="p-2">
                    <div className="mb-4 text-lg font-semibold text-center text-blue-500 md:text-2xl">
                        Modification des plusieurs Installations
                    </div>
                    <div className="grid grid-cols-1 gap-4 my-6 md:grid-cols-2">
                        {data.map((e, i) => (
                            <form
                                key={i}
                                className="grid w-full grid-cols-1 gap-2 p-4 bg-white rounded-md shadow-sm sm:grid-cols-3 dark:bg-gray-800"
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="client_id"
                                        value="Nom client "
                                    />
                                    <InputAutocomplete
                                        data={clients}
                                        className="block w-full mt-1"
                                        onSelect={(item) =>
                                            handleSelect(item, i)
                                        }
                                        defaultValue={e.client_id ?? ""}
                                        onFocus={() =>
                                            clearFieldError("client_id", i)
                                        }
                                    />
                                    <InputError
                                        message={validationErrors[i]?.client_id}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="numero_serie"
                                        value="Numéro de série de la pompe "
                                    />
                                    <TextInput
                                        id="numero_serie"
                                        name="numero_serie"
                                        value={e.numero_serie}
                                        className="block w-full mt-1"
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "numero_serie",
                                                ev.target.value,
                                            )
                                        }
                                        required
                                        onFocus={() =>
                                            clearFieldError("numero_serie", i)
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors[i]?.numero_serie
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="source_eau"
                                        value="Source d'eau "
                                    />
                                    <SelectInput
                                        id="source_eau"
                                        name="source_eau"
                                        value={e.source_eau}
                                        className="block w-full mt-1"
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "source_eau",
                                                ev.target.value,
                                            )
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
                                            validationErrors[i]?.source_eau
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="hmt"
                                        value="HMT (m) "
                                    />
                                    <TextInput
                                        id="hmt"
                                        name="hmt"
                                        value={e.hmt}
                                        className="block w-full mt-1"
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "hmt",
                                                ev.target.value,
                                            )
                                        }
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        onFocus={() =>
                                            clearFieldError("hmt", i)
                                        }
                                    />
                                    <InputError
                                        message={validationErrors[i]?.hmt}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="profondeur_forage"
                                        value="Distance max pompe (m) "
                                    />
                                    <TextInput
                                        id="profondeur_forage"
                                        name="profondeur_forage"
                                        value={e.profondeur_forage}
                                        className="block w-full mt-1"
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "profondeur_forage",
                                                ev.target.value,
                                            )
                                        }
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        onFocus={() =>
                                            clearFieldError(
                                                "profondeur_forage",
                                                i,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors[i]
                                                ?.profondeur_forage
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="debit_nominal"
                                        value="Débit nominal (m³/h) "
                                    />
                                    <TextInput
                                        id="debit_nominal"
                                        name="debit_nominal"
                                        value={e.debit_nominal}
                                        className="block w-full mt-1"
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "debit_nominal",
                                                ev.target.value,
                                            )
                                        }
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        onFocus={() =>
                                            clearFieldError("debit_nominal", i)
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors[i]?.debit_nominal
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="puissance_pompe"
                                        value="Puissance crête installé (W) "
                                    />
                                    <TextInput
                                        id="puissance_pompe"
                                        name="puissance_pompe"
                                        value={e.puissance_pompe}
                                        className="block w-full mt-1"
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "puissance_pompe",
                                                ev.target.value,
                                            )
                                        }
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        onFocus={() =>
                                            clearFieldError(
                                                "puissance_pompe",
                                                i,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors[i]?.puissance_pompe
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="latitude"
                                        value="Latitude "
                                    />
                                    <TextInput
                                        id="latitude"
                                        name="latitude"
                                        value={e.latitude}
                                        className="block w-full mt-1"
                                        type="number"
                                        step="any"
                                        min="-90"
                                        max="90"
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "latitude",
                                                ev.target.value,
                                            )
                                        }
                                        onFocus={() =>
                                            clearFieldError("latitude", i)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={validationErrors[i]?.latitude}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="longitude"
                                        value="Longitude "
                                    />
                                    <TextInput
                                        id="longitude"
                                        name="longitude"
                                        value={e.longitude}
                                        className="block w-full mt-1"
                                        type="number"
                                        step="any"
                                        min="-180"
                                        max="180"
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "longitude",
                                                ev.target.value,
                                            )
                                        }
                                        onFocus={() =>
                                            clearFieldError("longitude", i)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={validationErrors[i]?.longitude}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="pays"
                                        value="Localisation"
                                    />
                                    <TextInput
                                        id="pays"
                                        name="pays"
                                        value={[e.ville, e.pays]
                                            .filter(Boolean)
                                            .join(", ")}
                                        readOnly
                                        className="block w-full mt-1 bg-gray-50"
                                    />
                                    {locationLoading && (
                                        <p className="mt-1 text-sm text-blue-500">
                                            Recherche de la localisation...
                                        </p>
                                    )}
                                    <InputError
                                        message={validationErrors[i]?.pays}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="date_installation"
                                        value="Date de l'installation "
                                    />
                                    <TextInput
                                        id="date_installation"
                                        name="date_installation"
                                        value={e.date_installation}
                                        className="block w-full mt-1"
                                        type="date"
                                        max={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(ev) =>
                                            handleChange(
                                                i,
                                                "date_installation",
                                                ev.target.value,
                                            )
                                        }
                                        required
                                        onFocus={() =>
                                            clearFieldError(
                                                "date_installation",
                                                i,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors[i]
                                                ?.date_installation
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </form>
                        ))}
                    </div>
                    <div className="flex">
                        <button
                            disabled={btnLoading}
                            onClick={handleSubmit}
                            className="flex px-4 py-2 text-white bg-blue-500 rounded-md"
                        >
                            {btnLoading ? (
                                "Chargement ..."
                            ) : (
                                <div className="flex">
                                    Enregistrer{" "}
                                    <span className="hidden md:block">
                                        la modification
                                    </span>
                                </div>
                            )}
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 ml-2 text-white bg-red-500 rounded-md"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default FormInstallationMany;
