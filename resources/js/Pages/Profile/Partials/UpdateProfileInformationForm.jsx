import InputError from '@/Components/inputs/InputError';
import InputLabel from '@/Components/inputs/InputLabel';
import PrimaryButton from '@/Components/buttons/PrimaryButton';
import TextInput from '@/Components/inputs/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { TbUser, TbMail, TbPhone, TbMapPin, TbBriefcase, TbUpload, TbTrash } from 'react-icons/tb';
import { updatePhoto } from '@/Services/profileService';
export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    onSuccess
}) {
    const user = usePage().props.auth.user;
    const profile = user.profile || {};
    const technicien = user.technicien || {};
    const partenaire = user.partenaire || {};
    const photoInput = useRef();
    const [previewUrl, setPreviewUrl] = useState(
        profile.photo ? `${profile.photo}` : 
        technicien.photo ? `${technicien.photo}` : 
        partenaire.logo ? `${partenaire.logo}` : 
        null
    );

    const { data, setData, post, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            genre: profile.genre || technicien.genre || partenaire.genre || '',
            contact: profile.contact || technicien.contact || partenaire.telephone || '',
            adress: profile.adress || technicien.adress || partenaire.adresse || '',
            speciality: profile.speciality || technicien.speciality || partenaire.speciality || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            const formData = new FormData();
            formData.append('photo', e.target.files[0]);
            
            // Afficher un aperçu immédiatement
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
            
            // Envoyer la photo au serveur
            updatePhoto(formData);  
        }
    };

    const removePhoto = () => {
        setData('photo', null);
        setPreviewUrl(null);
        if (photoInput.current) {
            photoInput.current.value = '';
        }
    };

    return (
        <section className={`${className} min-h-screen`}>
            <form onSubmit={submit} className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Colonne de gauche - Photo */}
                        <div className="w-full md:w-1/3 bg-gradient-to-br from-orange-500 to-pink-500 dark:from-indigo-600 dark:to-purple-700 p-8 flex flex-col items-center justify-center">
                            <div className="space-y-6 text-center">
                                <div className="relative group">
                                    <div className="w-48 h-48 rounded-full overflow-hidden bg-white dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-2xl mx-auto">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                                        ) : (
                                            <TbUser className="w-24 h-24 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                type="button"
                                                onClick={() => photoInput.current.click()}
                                                className="p-3 bg-white rounded-full text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-indigo-400 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                            >
                                                <TbUpload className="w-6 h-6" />
                                            </button>
                                            {previewUrl && (
                                                <button
                                                    type="button"
                                                    onClick={removePhoto}
                                                    className="p-3 bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                                <p className="text-lg text-white font-medium">
                                    {data.name}
                                </p>
                                {user.user_role.name === 'technicien' && <p className="text-sm text-white/80">
                                    {data.speciality || 'Votre spécialité'}
                                </p>}
                                <p className="text-sm text-white/70">
                                    Cliquez sur la photo pour la modifier
                                </p>
                            </div>
                        </div>

                        {/* Colonne de droite - Informations */}
                        <div className="w-full md:w-2/3 p-8">
                            <div className="max-w-3xl mx-auto space-y-8">
                                {/* Informations de base */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <TbUser className="w-6 h-6 text-orange-500 dark:text-indigo-400" />
                                        Informations de base
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nom complet" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <TbUser className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    className="pl-10 mt-1 block w-full"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                    isFocused
                                                    autoComplete="name"
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.name} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Adresse e-mail" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <TbMail className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    className="pl-10 mt-1 block w-full"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                    autoComplete="username"
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.email} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="genre" value="Genre" />
                                            <select
                                                id="genre"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 dark:focus:border-indigo-600 focus:ring-orange-500 dark:focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                value={data.genre}
                                                onChange={(e) => setData('genre', e.target.value)}
                                            >
                                                <option value="">Sélectionnez un genre</option>
                                                <option value="Homme">Homme</option>
                                                <option value="Femme">Femme</option>
                                                <option value="Autre">Autre</option>
                                            </select>
                                            <InputError className="mt-2" message={errors.genre} />
                                        </div>
                                    </div>
                                </div>

                                {/* Informations professionnelles */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <TbBriefcase className="w-6 h-6 text-orange-500 dark:text-indigo-400" />
                                        Informations professionnelles
                                    </h3>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
                                        <div className={`${user.user_role.name !== 'technicien' ? 'col-span-2' : ''}`}>
                                            <InputLabel htmlFor="contact" value="Numéro de téléphone" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none w-full">
                                                    <TbPhone className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="contact"
                                                    type="tel"
                                                    className="pl-10 mt-1 block w-full"
                                                    value={data.contact}
                                                    onChange={(e) => setData('contact', e.target.value)}
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.contact} />
                                        </div>

                                        {user.user_role.name === 'technicien' && <div>
                                            <InputLabel htmlFor="speciality" value="Spécialité" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none w-full">
                                                    <TbBriefcase className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="speciality"
                                                    type="text"
                                                    className="pl-10 mt-1 block w-full"
                                                    value={data.speciality}
                                                    onChange={(e) => setData('speciality', e.target.value)}
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.speciality} />
                                        </div>}

                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="adress" value="Adresse" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none w-full">
                                                    <TbMapPin className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="adress"
                                                    type="text"
                                                    className="pl-10 mt-1 block w-full"
                                                    value={data.adress}
                                                    onChange={(e) => setData('adress', e.target.value)}
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.adress} />
                                        </div>
                                    </div>
                                </div>

                                {mustVerifyEmail && user.email_verified_at === null && (
                                    <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            Votre adresse e-mail n'est pas vérifiée.
                                            <Link
                                                href={route('verification.send')}
                                                method="post"
                                                as="button"
                                                className="ml-2 font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                            >
                                                Cliquez ici pour renvoyer l'e-mail de vérification.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                Un nouveau lien de vérification a été envoyé à votre adresse e-mail.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4 justify-end pt-6">
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
                </div>
            </form>
        </section>
    );
}
