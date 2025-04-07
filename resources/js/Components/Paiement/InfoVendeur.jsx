import InputError from "../inputs/InputError"
import InputLabel from "../inputs/InputLabel"
import SelectInput from "../inputs/SelectInput"
import TextInput from "../inputs/TextInput"

const InfoVendeur = ({ data, setData, errors, validationErrors, setValidationErrors }) => {
    return (
        <div>
            <div className='my-4 font-bold text-lg'>Vendeur</div>
            <div className='flex flex-col gap-4'>
                <div>
                    <InputLabel htmlFor="nom_vendeurs" value="Nom" />
                    <TextInput
                        id="nom_vendeurs"
                        name="nom_vendeurs"
                        value={data.nom_vendeurs}
                        className="block w-full mt-1"
                        autoComplete="nom_vendeurs"
                        onChange={(e) => setData('nom_vendeurs', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'nom_vendeurs': '' })}
                    />
                    <InputError message={validationErrors.nom_vendeurs || errors.nom_vendeurs} className="mt-2" />
                </div>
                <div className='grid grid-cols-3 gap-3'>
                    <div className='col-span-1'>
                        <SelectInput
                            id="select1"
                            type="select1"
                            name="select1"
                            value={data.select1}
                            className="block w-full mt-1"
                            autoComplete="select1"
                            onChange={(e) => setData('select1', e.target.value)}
                            required
                        >
                            <option value="préventive">Numéro TVA</option>
                        </SelectInput>
                    </div>
                    <div className='col-span-2'>
                        <TextInput
                            id="num_tva"
                            name="num_tva"
                            value={data.num_tva}
                            className="block w-full mt-1"
                            autoComplete="num_tva"
                            onChange={(e) => setData('num_tva', e.target.value)}
                            required
                            onFocus={() => setValidationErrors({ ...validationErrors, 'num_tva': '' })}
                        />
                        <InputError message={validationErrors.num_tva || errors.num_tva} className="mt-2" />
                    </div>
                </div>
                <div>
                    <InputLabel htmlFor="nom_rue_vendeur" value="N* et nom de rue" />
                    <TextInput
                        id="nom_rue_vendeur"
                        name="nom_rue_vendeur"
                        value={data.nom_rue_vendeur}
                        className="block w-full mt-1"
                        autoComplete="nom_rue_vendeur"
                        onChange={(e) => setData('nom_rue_vendeur', e.target.value)}
                        required
                        onFocus={() => setValidationErrors({ ...validationErrors, 'nom_rue_vendeur': '' })}
                    />
                    <InputError message={validationErrors.nom_rue_vendeur || errors.nom_rue_vendeur} className="mt-2" />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <InputLabel htmlFor="ville_vendeur" value="Ville" />
                        <TextInput
                            id="ville_vendeur"
                            name="ville_vendeur"
                            value={data.ville_vendeur}
                            className="block w-full mt-1"
                            autoComplete="ville_vendeur"
                            onChange={(e) => setData('ville_vendeur', e.target.value)}
                            required
                            onFocus={() => setValidationErrors({ ...validationErrors, 'ville_vendeur': '' })}
                        />
                        <InputError message={validationErrors.ville_vendeur || errors.ville_vendeur} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="pays_vendeur" value="Pays" />
                        <TextInput
                            id="pays_vendeur"
                            name="pays_vendeur"
                            value={data.pays_vendeur}
                            className="block w-full mt-1"
                            autoComplete="pays_vendeur"
                            onChange={(e) => setData('pays_vendeur', e.target.value)}
                            required
                            onFocus={() => setValidationErrors({ ...validationErrors, 'pays_vendeur': '' })}
                        />
                        <InputError message={validationErrors.pays_vendeur || errors.pays_vendeur} className="mt-2" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoVendeur
