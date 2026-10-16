# 🌙 SENJA — Ruang Aman Kesehatan Mental

**SENJA** adalah aplikasi web untuk mengenali kondisi mental, memantau suasana
hati, dan merawat diri pelan-pelan — tanpa stigma, tanpa dihakimi.

Dibangun dengan **HTML, CSS, dan JavaScript murni** (tanpa framework atau build
tool) dan bersifat **offline-first**: seluruh data pengguna disimpan di
`localStorage` perangkat, tidak pernah dikirim ke server mana pun.

> _"Setiap perasaan layak diberi ruang untuk mereda."_

---

## ✨ Fitur

### 🏠 Beranda (`index.html`)
- Sapaan, kutipan, dan kartu status emosi.
- Pemilih mood cepat.
- **Latihan napas 4-4-4 terpandu** — klik "Mulai 1 Menit", lingkaran membesar
  saat *Tarik napas*, menahan saat *Tahan*, dan mengecil saat *Hembuskan*,
  lengkap dengan hitung mundur selama 60 detik.
- Kartu edukasi kesehatan mental.

### 📋 Skrining (`skrining.html`)
- Kuesioner **10 pertanyaan**, satu per satu dengan progress bar.
- Tombol *Lanjut* nonaktif sampai pertanyaan dijawab; bisa *Kembali*.
- Hasil (skor + tingkat **Rendah / Sedang / Tinggi**) tampil **langsung di
  halaman** — bukan pop-up — beserta penjelasan singkat.
- Hasil disimpan ke riwayat lokal. **Bukan diagnosis.**

### 🙂 Mood harian (`mood.html`)
- Catat mood, faktor pemicu, dan catatan singkat.
- **Satu hari = satu catatan.** Menyimpan lagi di hari yang sama akan
  **memperbarui** catatan hari itu (tombol berubah menjadi *Perbarui*), bukan
  membuat entri baru.
- Saat dibuka kembali di hari yang sama, form otomatis menampilkan isian
  terakhir.
- Daftar "Catatan terakhir" diperbarui secara dinamis.

### 📊 Tren (`tren.html`)
- Grafik garis mood **14 hari terakhir** (titik sejajar rapi dengan label hari).
- Grafik batang **rata-rata per hari** dalam seminggu.
- **Insight pola** dihitung dari data asli (mis. hari dengan mood paling berat).
- **Empty state** ramah untuk pengguna baru: jika belum ada catatan, menampilkan
  ajakan mengisi mood alih-alih grafik kosong/palsu.

### 📱 Navigasi responsif
- Di layar lebar: sidebar menu di sisi kiri.
- Di layar kecil (≤ 860px): berubah menjadi **menu hamburger** yang meluncur
  dari kiri, dengan lapisan gelap. Tutup via overlay, tombol *Escape*, atau
  memilih salah satu menu.

---

## 📁 Struktur Proyek

```
joints-ugm/
├── index.html          # Beranda
├── skrining.html       # Halaman skrining
├── mood.html           # Halaman mood harian
├── tren.html           # Halaman tren
├── css/
│   ├── theme.css       # Tema, layout, komponen bersama & navigasi responsif
│   ├── home.css        # Gaya beranda (termasuk animasi napas)
│   ├── skrining.css    # Gaya skrining & tampilan hasil
│   ├── mood.css        # Gaya mood harian
│   └── tren.css        # Gaya tren, grafik & empty state
├── js/
│   ├── store.js        # Penyimpanan lokal: mood & skrining (localStorage)
│   ├── app.js          # Perilaku bersama: nav aktif, helper, menu hamburger
│   ├── home.js         # Beranda: mood picker & latihan napas
│   ├── skrining.js     # Alur kuesioner & hasil skrining
│   ├── mood.js         # Simpan/perbarui mood & tampilkan catatan terakhir
│   └── tren.js         # Render grafik garis, batang & insight
└── README.md
```

### Catatan arsitektur
- `js/store.js` adalah **satu-satunya sumber data**. Semua halaman membaca &
  menulis lewat `window.SENJA_STORE`, sehingga data selalu konsisten.
- `store.js` menjaga aturan **satu catatan per hari**: duplikat pada hari yang
  sama otomatis digabung menjadi satu (catatan terakhir yang diambil).
- Urutan muat skrip tiap halaman: `store.js` → `app.js` → skrip halaman.

---

## 🚀 Menjalankan

Ini situs statis, jadi cukup disajikan lewat server statis apa pun:

```bash
# Python
python3 -m http.server 8000

# atau Node
npx serve .
```

Lalu buka `http://localhost:8000` di browser.

> **Tips:** gunakan ekstensi *Live Server* di VS Code untuk pengembangan.
> Membuka file lewat `file://` juga bisa, tapi server lokal lebih dianjurkan
> agar semua path relatif (`css/`, `js/`) termuat konsisten.

---

## 🔐 Privasi

Seluruh data — mood, catatan, dan hasil skrining — disimpan **hanya di
perangkatmu** melalui `localStorage` browser. Tidak ada pelacak pihak ketiga
dan tidak ada pengiriman data ke server.

**Menghapus/mereset data:** buka DevTools (F12) → tab **Application** →
**Local Storage** → hapus kunci `senja.moods` dan `senja.screenings`.

---

## ⚠️ Disclaimer

SENJA adalah alat bantu refleksi diri, **bukan alat diagnosis medis**. Hasil
skrining tidak menggantikan konsultasi dengan tenaga profesional. Jika kamu
merasa sangat tertekan atau membutuhkan bantuan, pertimbangkan untuk menghubungi
tenaga kesehatan mental atau layanan dukungan terdekat.
