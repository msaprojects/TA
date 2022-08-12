import 'package:face_net_authentication/models/report/laporanpresensimodel.dart';
import 'package:face_net_authentication/utils/apiservice.dart';
import 'package:http/http.dart' as http;

final String _apiService = ApiService().BaseUrl;

Future<List<LaporanPresensiModel>> fetchLaporanPresensi(
    String token, String filter) async {
  var url = Uri.parse(_apiService + 'presensipengguna?filter=' + filter);
  var response = await http.get(url, headers: {
    'content-type': 'application/json',
    // ++ fyi : sending token with BEARER
    'Authorization': 'Bearer ' + token
  });
  print(response.body + response.statusCode.toString());
  if (response.statusCode == 200) {
    return laporanpresensiFromJson(response.body);
  } else {
    return Future.error(
        response.body, StackTrace.fromString(response.statusCode.toString()));
  }
}
