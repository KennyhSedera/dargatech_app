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

const Welcome = () => {
    const [title, setTitle] = useState('Log In');
    const user = usePage().props.auth.user;

    useEffect(() => {
        if (user) {
            router.visit('/');
        }
    }, [user]);

    const Components = [
        { component: <Login canResetPassword />, title: 'Log In', id: 0 },
        { component: <Register />, title: 'Register', id: 1 },
        { component: <ForgotPassword />, title: 'Forgot Password', id: 2 },
        { component: <ConfirmPassword />, title: 'Confirm Password', id: 3 },
        { component: <ResetPassword />, title: 'Reset Password', id: 4 },
        { component: <VerifyEmail />, title: 'Verify Email', id: 5 }
    ];



    return (
        <MainLayout>
            <Head title={title} />
            <div className='flex items-center w-4/5'>
                <div className='w-2/3'>
                    Welcome
                </div>
                <div className='w-1/3'>
                    {Components.find(el => el.title === title)?.component}
                </div>
            </div>
        </MainLayout>
    );
};

export default Welcome;
