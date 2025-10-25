<?php
namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function count()
    {
        $client = DB::table('clients')->count();
        $installation = DB::table('installations')->count();
        $maintenance = DB::table('maintenances')->count();
        $soldtotal = DB::table('paiements')->sum('montant');
        $installationenpanne = DB::table('installations')
            ->whereDate('created_at', Carbon::today())
            ->where('statuts', 'en panne')
            ->count();

        $enpanne = DB::table('installations')
            ->where('statuts', 'en panne')
            ->count();

        $intervention = DB::table('maintenances')
            ->whereDate('created_at', Carbon::today())
            ->count();

        $paiement = DB::table('paiements')
            ->whereDate('created_at', Carbon::today())
            ->count();

        $alert = DB::table('alerts')
            ->whereDate('created_at', Carbon::today())
            ->count();

        $installationcount = DB::table('installations')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get()
            ->sortBy('date')
            ->values();

        $interventioncount = DB::table('maintenances')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get()
            ->sortBy('date')
            ->values();

        $alertcount = DB::table('alerts')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get()
            ->sortBy('date')
            ->values();

        $new_installation = DB::table('installations')
            ->join('clients', 'installations.client_id', '=', 'clients.id')
            ->selectRaw('DATE(installations.created_at) as date,
                 installations.code_installation,
                 installations.statuts,
                 clients.nom as client_nom,
                 clients.prenom as client_prenom')
            ->groupBy(
                DB::raw('DATE(installations.created_at)'),
                'installations.code_installation',
                'installations.statuts',
                'clients.nom',
                'clients.prenom'
            )
            ->orderBy('date', 'desc')
            ->limit(3)
            ->get();

        $new_maraicher = DB::table('clients')
            ->join(
                DB::raw('(SELECT DISTINCT DATE(created_at) as date
                      FROM clients
                      ORDER BY DATE(created_at) DESC
                      LIMIT 3) as recent_dates'),
                DB::raw('DATE(clients.created_at)'),
                '=',
                'recent_dates.date'
            )
            ->selectRaw('DATE(clients.created_at) as date, nom, prenom, id, is_payed, genre')
            ->orderBy('clients.created_at', 'desc')
            ->limit(3)
            ->get();

        $data = [
            'client' => $client,
            'installation' => $installation,
            'maintenance' => $maintenance,
            'soldtotal' => $soldtotal,
            'installationenpanne' => $installationenpanne,
            'intervention' => $intervention,
            'paiement' => $paiement,
            'alert' => $alert,
            'interventioncount' => $interventioncount,
            'installationcount' => $installationcount,
            'alertcount' => $alertcount,
            'enpanne' => $enpanne,
            'new_installation' => $new_installation,
            'new_maraicher' => $new_maraicher,
        ];

        return response()->json(['data' => $data], 200);
    }

}
