import InputError from "@/Components/inputs/InputError";
import InputLabel from "@/Components/inputs/InputLabel";
import SelectInput from "@/Components/inputs/SelectInput";
import TextInput from "@/Components/inputs/TextInput";
import Snackbar from "@/Components/Snackbar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const FormulaireClientMany = ({ clients = [] }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState(
        clients.map(() => ({})),
    );
    const [data, setData] = useState(
        clients.map((el) => ({
            id: el.id,
            nom: el.nom ?? "",
            prenom: el.prenom ?? "",
            email: el.email ?? "",
            genre: el.genre ?? "Homme",
            CIN: el.CIN ?? "",
            telephone: el.telephone ?? "",
            localisation: el.localisation ?? "",
            surface_cultivee: el.surface_cultivee ?? "",
            type_activite_agricole: el.type_activite_agricole ?? "",
            created_via: el.created_via ?? "web",
        })),
    );
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success",
    });

    useEffect(() => {
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

    const handleSubmit = async () => {
        setBtnLoading(true);
        try {
            const { data: result } = await axios.put(
                "/api/clients/update-many",
                { clients: data },
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
                        const match = key.match(/^clients\.(\d+)\.(.+)$/);
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
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Form Maraîchers" />
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
                        Modification des plusieurs Maraîchers
                    </div>
                    <div className="grid grid-cols-1 gap-4 my-6 md:grid-cols-2">
                        {data.map((el, i) => (
                            <form
                                key={i}
                                className="grid w-full grid-cols-1 gap-4 p-4 bg-white rounded-md shadow-sm sm:grid-cols-3 dark:bg-gray-800"
                            >
                                <div>
                                    <InputLabel htmlFor="nom" value="Nom" />
                                    <TextInput
                                        id="nom"
                                        name="nom"
                                        value={el.nom}
                                        className="block w-full mt-1"
                                        autoComplete="nom"
                                        isFocused={true}
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "nom",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        onFocus={() =>
                                            setValidationErrors((prev) =>
                                                prev.map((err, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...err,
                                                              nom: "",
                                                          }
                                                        : err,
                                                ),
                                            )
                                        }
                                    />
                                    <InputError
                                        message={validationErrors[i]?.nom}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="prenom"
                                        value="Prénom"
                                    />
                                    <TextInput
                                        id="prenom"
                                        name="prenom"
                                        value={el.prenom}
                                        className="block w-full mt-1"
                                        autoComplete="prenom"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "prenom",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        onFocus={() =>
                                            setValidationErrors((prev) =>
                                                prev.map((err, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...err,
                                                              prenom: "",
                                                          }
                                                        : err,
                                                ),
                                            )
                                        }
                                    />
                                    <InputError
                                        message={validationErrors[i]?.prenom}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        name="email"
                                        value={el.email}
                                        className="block w-full mt-1"
                                        autoComplete="email"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        onFocus={() =>
                                            setValidationErrors((prev) =>
                                                prev.map((err, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...err,
                                                              email: "",
                                                          }
                                                        : err,
                                                ),
                                            )
                                        }
                                    />
                                    <InputError
                                        message={validationErrors[i]?.email}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="genre" value="Sexe" />
                                    <SelectInput
                                        id="genre"
                                        type="genre"
                                        name="genre"
                                        value={el.genre}
                                        className="block w-full mt-1"
                                        autoComplete="genre"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "genre",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    >
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>
                                    </SelectInput>
                                    <InputError
                                        message={validationErrors[i]?.genre}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="telephone"
                                        value="Téléphone"
                                    />
                                    <TextInput
                                        id="telephone"
                                        name="telephone"
                                        value={el.telephone}
                                        className="block w-full mt-1"
                                        autoComplete="telephone"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "telephone",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        onFocus={() =>
                                            setValidationErrors((prev) =>
                                                prev.map((err, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...err,
                                                              telephone: "",
                                                          }
                                                        : err,
                                                ),
                                            )
                                        }
                                    />
                                    <InputError
                                        message={validationErrors[i]?.telephone}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="localisation"
                                        value="Localisation ou adresse"
                                    />
                                    <TextInput
                                        id="localisation"
                                        name="localisation"
                                        value={el.localisation}
                                        className="block w-full mt-1"
                                        autoComplete="localisation"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "localisation",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        onFocus={() =>
                                            setValidationErrors((prev) =>
                                                prev.map((err, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...err,
                                                              localisation: "",
                                                          }
                                                        : err,
                                                ),
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors[i]?.localisation
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="type_activite_agricole"
                                        value="Type activité agricole"
                                    />
                                    <TextInput
                                        id="type_activite_agricole"
                                        name="type_activite_agricole"
                                        value={el.type_activite_agricole}
                                        className="block w-full mt-1"
                                        autoComplete="type_activite_agricole"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "type_activite_agricole",
                                                e.target.value,
                                            )
                                        }
                                        requiredonFocus={() =>
                                            setValidationErrors((prev) =>
                                                prev.map((err, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...err,
                                                              type_activite_agricole:
                                                                  "",
                                                          }
                                                        : err,
                                                ),
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors[i]
                                                ?.type_activite_agricole
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="surface_cultivee"
                                        value="Surface cultivée (en ha)"
                                    />
                                    <TextInput
                                        id="surface_cultivee"
                                        name="surface_cultivee"
                                        value={el.surface_cultivee}
                                        className="block w-full mt-1"
                                        autoComplete="surface_cultivee"
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                "surface_cultivee",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        onFocus={() =>
                                            setValidationErrors((prev) =>
                                                prev.map((err, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...err,
                                                              surface_cultivee:
                                                                  "",
                                                          }
                                                        : err,
                                                ),
                                            )
                                        }
                                    />
                                    <InputError
                                        message={
                                            validationErrors[i]
                                                ?.surface_cultivee
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

export default FormulaireClientMany;
