import 'dart:convert';

class LoginModel {
  var username, password, device, uuid;
  LoginModel({this.username, this.password, this.device, this.uuid});

  Map<String, dynamic> toJson() {
    return {
      "username": username,
      "password": password,
      "device": device,
      "uuid": uuid
    };
  }

  @override
  String toString() {
    return 'LoginModel{username: $username, password: $password, device: $device, uuid: $uuid';
  }
}

String loginToJson(LoginModel data) {
  final jsonData = data.toJson();
  return json.encode(jsonData);
}
