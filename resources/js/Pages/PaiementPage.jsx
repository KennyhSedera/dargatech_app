import HeaderPage from '@/Components/HeaderPage';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React, { useState } from 'react'

const PaiementPage = () => {
    const [search, setSearch] = useState("");

    const handleNewPaiement = () => {
        alert('open dialog')
    }

    return (
        <AuthenticatedLayout>
            <Head title='Paiements' />
            <HeaderPage
                title='Liste des Paiements'
                handleClick={handleNewPaiement}
                setSearch={setSearch}
                search={search}
            />
        </AuthenticatedLayout>
    )
}

export default PaiementPage
