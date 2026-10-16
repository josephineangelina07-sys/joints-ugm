>SENJA — Ruang Aman Kesehatan Mental

**SENJA** adalah aplikasi web untuk mengenali kondisi mental, memantau suasana
hati, dan merawat diri pelan-pelan — tanpa stigma, tanpa dihakimi.

Dibangun dengan **HTML, CSS, dan JavaScript murni** (tanpa framework atau buildtool) dan bersifat offline-first: seluruh data pengguna disimpan di `localStorage` perangkat, tidak pernah dikirim ke server mana pun.

_"Setiap perasaan layak diberi ruang untuk mereda."_

>Fitur

>Beranda (`index.html`)
- Sapaan, kutipan, dan kartu status emosi.
- Pemilih mood cepat.
- Latihan napas 4-4-4 terpandu —> klik "Mulai 1 Menit", lingkaran membesar
  saat *Tarik napas*, menahan saat *Tahan*, dan mengecil saat *Hembuskan*,
  lengkap dengan hitung mundur selama 60 detik.
- Kartu edukasi kesehatan mental.

>Skrining (`skrining.html`)
- Kuesioner 10 pertanyaan, satu per satu dengan progress bar.
- Tombol *Lanjut* nonaktif sampai pertanyaan dijawab; bisa *Kembali*.
- Hasil (skor + tingkat Rendah / Sedang / Tinggi) tampil langsung di
  halaman — bukan pop-up — beserta penjelasan singkat.
- Hasil disimpan ke riwayat lokal. **Bukan diagnosis**

>Mood harian (`mood.html`)
- Catat mood, faktor pemicu, dan catatan singkat.
- Satu hari = satu catatan. Menyimpan lagi di hari yang sama akan
  memperbarui catatan hari itu (tombol berubah menjadi *Perbarui*), bukan
  membuat entri baru.
- Saat dibuka kembali di hari yang sama, form otomatis menampilkan isian
  terakhir.
- Daftar "Catatan terakhir" diperbarui secara dinamis.

>Tren (`tren.html`)
- Grafik garis mood 14 hari terakhir (titik sejajar rapi dengan label hari).
- Grafik batang rata-rata per hari dalam seminggu.
- Insight pola dihitung dari data asli (mis. hari dengan mood paling berat).
- Empty state ramah untuk pengguna baru: jika belum ada catatan, menampilkan
  ajakan mengisi mood alih-alih grafik kosong/palsu.

>Navigasi responsif
- Di layar lebar: sidebar menu di sisi kiri.
- Di layar kecil (≤ 860px): berubah menjadi menu hamburger yang meluncur
  dari kiri, dengan lapisan gelap. Tutup via overlay, tombol *Escape*, atau
  memilih salah satu menu.