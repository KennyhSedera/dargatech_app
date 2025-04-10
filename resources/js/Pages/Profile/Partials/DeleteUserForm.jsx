import DangerButton from '@/Components/buttons/DangerButton';
import InputError from '@/Components/inputs/InputError';
import InputLabel from '@/Components/inputs/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/buttons/SecondaryButton';
import TextInput from '@/Components/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { TbAlertTriangle, TbLock } from 'react-icons/tb';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <div className="max-w-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Une fois votre compte supprimé, toutes ses ressources et données
                    seront définitivement effacées. Avant de supprimer votre compte,
                    veuillez télécharger toutes les données ou informations que vous souhaitez
                    conserver.
                </p>
            </div>

            <DangerButton
                onClick={confirmUserDeletion}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-700 dark:to-pink-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
                <TbAlertTriangle className="w-5 h-5 mr-2" />
                Supprimer le compte
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                            <TbAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Êtes-vous sûr de vouloir supprimer votre compte ?
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Une fois votre compte supprimé, toutes ses ressources et
                        données seront définitivement supprimées. Cette action est irréversible.
                        Veuillez entrer votre mot de passe pour confirmer que vous souhaitez
                        supprimer définitivement votre compte.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Mot de passe"
                            className="sr-only"
                        />

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <TbLock className="w-5 h-5 text-gray-400" />
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-10 mt-1 block w-full"
                                isFocused
                                placeholder="Votre mot de passe"
                            />
                        </div>

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton
                            onClick={closeModal}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            Annuler
                        </SecondaryButton>

                        <DangerButton 
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-700 dark:to-pink-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5" 
                            disabled={processing}
                        >
                            <TbAlertTriangle className="w-5 h-5 mr-2" />
                            Confirmer la suppression
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
