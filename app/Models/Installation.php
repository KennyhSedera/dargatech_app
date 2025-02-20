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
        'surface_panneaux',
        'debit_nominal',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function maintenance()
    {
        return $this->hasMany(Maintenance::class, 'installation_id');
    }

}
