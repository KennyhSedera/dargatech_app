import React, { useState } from "react";
import Modal from "../Modal";
import InputLabel from "../inputs/InputLabel";
import InputError from "../inputs/InputError";
import TextInput from "../inputs/TextInput";
import { useForm } from "@inertiajs/react";
import { validateFormTechnicien } from "../validateForm";
import { createTechniciens } from "@/Services/technicienService";
import SelectInput from "../inputs/SelectInput";
import { generateRandomWord } from "@/constant";

const TechnicienFormulaire = ({
    open = false,
    setOpen,
    onCloseFormulaire = () => {},
}) => {
    const [btnTitle, setBtnTitle] = useState("Enregistrer");
    const [validationErrors, setValidationErrors] = useState({});
    const [load, setLoad] = useState(false);
    const { data, setData, errors, reset } = useForm({
        name: "",
        email: "",
        contact: "",
        password: "",
        adress: "",
        speciality: "",
        genre: "Homme",
        photo: "",
    });

    const onClose = (message) => {
        setOpen(false);
        clearForm();
        onCloseFormulaire(message);
    };

    const clearForm = () => {
        reset();
        setValidationErrors({});
    };

    const submit = async () => {
        if (!validateFormTechnicien(data, setValidationErrors)) {
            return;
        }

        setLoad(true);
        setBtnTitle("Loading ...");

        data.password = generateRandomWord(8);

        try {
            let message;
            if (btnTitle === "Enregistrer") {
                ({ message } = await createTechniciens(data));
            }
            onClose(message);
        } catch (error) {
            console.error("Error submitting payment:", error);
        } finally {
            setLoad(false);
            setBtnTitle("Enregistrer");
        }
    };

    return (
        <Modal show={open} closeable={false} onClose={onClose} maxWidth="4xl">
            <div className="text-2xl font-semibold text-center">
                Nouveau Technicien
            </div>
            <form className="grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="name" value="Nom" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        isFocused={true}
                        className="block w-full mt-1"
                        autoComplete="name"
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                name: "",
                            })
                        }
                    />
                    <InputError
                        message={validationErrors.name || errors.name}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        name="email"
                        value={data.email}
                        className="block w-full mt-1"
                        autoComplete="email"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                email: "",
                            })
                        }
                    />
                    <InputError
                        message={validationErrors.email || errors.email}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="genre" value="Sexe" />
                    <SelectInput
                        id="genre"
                        type="genre"
                        name="genre"
                        value={data.genre}
                        className="block w-full mt-1"
                        autoComplete="genre"
                        onChange={(e) => setData("genre", e.target.value)}
                        required
                    >
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                    </SelectInput>
                    <InputError message={errors.genre} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="contact" value="Contact" />
                    <TextInput
                        id="contact"
                        name="contact"
                        value={data.contact}
                        className="block w-full mt-1"
                        autoComplete="contact"
                        onChange={(e) => setData("contact", e.target.value)}
                        required
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                contact: "",
                            })
                        }
                    />
                    <InputError
                        message={validationErrors.contact || errors.contact}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="adress" value="Adresse" />
                    <TextInput
                        id="adress"
                        name="adress"
                        value={data.adress}
                        className="block w-full mt-1"
                        autoComplete="adress"
                        onChange={(e) => setData("adress", e.target.value)}
                        required
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                adress: "",
                            })
                        }
                    />
                    <InputError
                        message={validationErrors.adress || errors.adress}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="speciality" value="Spécialité" />
                    <TextInput
                        id="speciality"
                        name="speciality"
                        value={data.speciality}
                        className="block w-full mt-1"
                        autoComplete="adress"
                        onChange={(e) => setData("speciality", e.target.value)}
                        required
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                speciality: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            validationErrors.speciality || errors.speciality
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
                    className={`disabled:cursor-not-allowed rounded-md py-1 px-4 bg-blue-500 text-white ${
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

export default TechnicienFormulaire;
