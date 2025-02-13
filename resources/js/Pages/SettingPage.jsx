import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const SettingPage = () => {
    return (
        <AuthenticatedLayout>
            <Head title='Paramètres' />
            SettingPage
        </AuthenticatedLayout>
    )
}

export default SettingPage
