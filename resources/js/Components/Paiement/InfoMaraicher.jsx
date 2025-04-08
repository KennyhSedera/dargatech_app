import React from 'react'
import InputLabel from '../inputs/InputLabel'
import SelectInput from '../inputs/SelectInput'
import InputError from '../inputs/InputError'
import InputAutocomplete from '../inputs/InputAutocomplete '
import TextInput from '../inputs/TextInput'

const InfoMaraicher = ({ clients, data, setData, errors, validationErrors, setValidationErrors, handleSelect }) => {
    return (
        <div>
            <div className='my-4 font-bold text-lg'>Maraicheur</div>
            <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-5 gap-3'>
                    <div>
                        <InputLabel htmlFor="civilite_acheteur" value="Civilité" />
                        <SelectInput
                            id="civilite_acheteur"
                            type="civilite_acheteur"
                            name="civilite_acheteur"
                            value={data.civilite_acheteur}
                            className="block w-full mt-1"
                            autoComplete="civilite_acheteur"
                            onChange={(e) => setData('civilite_acheteur', e.target.value)}
                            required
                        >
                            <option value="préventive">Mr.</option>
                            <option value="curative">Mme.</option>
                        </SelectInput>
                        <InputError message={errors.civilite_acheteur} className="mt-2" />
                    </div>
                    <div className='col-span-2'>
                        <InputLabel htmlFor="prenom_acheteur" value="Prénom" />
                        <InputAutocomplete data={clients} isFocused={true} className="block w-full mt-1" onSelect={handleSelect} defaultValue={data.client_id} onFocus={() => setValidationErrors({ ...validationErrors, 'client_id': '' })} />
                        <InputError message={validationErrors.prenom_acheteur || errors.prenom_acheteur} className="mt-2" />
                    </div>
                    <div className='col-span-2'>
                        <InputLabel htmlFor="nom_acheteur" value="Nom de famille" />
                        <TextInput
                            id="nom_acheteur"
                            name="nom_acheteur"
                            value={data.nom_acheteur}
                            className="block w-full mt-1"
                            autoComplete="nom_acheteur"
                            onChange={(e) => setData('nom_acheteur', e.target.value)}
                            required
                            onFocus={() => setValidationErrors({ ...validationErrors, 'nom_acheteur': '' })}
                        />
                        <InputError message={validationErrors.nom_acheteur || errors.nom_acheteur} className="mt-2" />
                    </div>
                </div>
                <div>
                    <InputLabel htmlFor="num_rue_acheteur" value="Village ou Quartier" />
                    <TextInput
                        id="num_rue_acheteur"
                        name="num_rue_acheteur"
                        value={data.num_rue_acheteur}
                        className="block w-full mt-1"
                        autoComplete="num_rue_acheteur"
                        onChange={(e) => setData('num_rue_acheteur', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'num_rue_acheteur': '' })}
                    />
                    <InputError message={validationErrors.num_rue_acheteur || errors.num_rue_acheteur} className="mt-2" />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <InputLabel htmlFor="ville_acheteur" value="Ville" />
                        <TextInput
                            id="ville_acheteur"
                            name="ville_acheteur"
                            value={data.ville_acheteur}
                            className="block w-full mt-1"
                            autoComplete="ville_acheteur"
                            onChange={(e) => setData('ville_acheteur', e.target.value)}
                            required
                            onFocus={() => setValidationErrors({ ...validationErrors, 'ville_acheteur': '' })}
                        />
                        <InputError message={validationErrors.ville_acheteur || errors.ville_acheteur} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="pays_acheteur" value="Pays" />
                        <TextInput
                            id="pays_acheteur"
                            name="pays_acheteur"
                            value={data.pays_acheteur}
                            className="block w-full mt-1"
                            autoComplete="pays_acheteur"
                            onChange={(e) => setData('pays_acheteur', e.target.value)}
                            required
                            onFocus={() => setValidationErrors({ ...validationErrors, 'pays_acheteur': '' })}
                        />
                        <InputError message={validationErrors.pays_acheteur || errors.pays_acheteur} className="mt-2" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoMaraicher
