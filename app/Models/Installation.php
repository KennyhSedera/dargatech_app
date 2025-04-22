<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Installation extends Model
{
    use HasFactory;

    /**
     * Les champs qui peuvent être remplis massivement.
     *
     * @var array
     */
    protected $fillable = [
        'client_id',
        'date_installation',
        'puissance_pompe',
        'profondeur_forage',
        'numero_serie',
        'debit_nominal',
        'code_installation',
        'type',
        'modele',
        'garantie',
        'fournisseur',
        'statuts',
        'source_eau',
        'hmt'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function maintenance()
    {
        return $this->hasMany(Maintenance::class, 'installation_id');
    }

    public function alert()
    {
        return $this->hasMany(Alerts::class);
    }

}
