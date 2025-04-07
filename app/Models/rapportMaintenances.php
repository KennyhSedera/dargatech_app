<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class rapportMaintenances extends Model
{
    use HasFactory;

    protected $table = 'rapport_maintenances';
    protected $fillable = ['clientId', 'technicienId', 'description_panne', 'diagnostic_initial', 'cause_identifiee', 'intervention_realisee', 'verificaton_fonctionnement', 'recommandation_client'];
}
