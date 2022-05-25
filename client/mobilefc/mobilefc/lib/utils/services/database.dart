import 'dart:convert';
import 'dart:io';

import 'package:path_provider/path_provider.dart';

class DatabaseService {
  static final DatabaseService _cameraServiceService =
      DatabaseService._internal();

  factory DatabaseService() {
    return _cameraServiceService;
  }

  DatabaseService._internal();

  File jsonFile;

  Map<String, dynamic> _db = Map<String, dynamic>();
  Map<String, dynamic> get db => this._db;

  Future loadDB() async {
    var tempDir = await getApplicationDocumentsDirectory();
    String _embPath = tempDir.path + "/emb.json";
    jsonFile = new File(_embPath);
    if (jsonFile.existsSync()) {
      _db = json.decode(jsonFile.readAsStringSync());
    }
  }

  Future saveData(String username, String password, List modelData) async {
    String usernameAndpassword = username + ":" + password;
    _db[usernameAndpassword] = modelData;
    jsonFile.writeAsStringSync(json.encode(_db));
  }

  /// clean database
  cleanDB() {
    this._db = Map<String, dynamic>();
    jsonFile.writeAsStringSync(json.encode({}));
  }
}
