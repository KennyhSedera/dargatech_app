import HeaderPage from '@/Components/HeaderPage'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React, { useState } from 'react'

const InstallationPage = () => {
    const [search, setSearch] = useState("");

    const handleNewInstallation = () => {
        alert('open dialog')
    }

    return (
        <AuthenticatedLayout>
            <Head title='Installations' />
            <HeaderPage
                title='Liste des Installations'
                handleClick={handleNewInstallation}
                setSearch={setSearch}
                search={search}
            />
        </AuthenticatedLayout>
    )
}

export default InstallationPage
