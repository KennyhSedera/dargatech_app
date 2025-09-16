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
            ->whereDate('updated_at', Carbon::today())
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

        // $installationcount = DB::table('installations')
        //     ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
        // // ->whereBetween('created_at', [Carbon::now()->subDays(7), Carbon::now()])
        //     ->limit(7)
        //     ->groupBy(DB::raw('DATE(created_at)'))
        //     ->orderBy('date', 'asc')
        //     ->get();

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
        ];

        return response()->json(['data' => $data], 200);
    }
}
