<?php

namespace App\Services;

use App\Http\Controllers\DashboardController;
use App\Telegram\Keyboard\DashboardKeyboard;
use Log;

class DashboardService
{
    protected SendMessageService $messageService;
    protected ChartService $chartService;

    public function __construct(
        SendMessageService $messageService,
        ChartService $chartService
    ) {
        $this->messageService = $messageService;
        $this->chartService = $chartService;
    }

    private function getDashboardData()
    {
        try {
            $controller = new DashboardController();
            $response = $controller->count();
            $responseData = json_decode($response->getContent(), true);

            return $responseData['data'] ?? null;
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des données: ' . $e->getMessage());
            return null;
        }
    }

    public function showDashboard($chatId)
    {
        $data = $this->getDashboardData();

        if (!$data) {
            return $this->messageService->sendMessage(
                $chatId,
                "❌ Impossible de récupérer les données du tableau de bord"
            );
        }

        $keyboard = DashboardKeyboard::createDashboard([
            ['text' => '👨‍🌾 Maraichers : ' . $data['client'], 'callback_data' => 'maraicher'],
            ['text' => '🏭 Installations : ' . $data['installation'], 'callback_data' => 'installation'],
            ['text' => '🔧 Maintenance : ' . $data['maintenance'], 'callback_data' => 'intervention'],
            ['text' => '💸 Soldes : ' . $data['soldtotal'] . " CFA", 'callback_data' => 'enregistrer_paiement']
        ], 2);

        $text = "📋 <b>Tableau de bord</b>\n\n" .
            "📊 <i>Vue d'ensemble de votre activité</i>\n\n" .
            "Consultez vos données en temps réel et gérez vos activités depuis cette interface centrale.\n" .
            "Sélectionnez une section pour accéder aux détails :";

        $chartData = $data['interventioncount'];
        $chartData2 = $data['installationcount'];
        $chartData3 = ['👨‍🌾 Maraichers' => $data['client'] ?? 0, '🏭 Installations' => $data['installation'] ?? 0, '🔧 Maintenance' => $data['maintenance'] ?? 0];

        $this->messageService->sendMessageWithKeyboard($chatId, $text, $keyboard, 'HTML');
        $this->sendBarChart($chatId, $chartData3, '#0000FF', 'Statistique', type: 'pie');
        $this->sendBarChart($chatId, $chartData2, '#FF0000', 'Statistique Installations');
        $this->sendBarChart($chatId, $chartData, '#0000FF', 'Statistique Interventions', type: 'bar');
    }

    public function sendBarChart($chatId, $chartData = null, $color = null, $title = null, $type = 'line')
    {
        try {
            $chartUrl = $this->chartService->generateChartUrl($chartData, $color, $title, type: $type);

            $inputFile = \Telegram\Bot\FileUpload\InputFile::create($chartUrl, 'chart.png');

            return $this->messageService->sendPhoto(
                $chatId,
                $inputFile,
            );

        } catch (\Exception $e) {
            Log::error('Erreur génération graphique vertical: ' . $e->getMessage());
            return $this->messageService->sendMessage(
                $chatId,
                "❌ Impossible de générer le graphique"
            );
        }
    }

}
