<?php

namespace App\Jobs;

use App\Models\Medicine;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class UploadMedicineImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var array
     */
    public $backoff = [10, 30, 60];

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $medicineId,
        public string $localFilePath,
        public ?string $oldImageUrl = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Memulai proses upload gambar obat ke Supabase Storage untuk Medicine ID: {$this->medicineId}");

        $medicine = Medicine::find($this->medicineId);

        if (!$medicine) {
            Log::warning("Medicine ID {$this->medicineId} tidak ditemukan saat menjalankan job upload gambar.");
            $this->cleanLocalFile();
            return;
        }

        if (!Storage::disk('local')->exists($this->localFilePath)) {
            Log::error("File lokal {$this->localFilePath} tidak ditemukan untuk Medicine ID {$this->medicineId}.");
            return;
        }

        try {
            $disk = env('FILESYSTEM_DISK', 'supabase_private');

            if ($this->oldImageUrl) {
                $urlPath = parse_url($this->oldImageUrl, PHP_URL_PATH);
                $bucket = env('SUPABASE_BUCKET_PRIVATE', 'apotrack-private');
                $search = '/' . $bucket . '/';
                $pos = strpos($urlPath, $search);

                if ($pos !== false) {
                    $oldPath = substr($urlPath, $pos + strlen($search));
                } else {
                    $oldPath = ltrim($urlPath, '/');
                }

                if (Storage::disk($disk)->exists($oldPath)) {
                    Storage::disk($disk)->delete($oldPath);
                    Log::info("Berhasil menghapus gambar obat lama di Supabase: {$oldPath}");
                }
            }

            $fileContents = Storage::disk('local')->get($this->localFilePath);
            $fileName = 'medicines/' . str_replace('temp/', '', $this->localFilePath);

            Storage::disk($disk)->put($fileName, $fileContents);
            $url = Storage::disk($disk)->url($fileName);

            $medicine->update(['image_url' => $url]);

            Log::info("Berhasil mengunggah gambar obat ke Supabase Storage: {$url}");

            $this->cleanLocalFile();
        } catch (\Exception $e) {
            Log::error("Gagal mengunggah gambar obat ke Supabase untuk Medicine ID {$this->medicineId}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("UploadMedicineImageJob gagal permanen untuk Medicine ID {$this->medicineId}: " . $exception->getMessage());
        $this->cleanLocalFile();
    }

    /**
     * Hapus file lokal sementara.
     */
    protected function cleanLocalFile(): void
    {
        if (Storage::disk('local')->exists($this->localFilePath)) {
            Storage::disk('local')->delete($this->localFilePath);
        }
    }
}
