import 'package:http/http.dart' as http;
import 'package:sistempresensi/models/setting/settingmodel.dart';
import 'package:sistempresensi/utils/apiservice.dart';

final String _apiService = ApiService().BaseUrl;

Future<List<SettingModel>> fetchDataSetting(String token) async {
  var url = Uri.parse(_apiService + 'setting');
  var response = await http.get(url, headers: {
    'content-type': 'application/json',
    // ++ fyi : sending token with BEARER
    'Authorization': 'Bearer ' + token
  });
  print(response.body + response.statusCode.toString());
  if (response.statusCode == 200) {
    return settingFromJson(response.body);
  } else {
    return Future.error(
        response.body, StackTrace.fromString(response.statusCode.toString()));
  }
}
