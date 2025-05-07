import InputError from '@/Components/inputs/InputError';
import InputLabel from '@/Components/inputs/InputLabel';
import PrimaryButton from '@/Components/buttons/PrimaryButton';
import TextInput from '@/Components/inputs/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { TbLock, TbShieldLock, TbKey } from 'react-icons/tb';
import { set } from 'lodash';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
        setErrors,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <div className="space-y-6">
                <div className="max-w-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pour une sécurité optimale, utilisez un mot de passe fort contenant des lettres majuscules et minuscules, des chiffres et des caractères spéciaux.
                    </p>
                </div>

                <form onSubmit={updatePassword} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <InputLabel
                                htmlFor="current_password"
                                value="Mot de passe actuel"
                            />
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <TbKey className="w-5 h-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) =>
                                        setData('current_password', e.target.value)
                                    }
                                    type="password"
                                    className="pl-10 block w-full"
                                    autoComplete="current-password"
                                    onFocus={() => setErrors({...errors, current_password: ""})}
                                />
                            </div>
                            <InputError
                                message={errors.current_password}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Nouveau mot de passe" />
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <TbLock className="w-5 h-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type="password"
                                    className="pl-10 block w-full"
                                    autoComplete="new-password"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirmer le nouveau mot de passe"
                            />
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <TbShieldLock className="w-5 h-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    type="password"
                                    className="pl-10 block w-full"
                                    autoComplete="new-password"
                                />
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 justify-end pt-2">
                        <PrimaryButton 
                            disabled={processing}
                            className="bg-gradient-to-r from-orange-500 to-pink-500 dark:from-indigo-500 dark:to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Mettre à jour le mot de passe
                        </PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Mot de passe mis à jour.
                            </p>
                        </Transition>
                    </div>
                </form>
            </div>
        </section>
    );
}
