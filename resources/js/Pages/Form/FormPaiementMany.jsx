import Snackbar from "@/Components/Snackbar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";

const val = (v) => (v === null || v === undefined ? "" : String(v));

const Input = ({
    label,
    type = "text",
    value,
    readOnly = false,
    onChange,
    ...props
}) => (
    <div className="relative w-full pt-3 mt-1">
        {label && <span className="absolute top-0 left-2">{label}</span>}
        <input
            className="w-full mt-1 text-xs border rounded-md outline-none"
            type={type}
            value={val(value)}
            readOnly={readOnly}
            onChange={readOnly ? () => {} : onChange}
            {...props}
        />
    </div>
);

const FormPaiementMany = ({ datas = [] }) => {
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
    const [data, setData] = useState(
        datas.map((e) => ({
            id: e.id,
            numero: e.numero,
            client_id: e.client_id,
            lieu_creation: e.lieu_creation,
            date_creation: e.date_creation,
            date_paiement: e.date_paiement,
            nom_vendeurs: e.nom_vendeurs,
            ville_vendeur: e.ville_vendeur,
            pays_vendeur: e.pays_vendeur,
            client: e.client,
            observation: e.observation,
            mode_paiement: e.mode_paiement,
            montant: e.montant,
            nom_vendeur: e.nom_vendeur,
            produits: e.produits?.map((p) => ({
                id: p.id,
                designation: p.designation,
                reference: p.reference,
                quantite: p.quantite,
                prix_unitaire: p.prix_unitaire,
                total_ht: p.prix_unitaire * p.quantite,
                tva: p.tva,
                montant_tva: p.tva * p.prix_unitaire * p.quantite,
                total_ttc: p.total_ttc,
            })),
        })),
    );

    const handleChange = (index, field, value) => {
        setData((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const handleProduitChange = (index, pi, field, value) => {
        const updatedData = data.map((item, i) => {
            if (i !== index) return item;

            const updatedProduits = item.produits.map((p, j) => {
                if (j !== pi) return p;
                const updated = { ...p, [field]: value };
                const qte = parseFloat(updated.quantite) || 0;
                const pu = parseFloat(updated.prix_unitaire) || 0;
                const tva = parseFloat(updated.tva) || 0;
                updated.total_ht = pu * qte;
                updated.montant_tva = (tva * pu * qte) / 100;
                updated.total_ttc = updated.total_ht + updated.montant_tva;
                return updated;
            });

            const totalTTC = updatedProduits.reduce(
                (sum, p) => sum + (p.total_ttc || 0),
                0,
            );
            const montant =
                totalTTC > 0 ? totalTTC.toFixed(2) : item.montant.toFixed(2);

            return { ...item, produits: updatedProduits, montant };
        });

        setData(updatedData);
    };

    const handleSubmit = async () => {
        setBtnLoading(true);

        try {
            const { data: result } = await axios.put(
                "/api/paiement/update-many",
                { paiements: data },
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
                        const match = key.match(/^paiements\.(\d+)\.(.+)$/);
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
            <div className="p-2">
                <div className="mb-4 text-lg font-semibold text-center text-blue-500 md:text-2xl">
                    Modification des plusieurs Paiements
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {data.map((e, i) => {
                        const totalHT =
                            e.produits?.reduce(
                                (sum, p) => sum + (p.total_ht || 0),
                                0,
                            ) ?? 0;
                        const totalTVA =
                            e.produits?.reduce(
                                (sum, p) => sum + (p.montant_tva || 0),
                                0,
                            ) ?? 0;
                        const totalTTC =
                            e.produits?.reduce(
                                (sum, p) => sum + (p.total_ttc || 0),
                                0,
                            ) ?? 0;

                        return (
                            <form
                                key={e.id ?? i}
                                className="p-4 text-xs bg-white rounded-md shadow-sm dark:bg-gray-800"
                            >
                                <div className="ml-1 text-lg text-blue-500">
                                    <span className="text-xs text-black dark:text-white">
                                        Reçu N°{" "}
                                    </span>
                                    {e.numero}
                                </div>

                                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                    <Input
                                        label="Lieu création"
                                        onChange={(v) =>
                                            handleChange(
                                                i,
                                                "lieu_creation",
                                                v.target.value,
                                            )
                                        }
                                        value={val(e.lieu_creation)}
                                    />
                                    <Input
                                        onChange={(v) =>
                                            handleChange(
                                                i,
                                                "date_creation",
                                                v.target.value,
                                            )
                                        }
                                        label="Date création"
                                        type="date"
                                        value={val(e.date_creation)}
                                    />
                                    <Input
                                        onChange={(v) =>
                                            handleChange(
                                                i,
                                                "date_paiement",
                                                v.target.value,
                                            )
                                        }
                                        label="Date de vente"
                                        type="date"
                                        value={val(e.date_paiement)}
                                    />
                                    <Input
                                        onChange={(v) =>
                                            handleChange(
                                                i,
                                                "nom_vendeurs",
                                                v.target.value,
                                            )
                                        }
                                        label="Nom vendeur"
                                        value={val(e.nom_vendeurs)}
                                    />
                                    <Input
                                        onChange={(v) =>
                                            handleChange(
                                                i,
                                                "ville_vendeur",
                                                v.target.value,
                                            )
                                        }
                                        label="Ville vendeur"
                                        value={val(e.ville_vendeur)}
                                    />
                                    <Input
                                        onChange={(v) =>
                                            handleChange(
                                                i,
                                                "pays_vendeur",
                                                v.target.value,
                                            )
                                        }
                                        label="Pays vendeur"
                                        value={val(e.pays_vendeur)}
                                    />
                                    <Input
                                        label="Nom acheteur"
                                        value={`${val(e.client?.nom)} ${val(e.client?.prenom)}`.trim()}
                                        readOnly
                                    />
                                    <Input
                                        label="Ville acheteur"
                                        value={val(e.client?.ville_acheteur)}
                                        readOnly
                                    />
                                    <Input
                                        label="Pays acheteur"
                                        value={val(e.client?.pays_acheteur)}
                                        readOnly
                                    />
                                    <div className="mb-2 md:col-span-3">
                                        <Input
                                            onChange={(v) =>
                                                handleChange(
                                                    i,
                                                    "observation",
                                                    v.target.value,
                                                )
                                            }
                                            label="Observation"
                                            value={val(e.observation)}
                                        />
                                    </div>
                                </div>

                                <table className="w-full p-4 mt-6 border border-blue-500">
                                    <thead className="text-left text-white bg-blue-500">
                                        <tr className="p-7">
                                            <th className="p-1">N°</th>
                                            <th>Désignation</th>
                                            <th>Réf</th>
                                            <th>Qté</th>
                                            <th>PU HT</th>
                                            <th>Total HT</th>
                                            <th>TVA</th>
                                            {/* <th>M. TVA</th> */}
                                            <th className="p-1">Total TTC</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {e.produits?.map((p, pi) => (
                                            <tr key={p.id ?? pi}>
                                                <td className="p-1 border border-blue-500 max-w-8">
                                                    {pi + 1}
                                                </td>
                                                <td className="border border-blue-500 max-w-96">
                                                    <input
                                                        className="w-full text-xs border-none outline-none"
                                                        type="text"
                                                        value={val(
                                                            p.designation,
                                                        )}
                                                        onChange={(v) =>
                                                            handleProduitChange(
                                                                i,
                                                                pi,
                                                                "designation",
                                                                v.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border border-blue-500 max-w-8">
                                                    <input
                                                        className="w-full text-xs border-none outline-none"
                                                        type="text"
                                                        value={val(p.reference)}
                                                        onChange={(v) =>
                                                            handleProduitChange(
                                                                i,
                                                                pi,
                                                                "reference",
                                                                v.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border border-blue-500 max-w-8">
                                                    <input
                                                        className="w-full text-xs border-none outline-none"
                                                        type="text"
                                                        value={val(p.quantite)}
                                                        onChange={(v) =>
                                                            handleProduitChange(
                                                                i,
                                                                pi,
                                                                "quantite",
                                                                v.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border border-blue-500 max-w-16">
                                                    <input
                                                        className="w-full text-xs border-none outline-none"
                                                        type="text"
                                                        value={val(
                                                            p.prix_unitaire,
                                                        )}
                                                        onChange={(v) =>
                                                            handleProduitChange(
                                                                i,
                                                                pi,
                                                                "prix_unitaire",
                                                                v.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="p-1 border border-blue-500 max-w-16">
                                                    {val(p.total_ht)}
                                                </td>
                                                <td className="border border-blue-500 max-w-12">
                                                    <input
                                                        className="w-full text-xs border-none outline-none"
                                                        type="text"
                                                        value={val(p.tva)}
                                                        onChange={(v) =>
                                                            handleProduitChange(
                                                                i,
                                                                pi,
                                                                "tva",
                                                                v.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                {/* <td className="p-1 border border-blue-500 max-w-16">
                                                    {val(p.montant_tva)}
                                                </td> */}
                                                <td className="p-1 border border-blue-500 max-w-16">
                                                    {val(p.total_ttc)}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-1 text-center uppercase"
                                            >
                                                Total
                                            </td>
                                            <td className="p-1 border border-blue-500">
                                                {totalHT}
                                            </td>
                                            <td className="p-1 border border-blue-500">
                                                {totalTVA}
                                            </td>
                                            <td className="p-1 border border-blue-500">
                                                {totalTTC}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="mt-2 mb-4 ml-1 space-y-1">
                                    <div>
                                        Total HT :{" "}
                                        <span className="font-semibold">
                                            {totalHT.toFixed(2)} FCFA
                                        </span>
                                    </div>
                                    <div>
                                        Montant TVA :{" "}
                                        <span className="font-semibold">
                                            {totalTVA.toFixed(2)} FCFA
                                        </span>
                                    </div>
                                    <div>
                                        Total TTC :{" "}
                                        <span className="font-semibold">
                                            {totalTTC.toFixed(2)} FCFA
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 my-2 md:grid-cols-2">
                                    <Input
                                        onChange={(v) =>
                                            handleChange(
                                                i,
                                                "mode_paiement",
                                                v.target.value,
                                            )
                                        }
                                        label="Mode paiement"
                                        value={val(e.mode_paiement)}
                                    />
                                    <Input
                                        onChange={(v) =>
                                            handleChange(
                                                i,
                                                "montant",
                                                v.target.value,
                                            )
                                        }
                                        label="Montant à payer"
                                        value={val(e.montant)}
                                    />
                                </div>

                                <Input
                                    onChange={(v) =>
                                        handleChange(
                                            i,
                                            "nom_vendeur",
                                            v.target.value,
                                        )
                                    }
                                    label="Nom vendeur"
                                    value={val(e.nom_vendeur)}
                                />
                            </form>
                        );
                    })}
                </div>
                <div className="flex mt-4">
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
                                    {" "}
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
        </AuthenticatedLayout>
    );
};

export default FormPaiementMany;
