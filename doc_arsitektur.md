
# Dokumentasi Sistem Peminjaman Barang (SIPERBAR)

Halo! Saya telah merancang sistem ini agar mudah dikelola oleh operasional tanpa perlu latar belakang IT yang mendalam. Berikut adalah penjelasannya:

## 1. Skema Database (Simpel)
Bayangkan ini seperti 2 lembar sheet di Excel:

### Tabel A: Barang (Katalog)
- **ID**: Kode unik barang (misal: B001)
- **Nama**: Judul barang (misal: Laptop Dell)
- **Kategori**: Elektronik, Kendaraan, dll.
- **Biaya**: Harga sewa (jika ada).
- **Status**: Ready (Ada) atau Borrowed (Dipinjam).

### Tabel B: Peminjaman (Transaksi)
- **ID Transaksi**: Nomor urut otomatis.
- **Nama Peminjam & NIP**: Identitas siapa yang ambil.
- **ID Barang**: Barang apa yang diambil.
- **Tanggal Pinjam & Kembali**: Durasi peminjaman.
- **Status Pinjam**: Aktif (Sedang dibawa) atau Kembali (Sudah dikembalikan).

## 2. Alur Logika (User Flow)
1. **Pilih Barang**: User membuka katalog dan mencari barang yang statusnya 'Ready'.
2. **Isi Form**: User mengisi NIP, Keperluan, dan Tanggal. User wajib centang checklist 'Tanggung Jawab'.
3. **Persetujuan (Submit)**: Begitu dikirim, status barang otomatis berubah jadi 'Borrowed' agar tidak bisa dipinjam orang lain.
4. **Monitoring Admin**: Admin melihat daftar barang yang keluar di Dashboard.
5. **Pengembalian**: Saat barang balik, Admin menekan tombol "Tandai Kembali". Status barang otomatis jadi 'Ready' lagi.

## 3. Rekomendasi Teknologi untuk Pemula
Jika ingin membangun sendiri dari nol tanpa coding yang rumit:
- **Pilihan A (Terpopuler)**: **Google Sheets + AppSheet**.
  - *Kenapa?* Kamu cukup buat tabel di Excel (Google Sheets), lalu AppSheet akan otomatis membuatkan aplikasinya. Sangat mudah untuk update data.
- **Pilihan B**: **Microsoft Lists**.
  - *Kenapa?* Cocok jika kantor menggunakan Office 365. Fiturnya sudah mirip dashboard.

## 4. Contoh Struktur CSV (Siap Pakai untuk Excel)
File yang dihasilkan aplikasi ini sudah dirancang agar langsung bisa diproses jadi **Pivot Table** di Excel untuk membuat grafik batang:

| ID | Nama_Peminjam | NIP | Barang | Mulai | Selesai | Status |
|----|---------------|-----|--------|-------|---------|--------|
| X1 | Budi | 123 | Laptop | 2023-10-01 | 2023-10-05 | Returned |
| X2 | Ani | 456 | Proyektor | 2023-10-02 | 2023-10-03 | Active |

**Tips Excel:** Blok semua data tersebut, pilih *Insert > PivotChart*, lalu tarik kolom 'Barang' ke Axis dan 'ID' ke Values. Kamu langsung punya grafik barang apa yang paling sering dipinjam!
