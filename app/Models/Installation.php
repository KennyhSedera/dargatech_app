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
    // In your Installation model
    protected $fillable = [
        'client_id',
        'date_installation',
        'puissance_pompe',
        'profondeur_forage',
        'numero_serie',
        'debit_nominal',
        'code_installation',
        'statuts',
        'localisation_id',
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

    public function localisation()
    {
        return $this->belongsTo(Localisation::class, 'localisation_id');
    }
}
