<?php

namespace App\Http\Controllers\Api;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="ApoTrack API",
 *     version="1.0.0",
 *     description="Dokumentasi API resmi untuk platform ApoTrack — sistem manajemen apotek digital. API ini digunakan oleh aplikasi mobile Flutter untuk Customer dan Staff Apotek.",
 *     @OA\Contact(
 *         email="dev@apotrack.id",
 *         name="Tim Pengembang ApoTrack"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Server Aktif (Local Development)"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Masukkan token Sanctum Anda di sini. Token didapatkan dari endpoint POST /api/auth/login. Format: Bearer {token}"
 * )
 *
 * @OA\Tag(name="Auth", description="Registrasi, Login, OTP, dan manajemen profil pengguna")
 * @OA\Tag(name="Reviews (Public)", description="Ulasan produk obat — dapat diakses publik tanpa login")
 * @OA\Tag(name="Reviews (Customer)", description="Endpoint Customer untuk mengirim ulasan setelah transaksi COMPLETED")
 * @OA\Tag(name="Cart", description="Manajemen keranjang belanja Customer")
 * @OA\Tag(name="Orders (Customer)", description="Pembuatan & pelacakan pesanan oleh Customer")
 * @OA\Tag(name="Orders (Staff)", description="Pengelolaan & verifikasi pesanan oleh staf apotek")
 * @OA\Tag(name="Medicines (Staff)", description="Manajemen inventaris obat oleh staf apotek")
 * @OA\Tag(name="POS", description="Transaksi Point-of-Sale kasir apotek")
 * @OA\Tag(name="Notifications", description="Notifikasi real-time untuk User dan Staff")
 * @OA\Tag(name="Address", description="Manajemen alamat pengiriman Customer")
 * @OA\Tag(name="Pharmacies", description="Informasi apotek dan katalog obat publik")
 */
class SwaggerInfo {}
