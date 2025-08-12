<?php

use App\Telegram\Commands\InstallationCommand;
use App\Telegram\Commands\ListMaraicherCommand;
use App\Telegram\Commands\MaraicherCommand;
use App\Telegram\Commands\NewMaraicherCommand;
use App\Telegram\Commands\StartCommand;
use Telegram\Bot\Commands\HelpCommand;

return [

    'bots' => [
        'mybot' => [
            'token' => env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN'),
            'certificate_path' => env('TELEGRAM_CERTIFICATE_PATH', 'YOUR-CERTIFICATE-PATH'),
            'webhook_url' => env('TELEGRAM_WEBHOOK_URL', 'YOUR-BOT-WEBHOOK-URL'),
            'allowed_updates' => null,
        ],
    ],

    'default' => 'mybot',

    'async_requests' => env('TELEGRAM_ASYNC_REQUESTS', false),

    'http_client_handler' => null,

    'base_bot_url' => null,

    'resolve_command_dependencies' => true,

    'commands' => [
        HelpCommand::class,
        StartCommand::class,
        MaraicherCommand::class,
        InstallationCommand::class,
        // ListMaraicherCommand::class,
    ],

    'command_groups' => [

    ],

    'shared_commands' => [
    ],
];
