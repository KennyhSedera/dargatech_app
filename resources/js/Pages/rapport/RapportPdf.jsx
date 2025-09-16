import React, { forwardRef } from "react";
import { logo } from "@/constant";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

const RapportPdf = forwardRef(({ data }, ref) => {
    return (
        <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
            <div
                ref={ref}
                className="w-full max-w-4xl p-8 text-gray-800 bg-white rounded-lg shadow-lg"
                style={{
                    fontFamily: "Times New Roman, serif",
                    fontSize: "14px",
                }}
            >
                <div className="flex justify-between mb-10">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center mr-3 rounded-full h-14 w-14">
                            <img src={logo} alt="logo" className={`w-24`} />
                        </div>
                        <div>
                            <h1
                                className={`text-2xl font-bold`}
                                style={{
                                    fontFamily: "Times New Roman, serif",
                                    fontSize: "24px",
                                }}
                            >
                                Dargatech
                            </h1>
                            <p
                                className={`text-sm text-slate-500 dark:text-slate-400`}
                                style={{
                                    fontFamily: "Times New Roman, serif",
                                    fontSize: "14px",
                                }}
                            >
                                Solutions solaires durables
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div
                            className="text-sm text-slate-500 dark:text-slate-400"
                            style={{
                                fontFamily: "Times New Roman, serif",
                                fontSize: "14px",
                            }}
                        >
                            Maintenance #{data?.maintenanceId}
                        </div>
                        <div
                            className="mt-1 text-lg font-semibold"
                            style={{
                                fontFamily: "Times New Roman, serif",
                                fontSize: "16px",
                            }}
                        >
                            Rapport d'intervention #{data?.id}
                        </div>
                        <div
                            className="mt-1 text-sm text-slate-500 dark:text-slate-400"
                            style={{
                                fontFamily: "Times New Roman, serif",
                                fontSize: "14px",
                            }}
                        >
                            {moment(data?.date_intervention).format(
                                "DD MMM YYYY"
                            )}
                        </div>
                    </div>
                </div>

                <h1
                    className="mb-8 text-2xl font-bold text-center"
                    style={{
                        fontFamily: "Times New Roman, serif",
                        fontSize: "20px",
                    }}
                >
                    Rapport de maintenance du kit solaire Dargatech
                </h1>

                {/* Client Info */}
                <section className="mb-4">
                    <h2
                        className="mb-2 text-lg font-semibold"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        1. Identification du client
                    </h2>
                    <div className="flex gap-20 px-6">
                        <ul
                            className="list-disc list-inside"
                            style={{
                                fontFamily: "Times New Roman, serif",
                                fontSize: "14px",
                            }}
                        >
                            <li>
                                <strong>Nom :</strong> {data.client.prenom}{" "}
                                {data.client.nom}
                            </li>
                            <li>
                                <strong>Localisation :</strong>{" "}
                                {data.client.localisation}
                            </li>
                        </ul>
                        <ul
                            className="list-disc list-inside"
                            style={{
                                fontFamily: "Times New Roman, serif",
                                fontSize: "14px",
                            }}
                        >
                            <li>
                                <strong>Date de l'intervention :</strong>{" "}
                                {moment(data.date_intervention).format(
                                    "DD MMM YYYY"
                                )}
                            </li>
                            <li>
                                <strong>Technicien :</strong> {data.user?.name}
                            </li>
                            <li>
                                <strong>Contact :</strong>{" "}
                                {data.client.telephone}
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Panne */}
                <section className="mb-4">
                    <h2
                        className="mb-2 text-lg font-semibold"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        2. Description de la Panne
                    </h2>
                    <ul
                        className="px-4 text-black list-disc list-inside"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        <li>
                            <strong>Signalement par le client :</strong> <br />
                            <ul
                                className="px-12 text-black list-disc list-inside"
                                style={{
                                    fontFamily: "Times New Roman, serif",
                                    fontSize: "14px",
                                }}
                            >
                                <li>
                                    <strong>Problèmes rapportés : </strong>{" "}
                                    {data.description_panne}
                                    {data.photo_probleme && (
                                        <div
                                            className={`grid grid-cols-1 md:grid-cols-2 gap-2 my-4`}
                                        >
                                            {JSON.parse(
                                                data.photo_probleme
                                            ).map((path, index) => (
                                                <img
                                                    key={index}
                                                    src={`/${path}`}
                                                    alt="Photo du problème"
                                                    className="mx-auto border border-black shadow-md"
                                                    style={{
                                                        height: "150px",
                                                        objectFit: "contain",
                                                        width: "100%",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </li>
                                <li>
                                    <strong>
                                        Date et heure du signalement :
                                    </strong>{" "}
                                    le{" "}
                                    {moment(data.created_at).format(
                                        "DD MMMM YYYY à HH:mm"
                                    )}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section className="mb-4">
                    <h2
                        className="mb-2 text-lg font-semibold"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        3. Diagnostic initial
                    </h2>
                    <div
                        className="px-6 text-black"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        <p>
                            <strong>Vérifications préliminaires :</strong>
                        </p>
                        <p className="pl-4">{data.diagnostic_initial}</p>
                    </div>
                </section>

                <section className="mb-4">
                    <h2
                        className="mb-2 text-lg font-semibold"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        4. Cause identifiée
                    </h2>
                    <div
                        className="px-6 text-black"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        <p>
                            <strong>Résultat du diagnostic :</strong>
                        </p>
                        <p className="pl-4">{data.cause_identifiee}</p>
                    </div>
                </section>

                {/* Intervention */}
                <section className="mb-4">
                    <h2
                        className="mb-2 text-lg font-semibold"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        5. Intervention réalisée
                    </h2>
                    <ul
                        className="px-4 text-black list-disc list-inside"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        <li>
                            <strong>Actions correctives :</strong>
                            <br />
                            <span className="px-12">
                                {data.intervention_realisee}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Vérification */}
                <section className="mb-4">
                    <h2
                        className="mb-2 text-lg font-semibold"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        6. Test Post-Réparation
                    </h2>
                    <ul
                        className="px-4 text-black list-disc list-inside"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        <li>
                            <strong>Vérification du fonctionnement :</strong>
                            <span className="px-1">
                                {data.verification_fonctionnement}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Recommandations */}
                <section className="mb-4">
                    <h2
                        className="mb-2 text-lg font-semibold"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        7. Recommandation au client
                    </h2>
                    <p
                        className="px-12"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                        }}
                    >
                        {data.recommandation_client}
                    </p>
                </section>

                {/* Footer */}
                <p
                    className="mt-8 text-sm text-center text-gray-500"
                    style={{
                        fontFamily: "Times New Roman, serif",
                        fontSize: "14px",
                    }}
                >
                    Rapport généré le{" "}
                    {new Date(data.created_at).toLocaleDateString()} par{" "}
                    {data?.user?.name}
                </p>
            </div>
        </div>
    );
});

RapportPdf.displayName = "RapportPdf";

export default RapportPdf;
