import 'dart:convert';

import 'package:face_net_authentication/models/login/loginmodel.dart';
import 'package:face_net_authentication/models/login/loginresult.dart';
import 'package:face_net_authentication/models/pengguna/registrasiwajah.dart';
import 'package:face_net_authentication/models/presensi/presensimodel.dart';
import 'package:face_net_authentication/models/statuscode/statuscode.dart';
import 'package:http/http.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  /// parent server
  // final String BaseUrl = "http://factory.grand-elephant.co.id:9994/api/v1/";

  /// for development
  final String BaseUrl = "http://192.168.166.163:9995/api/v1/";

  Client client = Client();
  ResponseCode responseCode = ResponseCode();

  /**
   * ! LOGIN
   * * note : login vaidation with api
   * TODO: responstatus api must be set for show to error/message dialog.
  */
  Future<bool> LoginApp(LoginModel data) async {
    var url = Uri.parse(BaseUrl + 'login');
    var response = await client.post(url,
        headers: {'content-type': 'application/json'}, body: loginToJson(data));
    // ++ fyi : this code below for getting response and message from api response.
    Map responsemessage = jsonDecode(response.body);
    responseCode = ResponseCode.fromJson(responsemessage);
    if (response.statusCode == 200) {
      // ++ fyi : this code below for getting login result if success.
      Map resultLogin = jsonDecode(response.body);
      var loginresult = LoginResult.fromJson(resultLogin);
      // ++ fyi : for set shared preferences from LoginResult model, this shared preferences fot save access token credentials for request to api.
      SharedPreferences sp = await SharedPreferences.getInstance();
      sp.setString('access_token', "${loginresult.access_token}");
      sp.setString('nama', "${loginresult.nama}");
      sp.setString('jabatan', "${loginresult.jabatan}");
      sp.setString('rekam_wajah', "${loginresult.rekam_wajah}");
      sp.setString('idpengguna', "${loginresult.idpengguna}");
      return true;
    } else {
      return false;
    }
  }

  /**
   * ! REGISTRASI WAJAH / UPDATE FLAG REGISTRASI
   * * note : update flag registrasi wajah
  */
  Future<bool> RegistrasiWajah(String token, RegistrasiWajahModel data) async {
    var url = Uri.parse(BaseUrl + 'updaterekamwajah');
    var response = await client.post(url,
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ${token}'
        },
        body: registrasiWajahFromJson(data));
    print(response.body + '| ' + response.statusCode.toString());
    // ++ fyi : this code below for getting response and message from api response.
    Map responsemessage = jsonDecode(response.body);
    responseCode = ResponseCode.fromJson(responsemessage);
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * ! REGISTRASI WAJAH / UPDATE FLAG REGISTRASI
   * * note : update flag registrasi wajah
  */
  Future<bool> Presensi(String token, PresensiModel data) async {
    var url = Uri.parse(BaseUrl + 'presensi');
    var response = await client.post(url,
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ${token}'
        },
        body: presensiToJson(data));
    print(token +
        data.toString() +
        response.body +
        '| ' +
        response.statusCode.toString());
    // ++ fyi : this code below for getting response and message from api response.
    Map responsemessage = jsonDecode(response.body);
    responseCode = ResponseCode.fromJson(responsemessage);
    if (response.statusCode == 201) {
      return true;
    } else {
      return false;
    }
  }
}
