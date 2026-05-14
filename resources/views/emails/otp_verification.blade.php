<!DOCTYPE html>
<html>
<head>
    <title>Verifikasi OTP ApoTrack</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { width: 80%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        .header { font-size: 20px; font-weight: bold; color: #1D70F5; margin-bottom: 20px; }
        .otp-box { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1D70F5; background: #F4F8FF; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .footer { font-size: 12px; color: #777; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Halo! 👋</div>
        <p>Terima kasih telah mendaftar di <strong>ApoTrack</strong>. Untuk melanjutkan proses registrasi, silakan masukkan kode verifikasi OTP berikut:</p>
        
        <div class="otp-box">{{ $otp }}</div>
        
        <p>Kode ini berlaku selama <strong>5 menit</strong>. Jangan bagikan kode ini kepada siapa pun.</p>
        
        <p>Jika Anda tidak merasa melakukan pendaftaran ini, abaikan saja email ini.</p>
        
        <div class="footer">
            &copy; {{ date('Y') }} ApoTrack Team. All rights reserved.
        </div>
    </div>
</body>
</html>
