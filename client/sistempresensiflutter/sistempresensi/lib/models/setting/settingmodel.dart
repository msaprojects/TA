import 'dart:convert';

class SettingModel {
  var jam_masuk, jam_keluar, flag_aktif;
  SettingModel({this.jam_masuk, this.jam_keluar, this.flag_aktif});

  factory SettingModel.fromJson(Map<String, dynamic> map) {
    return SettingModel(
        jam_masuk: map['jam_masuk'],
        jam_keluar: map['jam_keluar'],
        flag_aktif: map['flag_aktif']);
  }

  @override
  String toString() {
    return 'SettingModel{jam_masuk: $jam_masuk, jam_keluar: $jam_keluar, flag_aktif: $flag_aktif}';
  }
}

List<SettingModel> settingFromJson(String dataSetting) {
  final data = json.decode(dataSetting);
  return List<SettingModel>.from(
      data["data"].map((item) => SettingModel.fromJson(item)));
}
