<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Installation extends Model
{
    use HasFactory;

    const HEURES_PAR_JOUR = 4;
    const JOURS_PAR_SEMAINE = 6;
    const CO2_PAR_M3 = 0.5;

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
        'hmt',
        'created_via',
        'photos_installation',
        'qte_eau',
        'qte_co2',
    ];

    public function getVolumeEauParJourAttribute(): float
    {
        return round($this->debit_nominal * self::HEURES_PAR_JOUR, 3);
    }

    public function getCo2ParJourAttribute(): float
    {
        return round($this->volume_eau_par_jour * self::CO2_PAR_M3, 3);
    }

    public function getVolumeCumuleAttribute(): float
    {
        return round(
            (float) $this->qte_eau + ($this->nombreJoursActifs() * $this->volume_eau_par_jour),
            3
        );
    }
    public function getCo2CumuleAttribute(): float
    {
        return round($this->volume_cumule * self::CO2_PAR_M3, 3);
    }

    public function nombreJoursActifs(?Carbon $dateFin = null): int
    {
        $dateDebut = Carbon::parse($this->date_installation)->startOfDay();
        $dateFin = ($dateFin ?? Carbon::now())->startOfDay();
        $joursTotaux = $dateDebut->diffInDays($dateFin);

        return (int) floor($joursTotaux * (self::JOURS_PAR_SEMAINE / 7));
    }

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
        return $this->belongsTo(Localisation::class, foreignKey: 'localisation_id');
    }
}
