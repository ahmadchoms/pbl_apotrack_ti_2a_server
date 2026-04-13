<?php

namespace Database\Seeders;

use App\Models\Pharmacy;
use App\Models\PharmacyOperatingHour;
use Illuminate\Database\Seeder;

class PharmacyOperatingHourSeeder extends Seeder
{
    public function run(): void
    {
        $pharmacies = Pharmacy::all();

        // Jadwal per apotek: [open_time, close_time, hari tutup (null = buka semua), is_24_hours]
        $schedules = [
            // Apotek Sehat Farma: Senin-Sabtu 07:00-22:00, Minggu tutup
            [
                'open'       => '07:00',
                'close'      => '22:00',
                'closed_day' => 0, // Minggu
                'is_24h'     => false,
            ],
            // Apotek Kimia Sehat: 24 jam setiap hari
            [
                'open'       => '00:00',
                'close'      => '23:59',
                'closed_day' => null,
                'is_24h'     => true,
            ],
            // Apotek Bunda Medika: Senin-Jumat 08:00-21:00, Sabtu 08:00-17:00, Minggu tutup
            [
                'open'       => '08:00',
                'close'      => '21:00',
                'closed_day' => 0, // Minggu
                'is_24h'     => false,
                'saturday'   => ['08:00', '17:00'],
            ],
        ];

        foreach ($pharmacies as $index => $pharmacy) {
            $schedule = $schedules[$index];

            for ($day = 0; $day <= 6; $day++) {
                $isClosed  = ($schedule['closed_day'] !== null && $day === $schedule['closed_day']);
                $is24Hours = $schedule['is_24h'];

                // Jam khusus Sabtu untuk Apotek Bunda Medika
                $openTime  = $schedule['open'];
                $closeTime = $schedule['close'];
                if (isset($schedule['saturday']) && $day === 6) {
                    $openTime  = $schedule['saturday'][0];
                    $closeTime = $schedule['saturday'][1];
                }

                PharmacyOperatingHour::create([
                    'pharmacy_id' => $pharmacy->id,
                    'day_of_week' => $day,
                    'open_time'   => $openTime,
                    'close_time'  => $closeTime,
                    'is_closed'   => $isClosed,
                    'is_24_hours' => $is24Hours,
                ]);
            }
        }
    }
}
