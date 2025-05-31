<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    /**
     * Les champs qui peuvent être remplis massivement.
     *
     * @var array
     */
    protected $fillable = [
        'nom',
        'prenom',
        'CIN',
        'genre',
        'email',
        'telephone',
        'localisation',
        'date_contrat',
        'surface_cultivee',
        'type_activite_agricole'
    ];

    public function installations()
    {
        return $this->hasMany(Installation::class, 'client_id');
    }

    public function paiement()
    {
        return $this->hasMany(Paiement::class, 'client_id');
    }

    public function alert()
    {
        return $this->hasMany(Alerts::class);
    }

}
