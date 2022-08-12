import 'package:http/http.dart' as http;
import 'package:sistempresensi/models/tugas/tugasmodel.dart';
import 'package:sistempresensi/utils/apiservice.dart';

final String _apiService = ApiService().BaseUrl;

Future<List<TugasModel>> fetchTugas(String token) async {
  var url = Uri.parse(_apiService + 'tugaspengguna');
  var response = await http.get(url, headers: {
    'content-type': 'application/json',
    // ++ fyi : sending token with BEARER
    'Authorization': 'Bearer ' + token
  });
  print(response.body + response.statusCode.toString());
  if (response.statusCode == 200) {
    return tugasFromJson(response.body);
  } else {
    return Future.error(
        response.body, StackTrace.fromString(response.statusCode.toString()));
  }
}