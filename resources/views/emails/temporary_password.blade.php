<!DOCTYPE html>
<html>
<head>
    <title>Password Sementara ApoTrack</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { width: 80%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        .password-box { font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; border: 1px dashed #1D70F5; color: #1D70F5; }
        .warning { color: #d9534f; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Halo!</h2>
        <p>Kami menerima permintaan reset password untuk akun Anda di <strong>ApoTrack</strong>.</p>
        <p>Permintaan reset password berhasil. Password sementara Anda adalah:</p>
        
        <div class="password-box">{{ $temporaryPassword }}</div>
        
        <p class="warning">Silakan login menggunakan password di atas dan SEGERA ubah password Anda melalui menu Profil demi keamanan akun Anda.</p>
        
        <p>Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
        
        <p>Terima kasih,<br>Team ApoTrack</p>
    </div>
</body>
</html>
