<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class rapportMaintenances extends Model
{
    use HasFactory;

    protected $table = 'rapport_maintenances';
    
    protected $fillable = [
        'clientId',
        'technicienId',
        'maintenanceId',
        'description_panne',
        'photo_probleme',
        'diagnostic_initial',
        'cause_identifiee',
        'intervention_realisee',
        'verification_fonctionnement',
        'recommandation_client',
        'date_intervention'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'clientId');
    }

    public function technicien()
    {
        return $this->belongsTo(Technicien::class, 'technicienId');
    }

    public function maintenance()
    {
        return $this->belongsTo(Maintenance::class, 'maintenanceId');
    }
}
