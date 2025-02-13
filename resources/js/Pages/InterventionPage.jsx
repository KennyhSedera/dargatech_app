import HeaderPage from '@/Components/HeaderPage';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React, { useState } from 'react'

const InterventionPage = () => {
    const [search, setSearch] = useState("");

    const handleNewIntervention = () => {
        alert('open dialog')
    }

    return (
        <AuthenticatedLayout>
            <Head title='Interventions' />
            <HeaderPage
                title='Liste des Interventions'
                handleClick={handleNewIntervention}
                setSearch={setSearch}
                search={search}
            />
        </AuthenticatedLayout>
    )
}

export default InterventionPage
