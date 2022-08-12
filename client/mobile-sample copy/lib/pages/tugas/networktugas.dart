import 'package:face_net_authentication/models/tugas/tugasmodel.dart';
import 'package:face_net_authentication/utils/apiservice.dart';
import 'package:http/http.dart' as http;

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
