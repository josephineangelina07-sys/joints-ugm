# SENJA — Ruang Aman Kesehatan Mental

**SENJA** adalah aplikasi web sederhana untuk mengenali kondisi mental,
memantau suasana hati, dan merawat diri pelan-pelan — tanpa stigma, tanpa
dihakimi. Dibangun dengan **HTML, CSS, dan JavaScript murni** (tanpa framework
atau build tool), serta bersifat **offline-first**: semua data pengguna
disimpan di `localStorage` perangkat, tidak dikirim ke server mana pun.

## Fitur

- **Beranda** (`index.html`) — sapaan, kutipan, kartu status emosi, pemilih
  mood cepat, dan kartu edukasi kesehatan mental.
- **Skrining** (`skrining.html`) — kuesioner 10 pertanyaan. Setelah selesai,
  skor dan tingkat (Rendah / Sedang / Tinggi) ditampilkan langsung di halaman
  dan disimpan ke riwayat lokal. Bukan diagnosis.
- **Mood harian** (`mood.html`) — catat mood, faktor pemicu, dan catatan
  singkat. Tersimpan ke `localStorage` dan muncul di daftar "Catatan terakhir".
- **Tren** (`tren.html`) — grafik garis mood 14 hari terakhir dan batang
  rata-rata per hari, dihitung dari data mood asli (memakai data contoh bila
  belum ada catatan).

## Struktur Proyek

```
joints-ugm/
├── index.html          # Beranda
├── skrining.html       # Halaman skrining
├── mood.html           # Halaman mood harian
├── tren.html           # Halaman tren
├── css/
│   ├── theme.css       # Tema, layout & komponen bersama
│   ├── home.css        # Gaya khusus beranda
│   ├── skrining.css    # Gaya khusus skrining
│   ├── mood.css        # Gaya khusus mood harian
│   └── tren.css        # Gaya khusus tren
└── js/
    ├── store.js        # Penyimpanan lokal (mood & skrining)
    ├── app.js          # Perilaku bersama (navigasi aktif, helper select)
    ├── skrining.js     # Alur kuesioner skrining
    ├── mood.js         # Logika simpan & tampil mood
    └── tren.js         # Render grafik tren
```

## Menjalankan

Karena ini situs statis, cukup buka lewat server statis apa pun. Contoh:

```bash
# Python
python3 -m http.server 8000

# atau Node
npx serve .
```

Lalu buka `http://localhost:8000` di browser.

> Catatan: membuka file lewat `file://` juga bisa, tapi memakai server lokal
> lebih dianjurkan agar semua path relatif (`css/`, `js/`) termuat konsisten.

## Privasi

Seluruh data (mood, catatan, hasil skrining) disimpan **hanya di perangkatmu**
melalui `localStorage` browser. Tidak ada pelacak pihak ketiga dan tidak ada
pengiriman data ke server.
