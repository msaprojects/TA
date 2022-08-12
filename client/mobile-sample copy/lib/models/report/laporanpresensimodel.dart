import 'dart:convert';

// idpresensi":144,"flag_presensi":2,"waktu":"10:44:13","device":"Mobile",
//"idtugas":1,"keterangan":"coba tugas untuk syahrul",
//"flag_aktif":1,"nama":"Universitas Dr. Soetomo",
//"tanggalpresensi":"18-07-2022 10:07","tanggaltugasdibuat":"13-07-2022 21:07"
class LaporanPresensiModel {
  var idpresensi,
      waktu,
      device,
      idtugas,
      flag_presensi,
      keterangantugas,
      flag_aktiftugas,
      lokasi,
      tanggalpresensi,
      tanggaltugasdibuat;
  LaporanPresensiModel(
      {this.idpresensi,
      this.waktu,
      this.device,
      this.idtugas,
      this.flag_presensi,
      this.keterangantugas,
      this.flag_aktiftugas,
      this.lokasi,
      this.tanggalpresensi,
      this.tanggaltugasdibuat});

  factory LaporanPresensiModel.fromJson(Map<String, dynamic> map) {
    return LaporanPresensiModel(
      idpresensi: map['idpresensi'],
      waktu: map['waktu'],
      device: map['device'],
      idtugas: map['ditugas'],
      flag_presensi: map['flag_presensi'],
      keterangantugas: map['keterangan'],
      flag_aktiftugas: map['flag_aktiftugas'],
      lokasi: map['nama'],
      tanggalpresensi: map['tanggalpresensi'],
      tanggaltugasdibuat: map['tanggaltugasdibuat'],
    );
  }

  @override
  String toString() {
    return 'LaporanPresensiModel{idpresensi: $idpresensi, waktu: $waktu, device: $device, lokasi: $lokasi, flag_presensi: $flag_presensi, idtugas: $idtugas, keterangantugas: $keterangantugas flag_aktiftugas: $flag_aktiftugas tanggalpresensi: $tanggalpresensi tanggaltugasdibuat: $tanggaltugasdibuat}';
  }
}

List<LaporanPresensiModel> laporanpresensiFromJson(String dataSetting) {
  final data = json.decode(dataSetting);
  return List<LaporanPresensiModel>.from(
      data["data"].map((item) => LaporanPresensiModel.fromJson(item)));
}
