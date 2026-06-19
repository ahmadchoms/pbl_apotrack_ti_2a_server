<?php

namespace App\Jobs;

use App\Models\Prescription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UploadPrescriptionToS3Job implements ShouldQueue
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
        public string $prescriptionId,
        public string $localFilePath
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Memulai proses upload resep ke S3 untuk Prescription ID: {$this->prescriptionId}");

        $prescription = Prescription::find($this->prescriptionId);

        if (!$prescription) {
            Log::warning("Prescription ID {$this->prescriptionId} tidak ditemukan saat menjalankan job upload.");
            $this->cleanLocalFile();
            return;
        }

        if (!Storage::disk('local')->exists($this->localFilePath)) {
            Log::error("File lokal {$this->localFilePath} tidak ditemukan untuk Prescription ID {$this->prescriptionId}.");
            $prescription->update(['status' => 'UPLOAD_FAILED', 'rejection_note' => 'File lokal hilang sebelum diunggah ke cloud.']);
            return;
        }

        try {
            $fileContents = Storage::disk('local')->get($this->localFilePath);
            $fileName = 'prescriptions/' . str_replace('temp/', '', $this->localFilePath);

            Storage::disk('s3')->put($fileName, $fileContents);
            $url = Storage::disk('s3')->url($fileName);

            $prescription->update([
                'image_url' => $url,
                'status' => 'PENDING',
            ]);

            Log::info("Berhasil mengunggah resep ke S3: {$url}");

            $this->cleanLocalFile();
        } catch (\Exception $e) {
            Log::error("Gagal mengunggah resep ke S3 untuk Prescription ID {$this->prescriptionId}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("UploadPrescriptionToS3Job gagal permanen untuk Prescription ID {$this->prescriptionId}: " . $exception->getMessage());

        $prescription = Prescription::find($this->prescriptionId);
        if ($prescription) {
            $prescription->update([
                'status' => 'UPLOAD_FAILED',
                'rejection_note' => 'Gagal mengunggah resep ke penyimpanan S3 setelah 3 kali percobaan.',
            ]);
        }

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
