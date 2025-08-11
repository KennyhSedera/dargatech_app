<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class LocationService
{
    public function getLocationDetails($lat, $lon)
    {
        $cacheKey = "location_" . round($lat, 6) . "_" . round($lon, 6);

        return Cache::remember($cacheKey, 3600, function() use ($lat, $lon) {
            return $this->fetchLocationDetails($lat, $lon);
        });
    }

    private function fetchLocationDetails($lat, $lon)
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Laravel-App/1.0 (contact@monapp.com)',
                'Accept' => 'application/json',
            ])->timeout(15)->get('https://nominatim.openstreetmap.org/reverse', [
                'format' => 'json',
                'lat' => $lat,
                'lon' => $lon,
                'zoom' => 18,
                'addressdetails' => 1,
                'accept-language' => 'fr'
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (!$data || !isset($data['address'])) {
                    Log::warning('Nominatim: Pas de données d\'adresse trouvées', [
                        'lat' => $lat,
                        'lon' => $lon,
                        'response' => $data
                    ]);
                    return $this->getErrorResponse();
                }

                $address = $data['address'];

                return $this->parseNominatimData($data);
            }

            Log::error('Erreur réponse Nominatim', [
                'status' => $response->status(),
                'body' => $response->body(),
                'lat' => $lat,
                'lon' => $lon
            ]);

            return $this->getErrorResponse();

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de localisation', [
                'lat' => $lat,
                'lon' => $lon,
                'error' => $e->getMessage()
            ]);

            return $this->getErrorResponse();
        }
    }

    private function getErrorResponse()
    {
        return [
            'adresse' => 'Erreur lors de la récupération',
            'pays' => 'Erreur',
            'code_pays' => 'Erreur',
        ];
    }

    private function parseNominatimData($data)
    {
        if (!$data || !isset($data['address'])) {
            return $this->getErrorResponse();
        }

        $address = $data['address'];

        return [

            'adresse' => $data['display_name'] ?? 'Adresse non trouvée',

            'pays' => $address['country'] ?? 'Pays non trouvé',

            'code_pays' => isset($address['country_code'])
                         ? strtoupper($address['country_code'])
                         : 'Code pays non trouvé',
        ];
    }
}
