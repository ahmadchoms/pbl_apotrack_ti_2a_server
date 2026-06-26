<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'biteship' => [
        'key' => env('BITESHIP_API_KEY'),
        'url' => env('BITESHIP_API_URL', 'https://api.biteship.com/v1'),
        'webhook_secret' => env('BITESHIP_WEBHOOK_SECRET'),
        'webhook_bypass' => env('BITESHIP_WEBHOOK_BYPASS', true),
    ],

    'shipping' => [
        'rate_per_km'   => env('SHIPPING_RATE_PER_KM', 2500),
        'rate_per_gram' => env('SHIPPING_RATE_PER_GRAM', 50),
        'min_fee'       => env('SHIPPING_MIN_FEE', 10000),
    ],

    'supabase' => [
    'url'         => env('SUPABASE_URL'),
    'service_key' => env('SUPABASE_SERVICE_KEY'),
    'url_public'  => env('SUPABASE_URL_PUBLIC'),
    'url_private' => env('SUPABASE_URL_PRIVATE'),
    ],

];
