# 🔒 Security Architecture (DearDay)

Dalam pengembangan aplikasi Frontend statis (HTML/JS/CSS), keamanan data murni bergantung pada sistem Backend (seperti Supabase) yang akan diintegrasikan di fase berikutnya. Berikut adalah cetak biru keamanannya:

### 1. Row Level Security (RLS) di Database
Validasi tidak boleh hanya dilakukan di JavaScript (Frontend). Di Supabase, kita menerapkan RLS:
- **CREATE Policy:** Hanya `auth.uid()` yang *login* yang dapat membuat (INSERT) data di tabel `moments`.
- **READ Policy:** Momen dengan kolom `visibility = 'private'` HANYA bisa dibaca jika `user_id == auth.uid()`. Momen `friends` hanya bisa di-SELECT oleh `user_id` yang terdaftar pada tabel `friendships` yang statusnya `accepted`.

### 2. Autentikasi & JWT (JSON Web Tokens)
- Password pengguna tidak akan pernah disimpan sebagai *plain text*. Supabase Auth akan mem-hash *password* (menggunakan bcrypt/argon2).
- API eksternal harus dipanggil dengan menyertakan *header* `Authorization: Bearer <JWT_TOKEN>`.

### 3. Keamanan File Storage (Foto Moment)
- *Bucket Storage* di Supabase hanya mengizinkan ekstensi gambar (`.jpg, .png, .jpeg`).
- Batasan ukuran file (Max 5MB) diterapkan di tingkat *server*, bukan hanya peringatan di HTML.
- Nama file yang diunggah akan diacak (UUID) untuk mencegah *Directory Traversal Attack*.

### 4. Pencegahan XSS (Cross-Site Scripting)
Pada versi React/Next.js nantinya, input pengguna pada `caption` akan otomatis dibersihkan (sanitized). Pada Vanilla JS, kita harus memastikan input tidak disuntikkan langsung melalui `innerHTML` jika datanya berasal dari pengguna lain, melainkan menggunakan `textContent`.