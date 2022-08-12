# Sistem Presensi Berbasis Pengenalan Wajah dengan Flutter

## Installasi
- `Clone project` ini
- pastikan flutter anda versi 2.8.1 apabila kurang atau lebih dari versi tersebut mungkin harus ada beberapa penyesuaian terkait library dan coding
- ketik ```flutter pub get``` setelah project ini dibuka

## Tools
- Visual Studio Code

## Api
- ExpressJs

## Deskripsi
ini merupakan project tugas akhir S1 Universitas Dr. Soetomo.

pada project ini terdapat beberapa fitur seperti :

- Splash Screen
- Login
- Dashboard
  - Tugas
    - Daftar Tugas
      - Presensi Tugas Masuk
      - Presensi Tugas Keluar
  - Laporan Presensi
  - Keluar
  
pada aplikasi ini terdapat beberapa rule atau aturan dalam penggunaannya. sebagai berikut:
- Akses Login Terbatas
  > aplikasi ini mengunci ID Device setiap HP dan setiap Username. fungsinya adalah mengunci 1 HP agar tidak bisa digunakan oleh orang lain.
- Geolokasi
  > Sistem akan mencatat lokasi pegawai pada saat melakukan presensi
- Data Wajah / Deskriptor
  > Data wajah pengguna disimpan didalam aplikasi ini sehingga ketika aplikasi di uninstall atau penyimpanan dibersihkan, pengguna harus registrasi wajah lagi.

Sumber untuk pengenalan wajah ini diambil dari : https://github.com/MCarlomagno/FaceRecognitionAuth

jika ada pertanyaan hubungi msadev@gmail.com
