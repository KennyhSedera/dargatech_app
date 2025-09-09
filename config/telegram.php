<?php

use App\Telegram\Commands\CancelCommand;
use App\Telegram\Commands\InstallationCommand;
use App\Telegram\Commands\InterventionCommand;
use App\Telegram\Commands\MaraicherCommand;
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
        InterventionCommand::class,
        CancelCommand::class,
    ],

    'command_groups' => [

    ],

    'shared_commands' => [
    ],

    'bot_username' => env('TELEGRAM_BOT_USERNAME', 'dargatech_bot'),
    'bot_token' => env('TELEGRAM_BOT_TOKEN'),
    'webhook_url' => env('TELEGRAM_WEBHOOK_URL'),

    'token_expiry_minutes' => env('TELEGRAM_TOKEN_EXPIRY', 60),

    'allowed_actions' => [
        'create_installation',
        'create_client',
        'view_data'
    ]
];
