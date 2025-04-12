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
                <div className="flex items-center justify-center flex-col md:col-span-2">
                    <img src={logo} alt="Logo" className="max-w-xs md:max-w-md h-auto" />
                    <img src={titre} alt="Titre" className="max-w-xs md:max-w-md h-auto" />
                </div>
                <div className="flex items-center justify-center">
                    {Components.find(el => el.title === title)?.component || <p>Aucun composant trouvé</p>}
                </div>
            </div>

        </MainLayout>
    );
};

export default Welcome;
