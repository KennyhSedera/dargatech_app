<?php

namespace App\Http\Controllers;

use App\Models\Installation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class PompageController extends Controller
{
    private function tableauCumule(
        Installation $installation,
        int $nombreJours = 30,
        ?array $joursPompage = null
    ): Collection {
        $volumeCumule = (float) $installation->qte_eau;
        $dateDebut = Carbon::parse($installation->date_installation);
        $tableau = collect();

        for ($j = 0; $j < $nombreJours; $j++) {
            $dateDuJour = $dateDebut->copy()->addDays($j);
            $pompageActif = $joursPompage ? ($joursPompage[$j] ?? true) : true;

            if ($j === 0) {
                $volumeDuJour = $volumeCumule;
            } else {
                $volumeDuJour = $pompageActif ? $installation->volume_eau_par_jour : 0;
                $volumeCumule += $volumeDuJour;
            }

            $co2Cumule = round($volumeCumule * Installation::CO2_PAR_M3, 3);

            $tableau->push([
                'jour' => $j + 1,
                'date' => $dateDuJour->format('Y-m-d'),
                'pompage_actif' => $pompageActif,
                'volume_cumule_m3' => round($volumeCumule, 3),
                'co2_cumule_kg' => $co2Cumule,
            ]);
        }

        return $tableau;
    }

    public function calcul(int $id)
    {
        $installation = Installation::with('client')->findOrFail($id);
        $dateDebut = Carbon::parse($installation->date_installation)->startOfDay();
        $dateFin = Carbon::now()->startOfDay();
        $nombreJours = (int) $dateDebut->diffInDays($dateFin) + 1;

        $tableauComplet = $this->tableauCumule($installation, $nombreJours);
        $dernierJour = $tableauComplet->last();

        $tableau7Jours = $tableauComplet->values();

        return response()->json([
            'data' => [
                'code_installation' => $installation->code_installation,
                'date_installation' => $dateDebut->format('Y-m-d'),
                'date_fin' => $dateFin->format('Y-m-d'),
                'maraicher' => $installation->client->nom . ' ' . $installation->client->prenom,
                'nombre_jours' => $nombreJours,
                'volume_total_m3' => $dernierJour['volume_cumule_m3'],
                'co2_total_kg' => $dernierJour['co2_cumule_kg'],
            ],
            'tableau_cumule' => $tableau7Jours,
        ]);
    }

    public function calculPersonnalise(Request $request, int $id)
    {
        $installation = Installation::findOrFail($id);

        $request->validate([
            'jours_pompage' => 'required|array|min:1',
            'jours_pompage.*' => 'boolean',
        ]);

        $joursPompage = $request->input('jours_pompage');
        $nombreJours = count($joursPompage);
        $tableau = $this->tableauCumule($installation, $nombreJours, $joursPompage);
        $dernierJour = $tableau->last();
        $joursActifs = collect($joursPompage)->filter()->count();

        return response()->json([
            'installation' => [
                'id' => $installation->id,
                'code_installation' => $installation->code_installation,
                'date_installation' => $installation->date_installation,
                'qte_eau_initiale' => $installation->qte_eau,
                'qte_co2_initiale' => $installation->qte_co2,
            ],
            'valeurs_par_jour' => [
                'volume_eau_par_jour_m3' => $installation->volume_eau_par_jour,
                'co2_par_jour_kg' => $installation->co2_par_jour,
            ],
            'resume' => [
                'nombre_jours_total' => $nombreJours,
                'jours_avec_pompage' => $joursActifs,
                'jours_sans_pompage' => $nombreJours - $joursActifs,
                'volume_total_m3' => $dernierJour['volume_cumule_m3'],
                'co2_total_kg' => $dernierJour['co2_cumule_kg'],
            ],
            'tableau_cumule' => $tableau,
        ]);
    }

    public function miseAJourCumuls(Request $request, int $id)
    {
        $request->validate([
            'jours' => 'required|integer|min:1|max:365',
        ]);

        $installation = Installation::findOrFail($id);
        $tableau = $this->tableauCumule($installation, $request->input('jours'));
        $dernierJour = $tableau->last();

        $installation->update([
            'qte_eau' => $dernierJour['volume_cumule_m3'],
            'qte_co2' => $dernierJour['co2_cumule_kg'],
        ]);

        return response()->json([
            'message' => 'Cumuls mis à jour avec succès.',
            'nouvelle_qte_eau' => $installation->qte_eau,
            'nouvelle_qte_co2' => $installation->qte_co2,
        ]);
    }

    public function calculTous()
    {
        $installations = Installation::with('client')->get();

        $data = $installations->map(function (Installation $installation) {
            $dateDebut = Carbon::parse($installation->date_installation)->startOfDay();
            $dateFin = Carbon::now()->startOfDay();
            $nombreJours = (int) $dateDebut->diffInDays($dateFin) + 1;

            $tableau = $this->tableauCumule($installation, $nombreJours);
            $dernierJour = $tableau->last();

            return [
                'code_installation' => $installation->code_installation,
                'date_installation' => $dateDebut->format('Y-m-d'),
                'date_fin' => $dateFin->format('Y-m-d'),
                'total_jours' => $nombreJours,
                'maraicher' => $installation->client->nom . ' ' . $installation->client->prenom,
                'volume_total_m3' => $dernierJour['volume_cumule_m3'],
                'co2_total_kg' => $dernierJour['co2_cumule_kg'],
            ];
        });

        return response()->json(['data' => $data]);
    }

    public function getTotaux()
    {
        $installations = Installation::all();

        $totaux = $installations->reduce(function ($carry, Installation $installation) {
            $dateDebut = Carbon::parse($installation->date_installation)->startOfDay();
            $dateFin = Carbon::now()->startOfDay();
            $nombreJours = (int) $dateDebut->diffInDays($dateFin) + 1;

            $tableau = $this->tableauCumule($installation, $nombreJours);
            $dernierJour = $tableau->last();

            $carry['volume_total_m3'] += $dernierJour['volume_cumule_m3'];
            $carry['co2_total_kg'] += $dernierJour['co2_cumule_kg'];
            $carry['total_jours'] += $nombreJours;
            $carry['total_installations']++;

            return $carry;
        }, [
            'volume_total_m3' => 0,
            'co2_total_kg' => 0,
            'total_jours' => 0,
            'total_installations' => 0,
        ]);

        return response()->json(['totaux' => $totaux]);
    }
}
