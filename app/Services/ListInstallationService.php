<?php

namespace App\Services;

use DB;
use Log;

class ListInstallationService
{
    public function getInstallations()
    {
        $installations = DB::table('installations')->get();
        Log::info('Liste des installations', ['installations' => $installations]);
        return $installations;
    }
}
