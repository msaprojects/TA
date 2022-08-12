import 'dart:convert';

class LoginResult {
  var access_token, nama, jabatan, rekam_wajah, idpengguna;

  LoginResult(
      {this.access_token,
      this.nama,
      this.jabatan,
      this.rekam_wajah,
      this.idpengguna});
  factory LoginResult.fromJson(Map<dynamic, dynamic> map) {
    return LoginResult(
      access_token: map["access_token"],
      nama: map["nama"],
      jabatan: map["jabatan"],
      rekam_wajah: map["rekam_wajah"],
      idpengguna: map["idpengguna"],
    );
  }

  @override
  String toString() {
    return 'LoginResult{access_token: $access_token, nama: $nama, jabatan: $jabatan, rekam_wajah: $rekam_wajah, idpengguna: $idpengguna}';
  }
}

List<LoginResult> resultloginFromJson(String dataJson) {
  final data = json.decode(dataJson);
  return List<LoginResult>.from(
      data["data"].map((item) => LoginResult.fromJson(item)));
}
