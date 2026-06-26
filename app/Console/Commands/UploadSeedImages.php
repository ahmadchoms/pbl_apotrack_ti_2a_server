<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class UploadSeedImages extends Command
{
    protected $signature   = 'images:upload {--force : Overwrite existing files}';
    protected $description = 'Upload seed images dari public/assets ke Supabase Storage';

    public function handle(): int
    {
        $supabaseUrl = config('services.supabase.url');
        $supabaseKey = config('services.supabase.service_key');

        if (!$supabaseUrl || !$supabaseKey) {
            $this->error('SUPABASE_URL atau SUPABASE_SERVICE_KEY belum diset di .env');
            return self::FAILURE;
        }

        $folders = [
            ['local' => public_path('assets/avatar'),        'bucket' => 'apotrack-public',  'storage' => 'avatar'],
            ['local' => public_path('assets/pharmacies'),    'bucket' => 'apotrack-public',  'storage' => 'pharmacies'],
            ['local' => public_path('assets/medicines'),     'bucket' => 'apotrack-public',  'storage' => 'medicines'],
            ['local' => public_path('assets/licenses'),      'bucket' => 'apotrack-private', 'storage' => 'licenses'],
            ['local' => public_path('assets/prescriptions'), 'bucket' => 'apotrack-private', 'storage' => 'prescriptions'],
        ];

        $upsert = $this->option('force') ? 'true' : 'false';

        foreach ($folders as $cfg) {
            if (!is_dir($cfg['local'])) {
                $this->warn("Folder tidak ada: {$cfg['local']}");
                continue;
            }

            foreach (glob("{$cfg['local']}/*") as $filePath) {
                $filename    = basename($filePath);
                $storagePath = "{$cfg['storage']}/{$filename}";
                $mime        = mime_content_type($filePath);

                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$supabaseKey}",
                    'Content-Type'  => $mime,
                    'x-upsert'      => $upsert,
                ])->withBody(file_get_contents($filePath), $mime)
                  ->post("{$supabaseUrl}/storage/v1/object/{$cfg['bucket']}/{$storagePath}");

                $publicUrl = rtrim(config('services.supabase.url_public'), '/') . "/{$storagePath}";

                if ($response->successful()) {
                    $this->info("✓ {$cfg['storage']}/{$filename}");
                    $this->line("  → {$publicUrl}");
                } elseif ($response->status() === 409) {
                    $this->warn("~ sudah ada (skip): {$filename} — pakai --force untuk overwrite");
                } else {
                    $this->error("✗ gagal [{$response->status()}]: {$filename} — " . $response->body());
                }
            }
        }

        $this->newLine();
        $this->info('Selesai!');
        return self::SUCCESS;
    }
}