<?php

namespace App\Telegram\Commands;

use App\Services\ListMaraicherService;
use Telegram\Bot\Commands\Command;

class ListMaraicherCommand extends Command
{
    protected string $name = 'list_maraicher';
    protected string $description = 'Liste des Maraîchers enregistrés';

    public function handle()
    {
        $services = app(ListMaraicherService::class);
        $services->showFullList($this->update->message->chat->id);
    }
}
