<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function count()
    {
        $client       = DB::table('clients')->count();
        $installation = DB::table('installations')->count();
        $maintenance  = DB::table('maintenances')->count();
        $soldtotal    = DB::table('paiements')->sum('montant');

        $data = [
            'client'=>$client,
            'installation'=>$installation,
            'maintenance'=>$maintenance,
            'soldtotal'=>$soldtotal
        ];

        return response()->json(['data'=>$data], 200);
    }
}
