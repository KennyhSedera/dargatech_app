import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

const ClientDetailPage = ({ client }) => {
    return (
        <AuthenticatedLayout>
            <Head title={client.nom + ' ' + client.prenom} />
            <h1>Détails du client</h1>
            <p>Nom : {client.nom}</p>
            <p>Prenom : {client.prenom}</p>
        </AuthenticatedLayout>
    );
};

export default ClientDetailPage;
