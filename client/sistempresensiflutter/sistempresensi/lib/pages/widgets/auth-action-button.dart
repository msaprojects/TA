import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:sistempresensi/models/pengguna/registrasiwajah.dart';
import 'package:sistempresensi/models/presensi/presensimodel.dart';
import 'package:sistempresensi/models/user/user.model.dart';
import 'package:sistempresensi/pages/db/database.dart';
import 'package:sistempresensi/pages/home/home.dart';
import 'package:sistempresensi/pages/login/login.dart';
import 'package:sistempresensi/pages/widgets/app_button.dart';
import 'package:sistempresensi/services/camera.service.dart';
import 'package:sistempresensi/services/facenet.service.dart';
import 'package:sistempresensi/utils/apiservice.dart';
import 'package:sistempresensi/utils/warna.dart';
import '../home.dart';
import 'ReusableClasses.dart';
import 'app_text_field.dart';

class AuthActionButton extends StatefulWidget {
  AuthActionButton(this._initializeControllerFuture,
      {Key key,
      @required this.onPressed,
      @required this.isLogin,
      this.reload,
      this.nama,
      this.token,
      this.idtugas,
      this.idpengguna});
  final Future _initializeControllerFuture;
  final Function onPressed;
  final bool isLogin;
  final Function reload;
  final String nama;
  final String token;
  final String idtugas;
  final String idpengguna;
  @override
  _AuthActionButtonState createState() => _AuthActionButtonState();
}

class _AuthActionButtonState extends State<AuthActionButton> {
  /// service injection
  final FaceNetService _faceNetService = FaceNetService();
  final DataBaseService _dataBaseService = DataBaseService();
  final CameraService _cameraService = CameraService();

  final TextEditingController _userTextEditingController =
      TextEditingController(text: '');
  final TextEditingController _passwordTextEditingController =
      TextEditingController(text: '');
  Position _position;
  var latitude, longitude;

  User predictedUser;

