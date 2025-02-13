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
        'telephone',
        'localisation',
        'surface_cultivee',
        'type_activite_agricole',
    ];
}
