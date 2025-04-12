import InputError from '@/Components/inputs/InputError';
import PrimaryButton from '@/Components/buttons/PrimaryButton';
import TextInput from '@/Components/inputs/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import Snackbar from '@/Components/Snackbar';

export default function ForgotPassword({ status, setTitle }) {
    const { data, setData, post, errors, setError } = useForm({
        email: '',
    });
    const [processing, setProcessing] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await axios.post('forgot-password', {
                email: data.email,
            });

            if (response.status === 200) {
                setAlert({ show: true, message: response.data.message, type: 'success' });
                setTimeout(() => {
                    setTitle('Log In');
                }, 3000);
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setAlert({ show: true, message: error.response.data.errors || {}, type: 'error' });
            } else {
                console.error(error);
            }
        } finally {
            setData('email', '');
            setProcessing(false);
        }
    };
    
    return (
        <div className='mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800'>
            <Head title="Mot de passe oublié" />
            <Snackbar
                show={alert.show}
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ show: false, message: '', type: '' })}
            />  

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Vous avez oublié votre mot de passe ? Pas de problème. Indiquez-nous simplement votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                    onFocus={() => setError('email', '')}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <button onClick={() => setTitle('Log In')}>
                        Retour
                    </button>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Envoyer
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
