<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    use HasFactory;

    /**
     * Les champs qui peuvent être remplis massivement.
     *
     * @var array
     */
    protected $fillable = [
        'installation_id',
        'type_intervention',
        'description_probleme',
        'solutions_apportees',
        'date_intervention',
        'duree_intervention',
        'technicien',
    ];

    public function installation()
    {
        return $this->belongsTo(Installation::class, 'installation_id');
    }

    public function techniciens()
    {
        return $this->belongsTo(Technicien::class, 'technicien');
    }
}
