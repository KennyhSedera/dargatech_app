import Checkbox from '@/Components/inputs/Checkbox';
import InputError from '@/Components/inputs/InputError';
import InputLabel from '@/Components/inputs/InputLabel';
import PrimaryButton from '@/Components/buttons/PrimaryButton';
import TextInput from '@/Components/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { validateFormLogin } from '@/Components/validateForm';

export default function Login({ status, canResetPassword, setTitle }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [validationErrors, setValidationErrors] = useState({});

    const submit = (e) => {
        e.preventDefault();

        if (!validateFormLogin(data, setValidationErrors)) {
            return;
        }

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className='w-full h-full px-6 py-4 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800'>
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full mt-1"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        onFocus={() => setValidationErrors({ ...validationErrors, email: '' })}
                    />

                    <InputError message={validationErrors.email || errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full mt-1"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        onFocus={() => setValidationErrors({ ...validationErrors, password: '' })}
                    />

                    <InputError message={validationErrors.password || errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="text-sm text-gray-600 ms-2 dark:text-gray-400">
                            Souviens moi
                        </span>
                    </label>
                </div>

                <div className="mt-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Se connecter
                    </PrimaryButton>
                </div>

                <div
                    onClick={() => setTitle('Forgot Password')}
                    className="mt-4 text-sm cursor-pointer text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                    Mot de passe oublié?
                </div>
            </form>
        </div>
    );
}
