import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sistempresensi/models/report/laporanpresensimodel.dart';
import 'package:sistempresensi/pages/widgets/ReusableClasses.dart';
import 'package:sistempresensi/utils/warna.dart';

import 'laporanpresensitile.dart';
import 'networklaporanpresensi.dart';

class LaporanPresensiPage extends StatefulWidget {
  LaporanPresensiPage({Key key}) : super(key: key);

  @override
  State<LaporanPresensiPage> createState() => _LaporanPresensiPageState();
}

class _LaporanPresensiPageState extends State<LaporanPresensiPage> {
  SharedPreferences sp;
  String token = "";
  List<LaporanPresensiModel> _laporanPresensi = <LaporanPresensiModel>[];
  var valuepresensi;

  /// for set value listview to this variable
  TextEditingController _textSearch = TextEditingController(text: "");

  bool _isLoading = true;

  // * ceking token and getting dashboard value from Shared Preferences
  cekToken(String filter) async {
    sp = await SharedPreferences.getInstance();
    setState(() {
      token = sp.getString("access_token");
    });
    fetchLaporanPresensi(token, filter).then((value) {
      setState(() {
        valuepresensi = value;
        _isLoading = false;
        _laporanPresensi.addAll(valuepresensi);
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
    super.initState();
    cekToken('semua');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Laporan Presensi'),
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        backgroundColor: green,
        actions: this._laporanPresensi.length < 1
            ? null
            : <Widget>[
                Padding(
                  padding: EdgeInsets.only(right: 20.0),
                  child: GestureDetector(
                    onTap: () {
                      filterBottom(context);
                    },
                    child: Icon(Icons.filter_alt_rounded),
                  ),
                )
              ],
      ),
      body: SafeArea(
        child: Container(
          child: ListView.builder(
            itemBuilder: (context, index) {
              if (!_isLoading) {
                return LaporanPresensiTile(
                    laporanpresensi: this._laporanPresensi[index]);
              } else {
                return CircularProgressIndicator();
              }
            },
            itemCount: _laporanPresensi.length,
          ),
        ),
      ),
    );
  }

  void filterBottom(context) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
              topLeft: Radius.circular(15.0), topRight: Radius.circular(15.0))),
      builder: (BuildContext context) {
        return Padding(
            padding: MediaQuery.of(context).viewInsets,
            child: Container(
                padding: EdgeInsets.all(20.0),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'FILTER ',
                        style: TextStyle(
                            fontSize: 22.0, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(
                        height: 20.0,
                      ),
                      Container(
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Text(
                                  'Status : ',
                                  style: TextStyle(fontSize: 18.0),
                                ),
                                ElevatedButton(
                                    onPressed: () {
                                      _laporanPresensi.clear();
                                      cekToken('semua');
                                      Navigator.pop(context);
                                    },
                                    style: ElevatedButton.styleFrom(
                                        side: BorderSide(
                                            width: 2, color: Colors.orange),
                                        elevation: 3.0,
                                        shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(15)),
                                        primary: Colors.white),
                                    child: Ink(
                                        decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(18.0)),
                                        child: Container(
                                          width: 75,
                                          height: 15,
                                          alignment: Alignment.center,
                                          child: Text('Semua',
                                              style: TextStyle(
                                                color: Colors.orange,
                                                fontSize: 12.0,
                                                fontWeight: FontWeight.bold,
                                              )),
                                        ))),
                                SizedBox(
                                  width: 5,
                                ),
                                ElevatedButton(
                                    onPressed: () {
                                      _laporanPresensi.clear();
                                      cekToken('14');
                                      Navigator.pop(context);
                                    },
                                    style: ElevatedButton.styleFrom(
                                        side: BorderSide(
                                            width: 2, color: Colors.blue),
                                        elevation: 3.0,
                                        shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(15)),
                                        primary: Colors.white),
                                    child: Ink(
                                        decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(18.0)),
                                        child: Container(
                                          width: 75,
                                          height: 15,
                                          alignment: Alignment.center,
                                          child: Text('14 Hari',
                                              style: TextStyle(
                                                color: Colors.blue,
                                                fontSize: 12.0,
                                                fontWeight: FontWeight.bold,
                                              )),
                                        ))),
                                SizedBox(
                                  width: 5,
                                ),
                                ElevatedButton(
                                    onPressed: () {
                                      _laporanPresensi.clear();
                                      cekToken('30');
                                      Navigator.pop(context);
                                    },
                                    style: ElevatedButton.styleFrom(
                                        side: BorderSide(
                                            width: 2, color: Colors.blue),
                                        elevation: 3.0,
                                        shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(15)),
                                        primary: Colors.white),
                                    child: Ink(
                                        decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(18.0)),
                                        child: Container(
                                          width: 75,
                                          height: 15,
                                          alignment: Alignment.center,
                                          child: Text('30 Hari',
                                              style: TextStyle(
                                                color: Colors.blue,
                                                fontSize: 12.0,
                                                fontWeight: FontWeight.bold,
                                              )),
                                        ))),
                                SizedBox(
                                  width: 5,
                                ),
                                ElevatedButton(
                                    onPressed: () {
                                      _laporanPresensi.clear();
                                      cekToken('90');
                                      Navigator.pop(context);
                                    },
                                    style: ElevatedButton.styleFrom(
                                        side: BorderSide(
                                            width: 2, color: Colors.blue),
                                        elevation: 3.0,
                                        shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(15)),
                                        primary: Colors.white),
                                    child: Ink(
                                        decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(18.0)),
                                        child: Container(
                                          width: 75,
                                          height: 15,
                                          alignment: Alignment.center,
                                          child: Text('90 Hari',
                                              style: TextStyle(
                                                color: Colors.blue,
                                                fontSize: 12.0,
                                                fontWeight: FontWeight.bold,
                                              )),
                                        ))),
                                SizedBox(
                                  width: 5,
                                ),
                                ElevatedButton(
                                    onPressed: () {
                                      _laporanPresensi.clear();
                                      cekToken('180');
                                      Navigator.pop(context);
                                    },
                                    style: ElevatedButton.styleFrom(
                                        side: BorderSide(
                                            width: 2, color: Colors.blue),
                                        elevation: 3.0,
                                        shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(15)),
                                        primary: Colors.white),
                                    child: Ink(
                                        decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(18.0)),
                                        child: Container(
                                          width: 75,
                                          height: 15,
                                          alignment: Alignment.center,
                                          child: Text('180 Hari',
                                              style: TextStyle(
                                                color: Colors.blue,
                                                fontSize: 12.0,
                                                fontWeight: FontWeight.bold,
                                              )),
                                        ))),
                              ]),
                        ),
                      )
                    ])));
      },
    );
  }
}
