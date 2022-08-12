import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sistempresensi/models/setting/settingmodel.dart';
import 'package:sistempresensi/pages/widgets/ReusableClasses.dart';

import 'networksetting.dart';

class SettingChild extends StatefulWidget {
  SettingChild({Key key}) : super(key: key);

  @override
  State<SettingChild> createState() => _SettingChildState();
}

class _SettingChildState extends State<SettingChild> {
  SharedPreferences sp;
  String token = "";

  /// for set value listview to this variable
  TextEditingController _textSearch = TextEditingController(text: "");

  bool _isLoading = true;
  List setting;
  List<SettingModel> _settingModel = <SettingModel>[];

  // * ceking token and getting dashboard value from Shared Preferences
  cekToken() async {
    sp = await SharedPreferences.getInstance();
    setState(() {
      token = sp.getString("access_token");
    });
    fetchDataSetting(token).then((value) {
      setState(() {
        _isLoading = false;
        _settingModel.addAll(value);
      });
    }).onError((error, stackTrace) {
      if (error == 204) {
        ReusableClasses().modalbottomWarning(context, 'Warning!',
            "Data masih kosong", error.toString(), 'assets/images/sorry.png');
      } else {
        ReusableClasses().modalbottomWarning(context, 'Warning!',
            error.toString(), stackTrace.toString(), 'assets/images/sorry.png');
      }
    });
  }

  @override
  initState() {
    cekToken();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: Colors.green.withOpacity(0.2),
      child: Padding(
        padding: EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              children: [
                Text('Jam Masuk : ',
                    style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.green[900])),
                Text(_settingModel[0].jam_masuk.toString(),
                    style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.green[900]))
              ],
            ),
            SizedBox(
              height: 5,
            ),
            Row(
              children: [
                Text('Jam Berakhir : ',
                    style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.green[900])),
                Text(_settingModel[0].jam_keluar.toString(),
                    style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.green[900]))
              ],
            ),
            SizedBox(
              height: 5,
            ),
          ],
        ),
      ),
    );
  }
}
