import InputError from '@/Components/inputs/InputError';
import InputLabel from '@/Components/inputs/InputLabel';
import PrimaryButton from '@/Components/buttons/PrimaryButton';
import TextInput from '@/Components/inputs/TextInput';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { logo, titre } from '@/constant';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <MainLayout>
            <Head title={'Reset Password'} />
            <div className="grid grid-cols-1 md:grid-cols-3 w-4/5 p-4 rounded-md z-50">
                <div className="flex items-center justify-center flex-col md:col-span-2">
                    <img src={logo} alt="Logo" className="max-w-xs md:max-w-md h-auto" />
                    <img src={titre} alt="Titre" className="max-w-xs md:max-w-md h-auto" />
                </div>
                <div className="flex items-center justify-center">
                <div className='mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800'>
                    <Head title="Reset Password" />

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Mot de passe" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirmer le mot de passe"
                            />

                            <TextInput
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Réinitialiser le mot de passe
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </MainLayout>
    );
}
