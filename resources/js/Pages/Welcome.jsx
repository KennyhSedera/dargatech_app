import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ForgotPassword from './Auth/ForgotPassword';
import ConfirmPassword from './Auth/ConfirmPassword';
import ResetPassword from './Auth/ResetPassword';
import VerifyEmail from './Auth/VerifyEmail';
import { logo, titre } from '@/constant';

const Welcome = () => {
    const [title, setTitle] = useState('Log In');
    const user = usePage().props.auth.user;

    useEffect(() => {
        if (user) {
            router.visit('/');
        }
    }, [user]);

    const Components = [
        { component: <Login canResetPassword setTitle={setTitle} />, title: 'Log In', id: 0 },
        { component: <Register setTitle={setTitle} />, title: 'Register', id: 1 },
        { component: <ForgotPassword setTitle={setTitle} />, title: 'Forgot Password', id: 2 },
        { component: <ConfirmPassword setTitle={setTitle} />, title: 'Confirm Password', id: 3 },
        { component: <ResetPassword setTitle={setTitle} />, title: 'Reset Password', id: 4 },
        { component: <VerifyEmail setTitle={setTitle} />, title: 'Verify Email', id: 5 }
    ];


    return (
        <MainLayout>
            <Head title={title} />
            <div className="grid grid-cols-1 md:grid-cols-3 w-4/5 p-4 rounded-md z-50">
                <div className="flex items-center justify-center flex-col md:col-span-2 gap-8">
                    <div className='flex gap-5 items-center'>
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-16 h-16 md:w-20 md:h-20 transition-transform duration-1000 animate-pulse"
                        />
                        <img
                            src={titre}
                            alt="Titre"
                            className="max-w-[240px] md:max-w-[320px] h-auto"
                        />
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-lg md:text-3xl text-orange-400">
                            Bienvenue sur notre plateforme SISAM
                        </p>
                        <p className="text-xl md:text-2xl font-semibold text-blue-600 leading-tight">
                            Solution d'Irrigation Solaire Améliorée
                        </p>
                        <p className="text-base md:text-lg italic text-white mt-2">
                            « Avec le soleil, récolter des revenus »
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    {Components.find(el => el.title === title)?.component || <p>Aucun composant trouvé</p>}
                </div>
            </div>

        </MainLayout>
    );
};

export default Welcome;
