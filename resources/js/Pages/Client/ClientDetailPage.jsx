import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { getClient } from '@/Services/clientService';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { HiMiniDevicePhoneMobile, HiOutlineMapPin } from 'react-icons/hi2';
import { LuTrees } from "react-icons/lu";

const ClientDetailPage = ({ client }) => {
    const [paiement, setpaiement] = useState([]);
    const [installation, setinstallation] = useState([]);

    const getDataDB = async (id) => {
        const data = await getClient(id);
        setinstallation(data?.installations);
        setpaiement(data?.paiement);
        console.log(data);

    }

    useEffect(() => {
        if (client) {
            getDataDB(client.id);
        }
    }, [client])

    return (
        <AuthenticatedLayout>
            <Head title={client.nom + ' ' + client.prenom} />
            <div>
                <p>{client.nom}</p>
                <p>{client.prenom}</p>
                <p className='flex items-center gap-2'>
                    <HiMiniDevicePhoneMobile className='text-xl' />
                    {client.telephone}
                </p>
                <p className='flex items-center gap-2'>
                    <HiOutlineMapPin className='text-xl' />
                    {client.localisation}
                </p>
                <p className='flex items-center gap-2'>
                    <HiMiniDevicePhoneMobile className='text-xl' />
                    {client.surface_cultivee} (ha)
                </p>
                <p className='flex items-center gap-2'>
                    <LuTrees className='text-xl' />
                    {client.type_activite_agricole}
                </p>
            </div>

        </AuthenticatedLayout>
    );
};

export default ClientDetailPage;
