import 'dart:convert';

class RegistrasiWajahModel {
  var password, rekam_wajah;
  RegistrasiWajahModel({this.password, this.rekam_wajah});

  Map<String, dynamic> toJson() {
    return {"password": password, "rekam_wajah": rekam_wajah};
  }

  @override
  String toString() {
    return 'RegistrasiWajahModel{password: $password, rekam_wajah: $rekam_wajah}';
  }
}

String registrasiWajahFromJson(RegistrasiWajahModel data) {
  final jsonData = data.toJson();
  return json.encode(jsonData);
}
