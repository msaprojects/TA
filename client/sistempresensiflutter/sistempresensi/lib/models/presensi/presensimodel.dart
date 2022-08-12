import 'dart:convert';

class PresensiModel {
  var latitude, longitude, device, idtugas, idpengguna;
  PresensiModel(
      {this.latitude,
      this.longitude,
      this.device,
      this.idtugas,
      this.idpengguna});

  Map<String, dynamic> toJson() {
    return {
      "latitude": latitude,
      "longitude": longitude,
      "device": device,
      "idtugas": idtugas,
      "idpengguna": idpengguna
    };
  }

  @override
  String toString() {
    return 'PresensiModel{latitude: $latitude, longitude: $longitude, device: $device, idtugas: $idtugas, idpengguna: $idpengguna}';
  }
}

String presensiToJson(PresensiModel data) {
  final jsonData = data.toJson();
  return json.encode(jsonData);
}
