import HeaderPage from '@/Components/HeaderPage';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React, { useState } from 'react'

const PompePage = () => {
    const [search, setSearch] = useState("");

    const handleNewPompe = () => {
        alert('open dialog')
    }

    return (
        <AuthenticatedLayout>
            <Head title='Matériels' />
            <HeaderPage
                title='Liste des Matériels'
                handleClick={handleNewPompe}
                setSearch={setSearch}
                search={search}
            />
        </AuthenticatedLayout>
    )
}

export default PompePage
