import React from "react";
import InputLabel from "../inputs/InputLabel";
import SelectInput from "../inputs/SelectInput";
import TextInput from "../inputs/TextInput";
import InputError from "../inputs/InputError";

const PaiementFooter = ({
    data,
    errors,
    setData,
    setValidationErrors,
    validationErrors,
    typePaiement,
}) => {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            {/* Section gauche - Informations de paiement */}
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <InputLabel
                            htmlFor="mode_paiement"
                            value="Mode de règlement"
                        />
                        <SelectInput
                            id="mode_paiement"
                            name="mode_paiement"
                            value={data.mode_paiement}
                            className="block w-full mt-1"
                            autoComplete="mode_paiement"
                            onChange={(e) =>
                                setData("mode_paiement", e.target.value)
                            }
                            required
                        >
                            {typePaiement.map((item) => (
                                <option key={item.id} value={item.nom}>
                                    {item.nom}
                                </option>
                            ))}
                        </SelectInput>
                        <InputError
                            message={
                                validationErrors.mode_paiement ||
                                errors.mode_paiement
                            }
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="date_echeance"
                            value="Date d'échéance"
                        />
                        <TextInput
                            id="date_echeance"
                            name="date_echeance"
                            value={data.date_echeance}
                            className="block w-full mt-1"
                            autoComplete="date_echeance"
                            onChange={(e) =>
                                setData("date_echeance", e.target.value)
                            }
                            required
                            type="date"
                            onFocus={() =>
                                setValidationErrors({
                                    ...validationErrors,
                                    date_echeance: "",
                                })
                            }
                        />
                        <InputError
                            message={
                                validationErrors.date_echeance ||
                                errors.date_echeance
                            }
                            className="mt-2"
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="nom_vendeur" value="Nom du vendeur" />
                    <TextInput
                        id="nom_vendeur"
                        name="nom_vendeur"
                        value={data.nom_vendeur}
                        className="block w-full mt-1"
                        autoComplete="nom_vendeur"
                        onChange={(e) => setData("nom_vendeur", e.target.value)}
                        required
                        onFocus={() =>
                            setValidationErrors({
                                ...validationErrors,
                                nom_vendeur: "",
                            })
                        }
                    />
                    <InputError
                        message={
                            validationErrors.nom_vendeur || errors.nom_vendeur
                        }
                        className="mt-2"
                    />
                </div>
            </div>

            {/* Section droite - État et montant */}
            <div className="flex flex-col gap-4">
                <div>
                    <InputLabel htmlFor="etat_paiment" value="État" />
                    <SelectInput
                        id="etat_paiment"
                        type="etat_paiment"
                        name="etat_paiment"
                        value={data.etat_paiment}
                        className="block w-full mt-1"
                        autoComplete="etat_paiment"
                        onChange={(e) =>
                            setData("etat_paiment", e.target.value)
                        }
                        required
                    >
                        <option value="Payé">Payé</option>
                    </SelectInput>
                    <InputError
                        message={
                            validationErrors.etat_paiment || errors.etat_paiment
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="montant_paye" value="Montant payé" />
                    <div className="relative">
                        <TextInput
                            id="montant_paye"
                            name="montant_paye"
                            value={data.montant_paye}
                            className="block w-full pr-12 mt-1 bg-gray-50"
                            autoComplete="montant_paye"
                            readOnly
                            onChange={(e) =>
                                setData("montant_paye", e.target.value)
                            }
                            required
                            onFocus={() =>
                                setValidationErrors({
                                    ...validationErrors,
                                    montant_paye: "",
                                })
                            }
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-gray-500">XOF</span>
                        </div>
                    </div>
                    <InputError
                        message={
                            validationErrors.montant_paye || errors.montant_paye
                        }
                        className="mt-2"
                    />
                </div>
            </div>
        </div>
    );
};

export default PaiementFooter;
