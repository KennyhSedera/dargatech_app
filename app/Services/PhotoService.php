<?php

namespace App\Services;

use Log;
use Telegram\Bot\Api;

class PhotoService
{
    protected SendMessageService $sendMessage;
    protected Api $telegram;

    public function __construct(SendMessageService $sendMessage, Api $telegram)
    {
        $this->sendMessage = $sendMessage;
        $this->telegram = $telegram;
    }
    public function upload($message, $chatId)
    {
        $photos = $this->normalizePhotos($message->photo);

        if (count($photos) === 0) {
            $this->sendMessage->sendMessage($chatId, "❌ Photo introuvable, veuillez renvoyer une image.");
            return;
        }

        $lastPhoto = $photos[count($photos) - 1];
        $fileId = is_array($lastPhoto) ? ($lastPhoto['file_id'] ?? null) : ($lastPhoto->file_id ?? null);

        if (!$fileId) {
            $this->sendMessage->sendMessage($chatId, "❌ Impossible de lire la photo. Veuillez renvoyer une image valide.");
            return;
        }

        $saved = $this->downloadTelegramFile($fileId);
        if (!$saved[0]) {
            $this->sendMessage->sendMessage($chatId, "❌ Erreur lors du téléchargement de la photo. Veuillez réessayer.");
            return;
        }

        return [$saved[0], $saved[1]];
    }


    private function normalizePhotos($photos)
    {
        if (!is_array($photos)) {
            if ($photos instanceof \Traversable) {
                return iterator_to_array($photos);
            } else {
                return json_decode(json_encode($photos), true);
            }
        }
        return $photos;
    }

    public function downloadTelegramFile(string $fileId): ?array
    {
        try {
            $file = $this->telegram->getFile(['file_id' => $fileId]);
            $filePath = $file->getFilePath();
            $url = "https://api.telegram.org/file/bot" . env('TELEGRAM_BOT_TOKEN') . "/" . $filePath;

            $content = file_get_contents($url);
            if ($content === false) {
                Log::error("Erreur téléchargement fichier Telegram pour file_id {$fileId}");
                return null;
            }

            $saveDir = storage_path('app/public/installation');
            if (!file_exists($saveDir)) {
                mkdir($saveDir, 0755, true);
            }

            $fileName = time() . '_' . uniqid() . '.jpg';
            $fullPath = $saveDir . DIRECTORY_SEPARATOR . $fileName;

            file_put_contents($fullPath, $content);

            return [$fullPath, $fileName];
        } catch (\Exception $e) {
            Log::error("Exception téléchargement fichier Telegram: " . $e->getMessage());
            return null;
        }
    }
}
