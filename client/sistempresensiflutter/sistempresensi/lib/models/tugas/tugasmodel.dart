import 'dart:convert';

class TugasModel {
  var idtugas, keterangan, lokasi, latitude, longitude, flag_aktif;
  TugasModel(
      {this.idtugas,
      this.keterangan,
      this.lokasi,
      this.latitude,
      this.longitude,
      this.flag_aktif});

  factory TugasModel.fromJson(Map<String, dynamic> map) {
    return TugasModel(
        idtugas: map['idtugas'],
        keterangan: map['keterangan'],
        lokasi: map['lokasi'],
        latitude: map['latitude'],
        longitude: map['longitude'],
        flag_aktif: map['flag_aktif']);
  }

  @override
  String toString() {
    return 'TugasModel{idtugas: $idtugas, keterangan: $keterangan, lokasi: $lokasi, latitude: $latitude, longitude: $longitude, flag_aktif: $flag_aktif}';
  }
}

List<TugasModel> tugasFromJson(String dataTugas) {
  final data = json.decode(dataTugas);
  return List<TugasModel>.from(
      data["data"].map((item) => TugasModel.fromJson(item)));
}
