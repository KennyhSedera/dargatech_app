<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $client_id
 * @property int $installation_id
 * @property string $type_alert
 * @property string $message
 * @property bool $resolue
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client $client
 * @property-read \App\Models\Installation $installation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts whereInstallationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts whereResolue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts whereTypeAlert($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alerts whereUpdatedAt($value)
 */
	class Alerts extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $nom
 * @property string $prenom
 * @property string $telephone
 * @property string $localisation
 * @property string|null $genre
 * @property string|null $email
 * @property string|null $CIN
 * @property string|null $date_contrat
 * @property string $type_activite_agricole
 * @property float $surface_cultivee
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Alerts> $alert
 * @property-read int|null $alert_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Installation> $installations
 * @property-read int|null $installations_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Paiement> $paiement
 * @property-read int|null $paiement_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereCIN($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereDateContrat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereGenre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereLocalisation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client wherePrenom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereSurfaceCultivee($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereTypeActiviteAgricole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereUpdatedAt($value)
 */
	class Client extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $cle
 * @property string $valeur
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Configurations newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Configurations newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Configurations query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Configurations whereCle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Configurations whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Configurations whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Configurations whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Configurations whereValeur($value)
 */
	class Configurations extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $code_installation
 * @property int $client_id
 * @property string $date_installation
 * @property float $puissance_pompe
 * @property float $profondeur_forage
 * @property float $debit_nominal
 * @property string $statuts
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $numero_serie
 * @property string $source_eau
 * @property int $hmt
 * @property int $localisation_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Alerts> $alert
 * @property-read int|null $alert_count
 * @property-read \App\Models\Client $client
 * @property-read \App\Models\Localisation $localisation
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Maintenance> $maintenance
 * @property-read int|null $maintenance_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereCodeInstallation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereDateInstallation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereDebitNominal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereHmt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereLocalisationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereNumeroSerie($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereProfondeurForage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation wherePuissancePompe($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereSourceEau($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereStatuts($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Installation whereUpdatedAt($value)
 */
	class Installation extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property float $latitude
 * @property float $longitude
 * @property string $pays
 * @property string $ville
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client|null $client
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation wherePays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Localisation whereVille($value)
 */
	class Localisation extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $installation_id
 * @property string $type_intervention
 * @property string $description_probleme
 * @property string $date_intervention
 * @property string $status_intervention
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Installation $installation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance whereDateIntervention($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance whereDescriptionProbleme($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance whereInstallationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance whereStatusIntervention($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance whereTypeIntervention($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Maintenance whereUpdatedAt($value)
 */
	class Maintenance extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Materiel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Materiel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Materiel query()
 */
	class Materiel extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $phone_number
 * @property string $text
 * @property string $sender
 * @property bool $isRead
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereIsRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message wherePhoneNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereSender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereUpdatedAt($value)
 */
	class Message extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $client_id
 * @property float $montant
 * @property string $date_paiement
 * @property string $mode_paiement
 * @property string $periode_couverte
 * @property string|null $echeance
 * @property string|null $statut_paiement
 * @property string|null $observation
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $description
 * @property string $numero
 * @property string $date_creation
 * @property string $date
 * @property string $lieu_creation
 * @property string $date_additionnel
 * @property string $nom_vendeur
 * @property string $nom_vendeurs
 * @property string $select1
 * @property string|null $num_tva
 * @property string $nom_rue_vendeur
 * @property string $ville_vendeur
 * @property string $pays_vendeur
 * @property-read \App\Models\Client $client
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Products> $produits
 * @property-read int|null $produits_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereDateAdditionnel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereDateCreation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereDatePaiement($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereEcheance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereLieuCreation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereModePaiement($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereMontant($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereNomRueVendeur($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereNomVendeur($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereNomVendeurs($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereNumTva($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereNumero($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereObservation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement wherePaysVendeur($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement wherePeriodeCouverte($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereSelect1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereStatutPaiement($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereVilleVendeur($value)
 */
	class Paiement extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $logo
 * @property string|null $adresse
 * @property string|null $ville
 * @property string|null $pays
 * @property string|null $telephone
 * @property string|null $site_web
 * @property string $categorie
 * @property string|null $description
 * @property bool $highlighted
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $email
 * @property-read mixed $nom
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereAdresse($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereCategorie($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereHighlighted($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire wherePays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereSiteWeb($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Partenaire whereVille($value)
 */
	class Partenaire extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $designation
 * @property string|null $reference
 * @property int $quantite
 * @property string|null $unite
 * @property float $tva
 * @property float $prix_unitaire
 * @property float $total_ht
 * @property float $total_ttc
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $paiement_id
 * @property-read \App\Models\Paiement|null $paiement
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereDesignation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products wherePaiementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products wherePrixUnitaire($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereQuantite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereTotalHt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereTotalTtc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereTva($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereUnite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Products whereUpdatedAt($value)
 */
	class Products extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $contact
 * @property string|null $genre
 * @property string|null $adress
 * @property string|null $speciality
 * @property string|null $photo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereAdress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereGenre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile wherePhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereSpeciality($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereUserId($value)
 */
	class Profile extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $type_rapport
 * @property string $contenu
 * @property string $date_generation
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports whereContenu($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports whereDateGeneration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports whereTypeRapport($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Rapports whereUpdatedAt($value)
 */
	class Rapports extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $contact
 * @property string $genre
 * @property string $adress
 * @property string|null $speciality
 * @property string|null $photo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Maintenance> $maintenance
 * @property-read int|null $maintenance_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien whereAdress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien whereContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien whereGenre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien wherePhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien whereSpeciality($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Technicien whereUserId($value)
 */
	class Technicien extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $logo_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $logo_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Paiement> $paiement
 * @property-read int|null $paiement_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Type_paiements newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Type_paiements newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Type_paiements query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Type_paiements whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Type_paiements whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Type_paiements whereLogoPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Type_paiements whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Type_paiements whereUpdatedAt($value)
 */
	class Type_paiements extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property \App\Models\UserRole $user_role
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\Partenaire|null $partenaire
 * @property-read \App\Models\Profile|null $profile
 * @property-read \App\Models\Technicien|null $technicien
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUserRole($value)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property bool $isAdmin
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $user
 * @property-read int|null $user_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereIsAdmin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereUpdatedAt($value)
 */
	class UserRole extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|maintenacesSemestre newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|maintenacesSemestre newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|maintenacesSemestre query()
 */
	class maintenacesSemestre extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $clientId
 * @property int $technicienId
 * @property int $maintenanceId
 * @property string $description_panne
 * @property string $diagnostic_initial
 * @property string $cause_identifiee
 * @property string $intervention_realisee
 * @property string $verification_fonctionnement
 * @property string $recommandation_client
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $date_intervention
 * @property string|null $photo_probleme
 * @property-read \App\Models\Client|null $client
 * @property-read \App\Models\Maintenance|null $maintenance
 * @property-read \App\Models\Technicien|null $technicien
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereCauseIdentifiee($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereDateIntervention($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereDescriptionPanne($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereDiagnosticInitial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereInterventionRealisee($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereMaintenanceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances wherePhotoProbleme($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereRecommandationClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereTechnicienId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|rapportMaintenances whereVerificationFonctionnement($value)
 */
	class rapportMaintenances extends \Eloquent {}
}

