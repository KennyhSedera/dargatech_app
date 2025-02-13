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
            <Head title='Pompes Solaires' />
            <HeaderPage
                title='Liste des Pompes Solaires'
                handleClick={handleNewPompe}
                setSearch={setSearch}
                search={search}
            />
        </AuthenticatedLayout>
    )
}

export default PompePage
