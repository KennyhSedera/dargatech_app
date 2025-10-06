import InputError from "@/Components/inputs/InputError";
import InputLabel from "@/Components/inputs/InputLabel";
import PrimaryButton from "@/Components/buttons/PrimaryButton";
import TextInput from "@/Components/inputs/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import {
    TbUser,
    TbMail,
    TbPhone,
    TbMapPin,
    TbBriefcase,
    TbUpload,
    TbTrash,
    TbWorld,
    TbBuildingStore,
    TbFlag,
    TbEdit,
    TbBrandTelegram,
} from "react-icons/tb";
import { updatePhoto } from "@/Services/profileService";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
    onSuccess,
}) {
    const user = usePage().props.auth.user;
    const profile = user.profile || {};
    const technicien = user.technicien || {};
    const partenaire = user.partenaire || {};
    const photoInput = useRef();
    const [previewUrl, setPreviewUrl] = useState(
        profile.photo
            ? `${profile.photo}`
            : technicien.photo
            ? `${technicien.photo}`
            : partenaire.logo
            ? `${partenaire.logo}`
            : null
    );

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            genre: profile.genre || technicien.genre || partenaire.genre || "",
            contact:
                profile.contact ||
                technicien.contact ||
                partenaire.telephone ||
                "",
            adress:
                profile.adress || technicien.adress || partenaire.adresse || "",
            speciality: profile.speciality || technicien.speciality || "",
            ville: partenaire.ville || "",
            pays: partenaire.pays || "",
            site_web: partenaire.site_web || "",
            categorie: partenaire.categorie || "",
            description: partenaire.description || "",
            highlighted: partenaire.highlighted || false,
            telegram_username:
                technicien.telegram_username || profile.telegram_username || "",
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"), {
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
            },
        });
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            const formData = new FormData();
            formData.append("photo", e.target.files[0]);

            // Afficher un aperçu immédiatement
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));

            // Envoyer la photo au serveur
            updatePhoto(formData);
        }
    };

    const removePhoto = () => {
        setData("photo", null);
        setPreviewUrl(null);
        if (photoInput.current) {
            photoInput.current.value = "";
        }
    };

    return (
        <section className={`${className} min-h-screen`}>
            <form onSubmit={submit} className="mx-auto ">
                <div className="overflow-hidden bg-white md:shadow-xl dark:bg-gray-800 md:rounded-2xl">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-col items-center justify-center w-full p-8 md:w-1/3 bg-gradient-to-br from-orange-500 to-pink-500 dark:from-indigo-600 dark:to-purple-700">
                            <div className="space-y-6 text-center">
                                <div className="relative group">
                                    <div className="flex items-center justify-center w-48 h-48 mx-auto overflow-hidden bg-white border-4 border-white rounded-full shadow-2xl dark:bg-gray-700 dark:border-gray-800">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Aperçu"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <TbUser className="w-24 h-24 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-full group-hover:bg-opacity-40">
                                        <div className="flex gap-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    photoInput.current.click()
                                                }
                                                className="p-3 text-gray-700 transition-colors duration-300 transform bg-white rounded-full shadow-lg hover:text-orange-500 dark:text-gray-200 dark:hover:text-indigo-400 hover:shadow-xl hover:-translate-y-1"
                                            >
                                                <TbUpload className="w-6 h-6" />
                                            </button>
                                            {previewUrl && (
                                                <button
                                                    type="button"
                                                    onClick={removePhoto}
                                                    className="p-3 text-gray-700 transition-colors duration-300 transform bg-white rounded-full shadow-lg hover:text-red-500 hover:shadow-xl hover:-translate-y-1"
                                                >
                                                    <TbTrash className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={photoInput}
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <p className="text-lg font-medium text-white">
                                    {data.name}
                                </p>
                                {user.user_role.name === "technicien" && (
                                    <p className="text-sm text-white/80">
                                        {data.speciality || "Votre spécialité"}
                                    </p>
                                )}
                                {user.user_role.name === "partenaire" && (
                                    <p className="text-sm text-white/80">
                                        {data.categorie ||
                                            "Votre catégorie de partenaire"}
                                    </p>
                                )}
                                <p className="text-sm text-white/70">
                                    Cliquez sur la photo pour la modifier
                                </p>
                            </div>
                        </div>

                        <div className="w-full p-8 md:w-2/3">
                            <div className="max-w-3xl mx-auto space-y-8">
                                <div className="space-y-6">
                                    <h3 className="flex items-center gap-2 pb-2 text-xl font-medium text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">
                                        <TbUser className="w-6 h-6 text-orange-500 dark:text-indigo-400" />
                                        Informations de base
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="name"
                                                value="Nom complet"
                                            />
                                            <div className="relative">
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    className="block w-full mt-1"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    isFocused
                                                    autoComplete="name"
                                                />
                                            </div>
                                            <InputError
                                                className="mt-2"
                                                message={errors.name}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="email"
                                                value="Adresse e-mail"
                                            />
                                            <div className="relative">
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    className="block w-full mt-1"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    autoComplete="username"
                                                />
                                            </div>
                                            <InputError
                                                className="mt-2"
                                                message={errors.email}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="genre"
                                                value="Genre"
                                            />
                                            <select
                                                id="genre"
                                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-orange-500 dark:focus:border-indigo-600 focus:ring-orange-500 dark:focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                value={data.genre}
                                                onChange={(e) =>
                                                    setData(
                                                        "genre",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Sélectionnez un genre
                                                </option>
                                                <option value="Homme">
                                                    Homme
                                                </option>
                                                <option value="Femme">
                                                    Femme
                                                </option>
                                                <option value="Autre">
                                                    Autre
                                                </option>
                                            </select>
                                            <InputError
                                                className="mt-2"
                                                message={errors.genre}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="flex items-center gap-2 pb-2 text-xl font-medium text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">
                                        <TbBriefcase className="w-6 h-6 text-orange-500 dark:text-indigo-400" />
                                        Informations professionnelles
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="col-span-2 md:col-span-1">
                                            <InputLabel
                                                htmlFor="contact"
                                                value="Numéro de téléphone"
                                            />
                                            <div className="relative">
                                                <TextInput
                                                    id="contact"
                                                    type="tel"
                                                    className="block w-full mt-1"
                                                    value={data.contact}
                                                    onChange={(e) =>
                                                        setData(
                                                            "contact",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <InputError
                                                className="mt-2"
                                                message={errors.contact}
                                            />
                                        </div>
                                        {user.user_role.name ===
                                            "technicien" && (
                                            <divv className="col-span-2 md:col-span-1">
                                                <InputLabel
                                                    htmlFor="speciality"
                                                    value="Spécialité"
                                                />
                                                <div className="relative">
                                                    <TextInput
                                                        id="speciality"
                                                        type="text"
                                                        className="block w-full mt-1"
                                                        value={data.speciality}
                                                        onChange={(e) =>
                                                            setData(
                                                                "speciality",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.speciality}
                                                />
                                            </divv>
                                        )}
                                        {user.user_role.name ===
                                            "partenaire" && (
                                            <div className="col-span-2 md:col-span-1">
                                                <InputLabel
                                                    htmlFor="categorie"
                                                    value="Catégorie"
                                                />
                                                <div className="relative">
                                                    <TextInput
                                                        id="categorie"
                                                        type="text"
                                                        className="block w-full mt-1"
                                                        value={data.categorie}
                                                        onChange={(e) =>
                                                            setData(
                                                                "categorie",
                                                                e.target.value
                                                            )
                                                        }
                                                        required={
                                                            user.user_role
                                                                .name ===
                                                            "partenaire"
                                                        }
                                                    />
                                                </div>
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.categorie}
                                                />
                                            </div>
                                        )}
                                        {user.user_role.name !==
                                            "partenaire" && (
                                            <div className="col-span-2 md:col-span-1">
                                                <InputLabel
                                                    htmlFor="telegram_username"
                                                    value="Pseudo Telegram"
                                                />
                                                <div className="relative">
                                                    <TextInput
                                                        id="telegram_username"
                                                        type="text"
                                                        className="block w-full mt-1"
                                                        value={
                                                            data.telegram_username
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "telegram_username",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <InputError
                                                    className="mt-2"
                                                    message={
                                                        errors.telegram_username
                                                    }
                                                />
                                            </div>
                                        )}
                                        <div
                                            className={`${
                                                user.user_role.name ===
                                                "technicien"
                                                    ? "col-span-2 md:col-span-1"
                                                    : "col-span-2"
                                            }`}
                                        >
                                            <InputLabel
                                                htmlFor="adress"
                                                value="Adresse"
                                            />
                                            <TextInput
                                                id="adress"
                                                type="text"
                                                className="block w-full mt-1"
                                                value={data.adress}
                                                onChange={(e) =>
                                                    setData(
                                                        "adress",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <InputError
                                            className="mt-2"
                                            message={errors.adress}
                                        />
                                    </div>

                                    {user.user_role.name === "partenaire" && (
                                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                                            <div>
                                                <InputLabel
                                                    htmlFor="ville"
                                                    value="Ville"
                                                />
                                                <div className="relative">
                                                    <TextInput
                                                        id="ville"
                                                        type="text"
                                                        className="block w-full mt-1"
                                                        value={data.ville}
                                                        onChange={(e) =>
                                                            setData(
                                                                "ville",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.ville}
                                                />
                                            </div>

                                            {/* Pays */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="pays"
                                                    value="Pays"
                                                />
                                                <div className="relative">
                                                    <TextInput
                                                        id="pays"
                                                        type="text"
                                                        className="block w-full mt-1"
                                                        value={data.pays}
                                                        onChange={(e) =>
                                                            setData(
                                                                "pays",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.pays}
                                                />
                                            </div>

                                            {/* Site Web */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="site_web"
                                                    value="Site web"
                                                />
                                                <div className="relative">
                                                    <TextInput
                                                        id="site_web"
                                                        className="block w-full mt-1"
                                                        value={data.site_web}
                                                        onChange={(e) =>
                                                            setData(
                                                                "site_web",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="https://example.com"
                                                    />
                                                </div>
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.site_web}
                                                />
                                            </div>

                                            {/* Checkbox “Mettre en avant” */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="highlighted"
                                                    value="Mettre en avant"
                                                />
                                                <div className="flex items-center mt-2">
                                                    <input
                                                        id="highlighted"
                                                        type="checkbox"
                                                        className="w-5 h-5 text-orange-500 border-gray-300 rounded dark:text-indigo-600 focus:ring-orange-500 dark:focus:ring-indigo-600 dark:border-gray-700"
                                                        checked={
                                                            data.highlighted
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "highlighted",
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="highlighted"
                                                        className="block ml-2 text-sm text-gray-700 dark:text-gray-200"
                                                    >
                                                        Afficher ce partenaire
                                                        dans les sections mises
                                                        en avant
                                                    </label>
                                                </div>
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.highlighted}
                                                />
                                            </div>

                                            {/* Description */}
                                            <div className="md:col-span-2">
                                                <InputLabel
                                                    htmlFor="description"
                                                    value="Description"
                                                />
                                                <div className="relative">
                                                    <div className="absolute pointer-events-none top-3 left-3">
                                                        <TbEdit className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <textarea
                                                        id="description"
                                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-orange-500 dark:focus:border-indigo-600 focus:ring-orange-500 dark:focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                        value={data.description}
                                                        onChange={(e) =>
                                                            setData(
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        rows={5}
                                                        placeholder="Décrivez votre entreprise ou organisation..."
                                                    />
                                                </div>
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.description}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {mustVerifyEmail &&
                                user.email_verified_at === null && (
                                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            Votre adresse e-mail n'est pas
                                            vérifiée.
                                            <Link
                                                href={route(
                                                    "verification.send"
                                                )}
                                                method="post"
                                                as="button"
                                                className="ml-2 font-medium text-yellow-600 underline hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:no-underline focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                            >
                                                Cliquez ici pour renvoyer
                                                l'e-mail de vérification.
                                            </Link>
                                        </p>

                                        {status ===
                                            "verification-link-sent" && (
                                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                Un nouveau lien de vérification
                                                a été envoyé à votre adresse
                                                e-mail.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center justify-end gap-4 pt-6">
                                <PrimaryButton
                                    disabled={processing}
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 dark:from-indigo-500 dark:to-purple-500 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-lg"
                                >
                                    Enregistrer les modifications
                                </PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        Enregistré.
                                    </p>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}
