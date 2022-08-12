import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sistempresensi/models/tugas/tugasmodel.dart';
import 'package:sistempresensi/pages/db/database.dart';
import 'package:sistempresensi/pages/tugas/tugastile.dart';
import 'package:sistempresensi/pages/widgets/ReusableClasses.dart';
import 'package:sistempresensi/services/facenet.service.dart';
import 'package:sistempresensi/services/ml_kit_service.dart';
import 'package:sistempresensi/utils/warna.dart';

import 'networktugas.dart';

class ListTugas extends StatefulWidget {
  @override
  State<ListTugas> createState() => _ListTugasState();
}

class _ListTugasState extends State<ListTugas> {
  SharedPreferences sp;
  String token = "", idpengguna = "";
  List<TugasModel> _tugasModel = <TugasModel>[];
  var valuetugas;

  /// Services injection
  FaceNetService _faceNetService = FaceNetService();
  MLKitService _mlKitService = MLKitService();
  DataBaseService _dataBaseService = DataBaseService();
  bool loading = false;

  CameraDescription cameraDescription;

  /// 1 Obtain a list of the available cameras on the device.
  /// 2 loads the face net model
  _startUp() async {
    _setLoading(true);
    List<CameraDescription> cameras = await availableCameras();

    /// takes the front camera
    cameraDescription = cameras.firstWhere(
      (CameraDescription camera) =>
          camera.lensDirection == CameraLensDirection.front,
    );

    /// start the services
    await _faceNetService.loadModel();
    await _dataBaseService.loadDB();
    _mlKitService.initialize();
    _setLoading(false);
  }

  /// shows or hides the circular progress indicator
  _setLoading(bool value) {
    setState(() {
      loading = value;
    });
  }

  /// for set value listview to this variable
  TextEditingController _textSearch = TextEditingController(text: "");

  bool _isLoading = true;

  // * ceking token and getting dashboard value from Shared Preferences
  cekToken(String filter) async {
    sp = await SharedPreferences.getInstance();
    setState(() {
      token = sp.getString("access_token");
      idpengguna = sp.getString("idpengguna");
    });
    fetchTugas(token).then((value) {
      setState(() {
        valuetugas = value;
        _isLoading = false;
        _tugasModel.addAll(valuetugas);
      });
    }).onError((error, stackTrace) {
      print('zzzz' + stackTrace.toString());
      if (stackTrace == '204') {
        ReusableClasses().modalbottomWarning(context, 'Warning!',
            "Data masih kosong", error.toString(), 'assets/images/sorry.png');
      } else {
        ReusableClasses().modalbottomWarning(context, 'Warnsing!',
            error.toString(), stackTrace.toString(), 'assets/images/sorry.png');
      }
    });
  }

  @override
  initState() {
    super.initState();
    cekToken('semua');
    _startUp();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tugas'),
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        backgroundColor: green,
      ),
      body: SafeArea(
        child: Container(
          child: ListView.builder(
            itemBuilder: (context, index) {
              if (!_isLoading) {
                return TugasTile(
                  tugasModel: this._tugasModel[index],
                  cameraDescription: cameraDescription,
                  token: token,
                  idpengguna: idpengguna,
                );
              } else {
                return CircularProgressIndicator();
              }
            },
            itemCount: _tugasModel.length,
          ),
        ),
      ),
    );
  }
}
