import React, { useState, useEffect } from "react";
import InputLabel from "../inputs/InputLabel";
import TextInput from "../inputs/TextInput";
import TextArea from "../inputs/TextArea";

const DesignationComponent = ({ data, setData }) => {
    const [products, setProducts] = useState([
        {
            designation: "",
            reference: "",
            quantite: 1,
            unite: "",
            tva: 0,
            prix_unitaire: 0,
            total_ht: 0,
            total_ttc: 0,
        },
    ]);

    // Initialize products from props only once or when data.produits changes its reference
    useEffect(() => {
        if (data.produits && data.produits.length > 0) {
            setProducts(data.produits);
        }
    }, [data.produits]);

    // Fonction pour recalculer les totaux HT et TTC
    const calculateTotals = (product) => {
        const quantite = parseFloat(product.quantite) || 0;
        const prix_unitaire = parseFloat(product.prix_unitaire) || 0;
        const tva = parseFloat(product.tva) || 0;

        const total_ht = quantite * prix_unitaire;
        const total_ttc = total_ht * (1 + tva / 100);

        return { total_ht, total_ttc };
    };

    // Met à jour les valeurs de chaque produit
    const handleChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;

        if (["quantite", "prix_unitaire", "tva"].includes(field)) {
            const { total_ht, total_ttc } = calculateTotals(newProducts[index]);
            newProducts[index].total_ht = total_ht;
            newProducts[index].total_ttc = total_ttc;
        }

        setProducts(newProducts);

        // Update parent data with the new products
        const updatedData = {
            produits: newProducts,
            description: data.description || "",
            montant_paye:
                calculateGlobalTotals(newProducts).totalTTCGlobal.toFixed(2),
        };

        setData((prev) => ({
            ...prev,
            ...updatedData,
        }));
    };

    // Calculate global totals
    const calculateGlobalTotals = (productsList) => {
        const ensureNumber = (value) => {
            const num = parseFloat(value);
            return isNaN(num) ? 0 : num;
        };

        const totalHTGlobal = productsList.reduce(
            (sum, product) => sum + ensureNumber(product.total_ht),
            0
        );
        const totalTTCGlobal = productsList.reduce(
            (sum, product) => sum + ensureNumber(product.total_ttc),
            0
        );
        const totalTVAGlobal = productsList.reduce((sum, product) => {
            const tva = ensureNumber(product.tva);
            const total_ht = ensureNumber(product.total_ht);
            return sum + (total_ht * tva) / 100;
        }, 0);

        return {
            totalHTGlobal: parseFloat(totalHTGlobal.toFixed(2)),
            totalTTCGlobal: parseFloat(totalTTCGlobal.toFixed(2)),
            totalTVAGlobal: parseFloat(totalTVAGlobal.toFixed(2)),
        };
    };

    // Get the current totals for display
    const { totalHTGlobal, totalTTCGlobal, totalTVAGlobal } =
        calculateGlobalTotals(products);

    // Ajouter un produit
    const addProduct = () => {
        const newProducts = [
            ...products,
            {
                designation: "",
                reference: "",
                quantite: 1,
                unite: "",
                tva: 0,
                prix_unitaire: 0,
                total_ht: 0,
                total_ttc: 0,
            },
        ];

        setProducts(newProducts);

        // Update parent data with the new products array
        setData((prev) => ({
            ...prev,
            produits: newProducts,
        }));
    };

    // Supprimer un produit
    const removeProduct = (index) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);

        // Update parent data with the new products array
        const totals = calculateGlobalTotals(newProducts);
        setData((prev) => ({
            ...prev,
            produits: newProducts,
            montant_paye: totals.totalTTCGlobal.toFixed(2),
        }));
    };

    // Handle description change
    const handleDescriptionChange = (event) => {
        const newDescription = event.target.value;

        setData((prev) => ({
            ...prev,
            description: newDescription,
        }));
    };

    // Helper function to safely format numbers
    const formatNumber = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    return (
        <div>
            {/* Version Mobile - Vue Cartes */}
            <div className="block lg:hidden">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="relative p-4 mb-4 border border-gray-200 rounded-lg"
                    >
                        {index > 0 && (
                            <button
                                className="absolute flex items-center justify-center w-6 h-6 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                                onClick={() => removeProduct(index)}
                            >
                                ×
                            </button>
                        )}

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <InputLabel
                                    htmlFor={`designation-${index}`}
                                    value="Nom"
                                />
                                <TextInput
                                    id={`designation-${index}`}
                                    name="designation"
                                    value={product.designation}
                                    className="block w-full mt-1"
                                    autoComplete="designation"
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "designation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor={`reference-${index}`}
                                    value="Réf"
                                />
                                <TextInput
                                    id={`reference-${index}`}
                                    name="reference"
                                    value={product.reference}
                                    className="block w-full mt-1"
                                    autoComplete="reference"
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "reference",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor={`quantite-${index}`}
                                    value="Qté"
                                />
                                <TextInput
                                    id={`quantite-${index}`}
                                    name="quantite"
                                    value={product.quantite}
                                    className="block w-full mt-1"
                                    autoComplete="quantite"
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "quantite",
                                            e.target.value
                                        )
                                    }
                                    required
                                    type="number"
                                    min={0}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor={`unite-${index}`}
                                    value="Unité"
                                />
                                <TextInput
                                    id={`unite-${index}`}
                                    name="unite"
                                    value={product.unite}
                                    className="block w-full mt-1"
                                    autoComplete="unite"
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "unite",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor={`tva-${index}`}
                                    value="TVA%"
                                />
                                <TextInput
                                    id={`tva-${index}`}
                                    name="tva"
                                    value={product.tva}
                                    className="block w-full mt-1"
                                    autoComplete="tva"
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "tva",
                                            e.target.value
                                        )
                                    }
                                    required
                                    type="number"
                                    min={0}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor={`prix_unitaire-${index}`}
                                    value="PU TTC"
                                />
                                <TextInput
                                    id={`prix_unitaire-${index}`}
                                    name="prix_unitaire"
                                    value={product.prix_unitaire}
                                    className="block w-full mt-1"
                                    autoComplete="prix_unitaire"
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "prix_unitaire",
                                            e.target.value
                                        )
                                    }
                                    required
                                    type="number"
                                    min={0}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor={`total_ht-${index}`}
                                    value="Total HT"
                                />
                                <TextInput
                                    id={`total_ht-${index}`}
                                    name="total_ht"
                                    value={formatNumber(product.total_ht)}
                                    className="block w-full mt-1 bg-gray-100"
                                    autoComplete="total_ht"
                                    readOnly
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor={`total_ttc-${index}`}
                                    value="Total TTC"
                                />
                                <TextInput
                                    id={`total_ttc-${index}`}
                                    name="total_ttc"
                                    value={formatNumber(product.total_ttc)}
                                    className="block w-full mt-1 bg-gray-100"
                                    autoComplete="total_ttc"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Version Desktop - Vue Tableau */}
            <div className="hidden lg:block">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="relative grid grid-cols-11 gap-3 my-4"
                    >
                        {index === 0 && (
                            <>
                                <div className="col-span-4">
                                    <InputLabel
                                        htmlFor={`designation-${index}`}
                                        value="Nom"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor={`reference-${index}`}
                                        value="Réf"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor={`quantite-${index}`}
                                        value="Qté"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor={`unite-${index}`}
                                        value="Unité"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor={`tva-${index}`}
                                        value="TVA%"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor={`prix_unitaire-${index}`}
                                        value="PU TTC"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor={`total_ht-${index}`}
                                        value="Total HT"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor={`total_ttc-${index}`}
                                        value="Total TTC"
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-span-4">
                            <TextInput
                                id={`designation-${index}`}
                                name="designation"
                                value={product.designation}
                                className="block w-full mt-1"
                                autoComplete="designation"
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "designation",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>
                        <div>
                            <TextInput
                                id={`reference-${index}`}
                                name="reference"
                                value={product.reference}
                                className="block w-full mt-1"
                                autoComplete="reference"
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "reference",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>
                        <div>
                            <TextInput
                                id={`quantite-${index}`}
                                name="quantite"
                                value={product.quantite}
                                className="block w-full mt-1"
                                autoComplete="quantite"
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "quantite",
                                        e.target.value
                                    )
                                }
                                required
                                type="number"
                                min={0}
                            />
                        </div>
                        <div>
                            <TextInput
                                id={`unite-${index}`}
                                name="unite"
                                value={product.unite}
                                className="block w-full mt-1"
                                autoComplete="unite"
                                onChange={(e) =>
                                    handleChange(index, "unite", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <TextInput
                                id={`tva-${index}`}
                                name="tva"
                                value={product.tva}
                                className="block w-full mt-1"
                                autoComplete="tva"
                                onChange={(e) =>
                                    handleChange(index, "tva", e.target.value)
                                }
                                required
                                type="number"
                                min={0}
                            />
                        </div>
                        <div>
                            <TextInput
                                id={`prix_unitaire-${index}`}
                                name="prix_unitaire"
                                value={product.prix_unitaire}
                                className="block w-full mt-1"
                                autoComplete="prix_unitaire"
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "prix_unitaire",
                                        e.target.value
                                    )
                                }
                                required
                                type="number"
                                min={0}
                            />
                        </div>
                        <div>
                            <TextInput
                                id={`total_ht-${index}`}
                                name="total_ht"
                                value={formatNumber(product.total_ht)}
                                className="block w-full mt-1"
                                autoComplete="total_ht"
                                readOnly
                            />
                        </div>
                        <div>
                            <TextInput
                                id={`total_ttc-${index}`}
                                name="total_ttc"
                                value={formatNumber(product.total_ttc)}
                                className="block w-full mt-1"
                                autoComplete="total_ttc"
                                readOnly
                            />
                        </div>

                        {/* Show the delete button only for index > 0 */}
                        {index > 0 && (
                            <button
                                className="absolute w-5 h-5 text-xs text-white bg-red-500 rounded-full -right-2 -top-2"
                                onClick={() => removeProduct(index)}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <TextArea
                name="description"
                value={data.description || ""}
                placeholder="Description"
                onChange={handleDescriptionChange}
                rows="2"
                className="w-full mt-4 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
            />

            <div className="flex flex-col items-start justify-between gap-4 mt-4 sm:flex-row sm:items-center">
                <button
                    className="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                    onClick={addProduct}
                >
                    + Produit
                </button>

                <div className="w-full sm:w-auto">
                    <div className="p-4 rounded-lg bg-gray-50">
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-1 pr-4 font-medium">
                                        Total HT
                                    </td>
                                    <td className="font-mono text-right">
                                        {totalHTGlobal.toFixed(2)}
                                    </td>
                                    <td className="pl-2 text-gray-600">XOF</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-1 pr-4 font-medium">
                                        Total TVA
                                    </td>
                                    <td className="font-mono text-right">
                                        {totalTVAGlobal.toFixed(2)}
                                    </td>
                                    <td className="pl-2 text-gray-600">XOF</td>
                                </tr>
                                <tr className="font-bold">
                                    <td className="py-1 pr-4">Total TTC</td>
                                    <td className="font-mono text-right">
                                        {totalTTCGlobal.toFixed(2)}
                                    </td>
                                    <td className="pl-2 text-gray-600">XOF</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignationComponent;