  /// for update data wajah to database
  ApiService _apiService = new ApiService();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _getCurrentGeolocation();
  }

  /// get location
  void _getCurrentGeolocation() async {
    Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
    setState(() {
      _position = position;
      latitude = position.latitude.toString();
      longitude = position.longitude.toString();
    });
  }

  Future _signUp(context) async {
    /// gets predicted data from facenet service (user face detected)
    List predictedData = _faceNetService.predictedData;
    String user = widget.nama;
    String password = _passwordTextEditingController.text;

    /// creates a new user in the 'database'

    /// data descriptors
    RegistrasiWajahModel data =
        RegistrasiWajahModel(password: password, rekam_wajah: '1');
    _apiService.RegistrasiWajah(widget.token, data).then((issuccess) async {
      if (issuccess) {
        await _dataBaseService.saveData(user, password, predictedData);

        /// resets the face stored in the face net sevice
        this._faceNetService.setPredictedData(null);
        Navigator.push(context,
            MaterialPageRoute(builder: (BuildContext context) => LoginPage()));
      } else {
        ReusableClasses().modalbottomWarning(
            context,
            'GAGAL!',
            _apiService.responseCode.messageApi,
            'f400',
            'assets/images/sorry.png');
      }
    });
  }

  Future _signIn(context) async {
    // String password = _passwordTextEditingController.text;
    print('Token Login?' + widget.token + widget.idpengguna);
    // if (this.predictedUser.password == password) {
    /// sending params to api presensi
    PresensiModel data = PresensiModel(
        latitude: latitude,
        longitude: longitude,
        device: "Mobile",
        idtugas: widget.idtugas,
        idpengguna: widget.idpengguna);
    print(data);
    _apiService.Presensi(widget.token, data).then((issuccess) async {
      if (issuccess) {
        Navigator.push(context,
            MaterialPageRoute(builder: (BuildContext context) => HomePage()));
      } else {
        ReusableClasses().modalbottomWarning(
            context,
            'GAGAL!',
            _apiService.responseCode.messageApi,
            'f400',
            'assets/images/sorry.png');
      }
    });
    // Navigator.push(
    //         context,
    //         MaterialPageRoute(
    //             builder: (BuildContext context) => Profile(
    //                   this.predictedUser.user,
    //                   imagePath: _cameraService.imagePath,
    //                 )));
    // } else {
    //   showDialog(
    //     context: context,
    //     builder: (context) {
    //       return AlertDialog(
    //         content: Text('Wrong password!'),
    //       );
    //     },
    //   );
    // }
  }

  String _predictUser() {
    print('kepanggil?');
    String userAndPass = _faceNetService.predict();
    print('oppp' + userAndPass.toString());
    return userAndPass;
  }

  Future onTap() async {
    try {
      // Ensure that the camera is initialized.
      await widget._initializeControllerFuture;
      print('ll' + widget._initializeControllerFuture.toString());
      // onShot event (takes the image and predict output)
      bool faceDetected = await widget.onPressed();
      print('xx' + faceDetected.toString());
      if (faceDetected) {
        print('22' + widget.isLogin.toString());
        if (widget.isLogin) {
          var userAndPass = _predictUser();
          print('33' + userAndPass.toString());
          if (userAndPass != null) {
            this.predictedUser = User.fromDB(userAndPass);
          }
        }
        PersistentBottomSheetController bottomSheetController =
            Scaffold.of(context)
                .showBottomSheet((context) => signSheet(context));

        bottomSheetController.closed.whenComplete(() => widget.reload());
      }
    } catch (e) {
      // If an error occurs, log the error to the console.
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    print('asasa ' + widget.isLogin.toString());
    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: green,
          boxShadow: <BoxShadow>[
            BoxShadow(
              color: Colors.blue.withOpacity(0.1),
              blurRadius: 1,
              offset: Offset(0, 2),
            ),
          ],
        ),
        alignment: Alignment.center,
        padding: EdgeInsets.symmetric(vertical: 14, horizontal: 16),
        width: MediaQuery.of(context).size.width * 0.8,
        height: 60,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'PRESENSI',
              style: TextStyle(color: Colors.white),
            ),
            SizedBox(
              width: 10,
            ),
            Icon(Icons.camera_alt, color: Colors.white)
          ],
        ),
      ),
    );
  }

  signSheet(context) {
    return Container(
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          widget.isLogin && predictedUser != null
              ? Container(
                  child: Text(
                    predictedUser.user,
                    style: TextStyle(fontSize: 20),
                  ),
                )
              : widget.isLogin
                  ? Container(
                      child: Text(
                      'maaf anda tidak dapat kami kenali 😞',
                      style: TextStyle(fontSize: 20),
                    ))
                  : Container(),
          Container(
            child: Column(
              children: [
                !widget.isLogin
                    ? AppTextField(
                        controller: _passwordTextEditingController,
                        labelText: 'Password',
                      )
                    : Container(),
                SizedBox(height: 10),
                widget.isLogin && predictedUser == null
                    ? Container()
                    : Container(),
                SizedBox(height: 10),
                Divider(),
                SizedBox(height: 10),
                widget.isLogin && predictedUser != null
                    ? AppButton(
                        text: 'IYA, PRESENSI SEKARANG',
                        onPressed: _position == null
                            ? () {
                                ReusableClasses().modalbottomWarning(
                                    context,
                                    "Lokasi anda mati!",
                                    "Pastikan akses lokasi anda sudah nyala!." +
                                        _position.toString(),
                                    "f404",
                                    "assets/images/sorry.png");
                              }
                            : () async {
                                await _signIn(context);
                              },
                        icon: Icon(
                          Icons.verified,
                          color: Colors.white,
                        ),
                      )
                    : !widget.isLogin
                        ? AppButton(
                            text: 'DAFTARKAN WAJAH',
                            onPressed: () async {
                              await _signUp(context);
                            },
                            icon: Icon(
                              Icons.person_add,
                              color: Colors.white,
                            ),
                          )
                        : Container(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}
