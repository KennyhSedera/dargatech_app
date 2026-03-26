import InputAutocomplete from "@/Components/inputs/InputAutocomplete ";
import InputError from "@/Components/inputs/InputError";
import InputLabel from "@/Components/inputs/InputLabel";
import SelectInput from "@/Components/inputs/SelectInput";
import TextArea from "@/Components/inputs/TextArea";
import TextInput from "@/Components/inputs/TextInput";
import Snackbar from "@/Components/Snackbar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getinstallations } from "@/Services/installationService";
import { Head } from "@inertiajs/react";
import React, { useCallback, useEffect, useState } from "react";

const FormMaintenanceMany = ({ datas = [] }) => {
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
    const [installation, setInstallation] = useState([]);
    const [data, setData] = useState(
        datas.map((e) => ({
            id: e.id,
            installation_id: e.installation_id ?? 0,
            date_intervention:
                e.date_intervention ?? new Date().toISOString().split("T")[0],
            type_intervention: e.type_intervention ?? "préventive",
            description_probleme: e.description_probleme ?? "",
            solutions_apportees: e.solutions_apportees ?? "",
            duree_intervention: e.duree_intervention ?? "",
        })),
    );

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

    useEffect(() => {
        getInstallation();
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

    const clearFieldError = useCallback((fieldName, i) => {
        setValidationErrors((prev) =>
            prev.map((err, idx) =>
                idx === i ? { ...err, [fieldName]: "" } : err,
            ),
        );
    }, []);

    const handleSelect = useCallback(
        (item, i) => {
            handleChange(i, "installation_id", item.id);
            clearFieldError("installation_id", i);
        },
        [clearFieldError],
    );

    const handleSubmit = async () => {
        setBtnLoading(true);
        try {
            const { data: result } = await axios.put(
                "/api/maintenance/update-many",
                { interventions: data },
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
                        const match = key.match(/^interventions\.(\d+)\.(.+)$/);
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
            <Head title="Form Intervention" />
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
                        Modification des plusieurs Interventions
                    </div>
                    <div className="grid grid-cols-1 gap-4 my-6 md:grid-cols-2">
                        {data.map((e, i) => (
                            <form
                                key={i}
                                className="grid w-full grid-cols-1 gap-2 p-4 bg-white rounded-md shadow-sm sm:grid-cols-2 dark:bg-gray-800"
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="installation_id"
                                        value="Code d'instalation"
                                    />
                                    <InputAutocomplete
                                        data={installation}
                                        className="block w-full mt-1"
                                        onSelect={(item) =>
                                            handleSelect(item, i)
                                        }
                                        defaultValue={e.installation_id}
                                        onFocus={() =>
                                            clearFieldError(
                                                "installation_id",
                                                i,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors.installation_id
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
                                        value={e.type_intervention}
                                        className="block w-full mt-1"
                                        autoComplete="type_intervention"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "type_intervention",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    >
                                        <option value="préventive">
                                            Préventive
                                        </option>
                                        <option value="curative">
                                            Curative
                                        </option>
                                    </SelectInput>
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="description_probleme"
                                        value="Description du problème"
                                    />
                                    <TextArea
                                        id="description_probleme"
                                        name="description_probleme"
                                        value={e.description_probleme}
                                        className="block w-full mt-1"
                                        autoComplete="description_probleme"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "description_probleme",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        rows={4}
                                        onFocus={() =>
                                            clearFieldError(
                                                "description_probleme",
                                                i,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors.description_probleme
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
                                        value={e.date_intervention}
                                        className="block w-full mt-1"
                                        autoComplete="date_intervention"
                                        type="date"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "date_intervention",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        onFocus={() =>
                                            clearFieldError(
                                                "date_intervention",
                                                i,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors.date_intervention
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

export default FormMaintenanceMany;
