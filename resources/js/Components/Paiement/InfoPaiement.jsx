import React from "react";
import InputError from "../inputs/InputError";
import InputLabel from "../inputs/InputLabel";
import SelectInput from "../inputs/SelectInput";
import TextInput from "../inputs/TextInput";

const InfoPaiement = ({
    data,
    setData,
    validationErrors,
    errors,
    setValidationErrors,
}) => {
    return (
        <div className="grid grid-cols-1 gap-2 mt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="col-span-1">
                <InputLabel htmlFor="type" value="Type" />
                <SelectInput
                    id="type"
                    name="type"
                    value={data.type}
                    className="block w-full mt-1"
                    autoComplete="type"
                    onChange={(e) => setData("type", e.target.value)}
                    required
                >
                    <option value="recus">Reçus</option>
                </SelectInput>
                <InputError
                    message={validationErrors.type || errors.type}
                    className="mt-2"
                />
            </div>

            <div className="col-span-1">
                <InputLabel htmlFor="numero" value="N*" />
                <TextInput
                    id="numero"
                    name="numero"
                    value={data.numero}
                    className="block w-full mt-1"
                    autoComplete="numero"
                    onChange={(e) => setData("numero", e.target.value)}
                    required
                    disabled
                    onFocus={() =>
                        setValidationErrors({ ...validationErrors, numero: "" })
                    }
                />
                <InputError
                    message={validationErrors.numero || errors.numero}
                    className="mt-2"
                />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <InputLabel htmlFor="date_creation" value="Date de création" />
                <TextInput
                    id="date_creation"
                    name="date_creation"
                    value={data.date_creation}
                    className="block w-full mt-1"
                    autoComplete="date_creation"
                    onChange={(e) => setData("date_creation", e.target.value)}
                    type="date"
                    required
                    onFocus={() =>
                        setValidationErrors({
                            ...validationErrors,
                            date_creation: "",
                        })
                    }
                />
                <InputError
                    message={
                        validationErrors.date_creation || errors.date_creation
                    }
                    className="mt-2"
                />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <InputLabel htmlFor="lieu_creation" value="Lieu de création" />
                <TextInput
                    id="lieu_creation"
                    name="lieu_creation"
                    value={data.lieu_creation}
                    className="block w-full mt-1"
                    autoComplete="lieu_creation"
                    onChange={(e) => setData("lieu_creation", e.target.value)}
                    required
                    onFocus={() =>
                        setValidationErrors({
                            ...validationErrors,
                            lieu_creation: "",
                        })
                    }
                />
                <InputError
                    message={
                        validationErrors.lieu_creation || errors.lieu_creation
                    }
                    className="mt-2"
                />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <InputLabel
                    htmlFor="date_additionnel"
                    value="Type d'intervention"
                />
                <SelectInput
                    id="date_additionnel"
                    type="date_additionnel"
                    name="date_additionnel"
                    value={data.date_additionnel}
                    className="block w-full mt-1"
                    autoComplete="date_additionnel"
                    onChange={(e) =>
                        setData("date_additionnel", e.target.value)
                    }
                    required
                >
                    <option value="Date de vente">Date de vente</option>
                </SelectInput>
                <InputError
                    message={errors.date_additionnel}
                    className="mt-2"
                />
            </div>

            <div className="col-span-1">
                <InputLabel htmlFor="date" value="*" />
                <TextInput
                    id="date"
                    name="date"
                    value={data.date}
                    className="block w-full mt-1"
                    autoComplete="date"
                    onChange={(e) => setData("date", e.target.value)}
                    required
                    type="date"
                    onFocus={() =>
                        setValidationErrors({ ...validationErrors, date: "" })
                    }
                />
            </div>
        </div>
    );
};

export default InfoPaiement;
