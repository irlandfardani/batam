# Dashboard WPP Jodoh–Tanjung Pinggir — versi situs statis

Dashboard FS & Masterplan WPP Jodoh–Tanjung Pinggir (BP Batam) dalam bentuk
situs web statis. **Tidak butuh login, tidak butuh server khusus** — cukup
diunggah ke hosting statis gratis mana pun (GitHub Pages, Netlify, Cloudflare
Pages) dan siapa pun bisa membukanya lewat tautan.

## Isi folder

- `index.html` — halaman utama (buka ini)
- `leaflet.js`, `leaflet.css` — pustaka peta (lokal)
- `d3.min.js` — pustaka grafik (lokal)
- `dash-shim.js` — penyedia data pengganti runtime cloud
- `data.js` — seluruh data dashboard (angka, tabel, data peta)
- `img/` — 23 gambar desain & peta eksisting (thumbnail + resolusi penuh)
- `media/` — 2 video + gambar poster-nya

Semua aset bersifat lokal; halaman tidak memanggil claude.ai sama sekali.
Satu-satunya yang diambil dari internet adalah ubin peta dasar (OpenStreetMap
dan citra satelit Google) saat basemap itu dipilih — ini gratis dan publik.
Bila tidak ada internet, basemap "Terang"/"Gelap" tetap tampil.

## Cara 1 — GitHub Pages (gratis)

1. Buat akun di https://github.com (jika belum punya) lalu buat repository
   baru, misalnya `dashboard-wpp` (boleh Public).
2. Unggah **seluruh isi folder ini** (bukan foldernya, tapi isinya:
   `index.html`, folder `img/`, `media/`, dst.) ke repository.
   - Lewat web: tombol **Add file → Upload files**, seret semua berkas,
     lalu **Commit changes**.
   - Atau lewat git:
     ```
     git init
     git add .
     git commit -m "Dashboard WPP"
     git branch -M main
     git remote add origin https://github.com/USERNAME/dashboard-wpp.git
     git push -u origin main
     ```
3. Di repository: **Settings → Pages**. Pada "Build and deployment",
   Source = **Deploy from a branch**, Branch = **main**, folder = **/(root)**,
   lalu **Save**.
4. Tunggu ±1–2 menit. Alamat situs muncul di halaman itu:
   `https://USERNAME.github.io/dashboard-wpp/`. Bagikan tautan ini ke siapa pun.

Berkas `.nojekyll` sudah disertakan agar GitHub menyajikan berkas apa adanya.

## Cara 2 — Netlify Drop (paling cepat, tanpa git)

1. Buka https://app.netlify.com/drop
2. Seret folder ini ke halaman tersebut.
3. Situs langsung terbit dengan tautan acak; bisa diganti namanya di
   Site settings. Gratis.

## Cara 3 — Cloudflare Pages

Buat project baru di https://pages.cloudflare.com, pilih "Direct Upload",
unggah isi folder ini. Gratis.

## Catatan ukuran

Total ±44 MB, sebagian besar dari dua video (±20 MB). Semua di bawah batas
GitHub (100 MB per berkas, ±1 GB per repo) sehingga aman. Bila ingin repo lebih
ringan, dua berkas di `media/` bisa dihapus dari repo dan video diletakkan di
tempat lain (mis. YouTube/Drive), lalu tautannya disesuaikan di `index.html`.

## Memperbarui data

Semua angka dan data ada di `data.js` (dan data peta di dalamnya). Untuk
mengubah angka, sunting `data.js`, unggah ulang. Tak perlu menyentuh berkas lain.
