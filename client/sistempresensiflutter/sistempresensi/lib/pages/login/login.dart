import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:geolocator/geolocator.dart';
import 'package:sistempresensi/models/login/loginmodel.dart';
import 'package:sistempresensi/pages/home/home.dart';
import 'package:sistempresensi/pages/widgets/ReusableClasses.dart';
import 'package:sistempresensi/pages/widgets/deviceinfo.dart';
import 'package:sistempresensi/utils/apiservice.dart';
import 'package:sistempresensi/utils/getGeolocation.dart';
import '../../utils/warna.dart';

import '../home.dart';

class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  TextEditingController _tecUsername = TextEditingController(text: "");
  TextEditingController _tecPassword = TextEditingController(text: "");
  String uuid, latitude, longitude;
  Position _currentPosition;
  var locationPermission;
  ApiService _apiService = ApiService();
  bool _isLoading = false,
      _passtype = true,
      _fieldUsername = true,
      _fieldPassword = true;
  Position _position;

  @override
  void initState() {
    super.initState();
    cekUuid();
    GeoLokasi().desirePosition();
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

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  void _toggle() {
    setState(() {
      _passtype = !_passtype;
    });
  }

  cekUuid() async {
    print('cekuuid');
    uuid = await GetDeviceID().getDeviceID(context);
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
        body: SingleChildScrollView(
      child: Container(
        color: Colors.white,
        padding: EdgeInsets.all(25.0),
        width: double.infinity,
        height: size.height,
        child: Stack(
          alignment: Alignment.center,
          fit: StackFit.passthrough,
          children: [
            Positioned(
                child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 175,
                  height: 100,
                  child: Image.asset('assets/logo.png'),
                ),
                SizedBox(
                  height: 12,
                ),
                Text(
                  "L O G I N",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 28),
                ),
                SizedBox(
                  height: 15,
                ),
                Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      side:
                          BorderSide(color: green.withOpacity(0.5), width: 1)),
                  child: Padding(
                    padding: const EdgeInsets.only(
                        left: 12.0, right: 12.0, bottom: 8.0, top: 8.0),
                    child: TextFormField(
                        controller: _tecUsername,
                        cursorColor: blackcolor,
                        decoration: const InputDecoration(
                          icon: Icon(
                            Icons.person_outline_outlined,
                            color: green,
                          ),
                          border: InputBorder.none,
                          fillColor: Colors.white,
                          focusColor: Colors.white,
                          hintText: 'Username',
                        )),
                  ),
                ),
                const SizedBox(
                  height: 10.0,
                ),
                Card(
                  shadowColor: green,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      side:
                          BorderSide(color: green.withOpacity(0.5), width: 1)),
                  child: Padding(
                    padding: const EdgeInsets.only(
                        left: 12.0, right: 12.0, bottom: 8.0, top: 8.0),
                    child: TextFormField(
                        controller: _tecPassword,
                        obscureText: _passtype,
                        cursorColor: green,
                        decoration: InputDecoration(
                            icon: const Icon(
                              Icons.password_rounded,
                              color: green,
                            ),
                            border: InputBorder.none,
                            fillColor: Colors.white,
                            focusColor: Colors.white,
                            hintText: 'Password',
                            suffixIcon: IconButton(
                              onPressed: _toggle,
                              icon: Icon(
                                _passtype
                                    ? Icons.remove_red_eye_rounded
                                    : Icons.visibility,
                                color: green,
                              ),
                            ))),
                  ),
                ),
                SizedBox(
                  height: 35,
                ),
                ElevatedButton(
                  onPressed: _position == null
                      ? () {
                          GeoLokasi().desirePosition();
                          _getCurrentGeolocation();
                        }
                      : () {
                          LoginClick();
                        },
                  style: ElevatedButton.styleFrom(
                      elevation: 4.0, shadowColor: greenold, primary: green),
                  child: Ink(
                    decoration:
                        BoxDecoration(borderRadius: BorderRadius.circular(8.0)),
                    child: Container(
                      width: 325,
                      height: 55,
                      alignment: Alignment.center,
                      child: const Text(
                        'L O G I N',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 22.0,
                            fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 12.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      'Device ID :  ' + uuid.toString().toUpperCase(),
                      style: TextStyle(color: blackcolor),
                    ),
                    SizedBox(
                      width: 10.0,
                    ),
                    SizedBox(
                      height: 25.0,
                      width: 75.0,
                      child: ElevatedButton(
                          onPressed: uuid == null
                              ? () {
                                  cekUuid();
                                }
                              : () {
                                  Clipboard.setData(ClipboardData(text: uuid))
                                      .then((value) {
                                    // Fluttertoast.showToast(
                                    //     msg: 'ID tersalin!',
                                    //     backgroundColor: Colors.green);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                            content: Text(
                                                'ID Device Berhasil Disalin!')));
                                  });
                                },
                          style: ElevatedButton.styleFrom(
                            elevation: 0.0,
                            primary: yellowcolor,
                          ),
                          child: Ink(
                            child: Container(
                              width: 75,
                              height: 50,
                              alignment: Alignment.center,
                              child: Text(
                                uuid == null ? 'Wait' : "Salin",
                              ),
                            ),
                          )),
                    ),
                  ],
                ),
              ],
            ))
          ],
        ),
      ),
    ));
  }

// * class for login button action and response
  void LoginClick() {
    print(_position);
    var username = _tecUsername.text.toString();
    var password = _tecPassword.text.toString();
    if (username == "" || password == "") {
      ReusableClasses().modalbottomWarning(
          context,
          "Tidak Valid",
          'pastikan username dan password sudah terisi!',
          'f400',
          'assets/images/sorry.png');
    } else {
      LoginModel dataparams = LoginModel(
          username: username, password: password, device: 'mobile', uuid: uuid);
      _apiService.LoginApp(dataparams).then((isSuccess) async {
        print('issuccess:' + isSuccess.toString());
        if (isSuccess) {
          setState(() {
            _isLoading = false;
          });
          return Navigator.pushReplacement(
              context, MaterialPageRoute(builder: (context) => HomePage()));
        } else {
          ReusableClasses().modalbottomWarning(
              context,
              'GAGAL!',
              _apiService.responseCode.messageApi,
              'f400',
              'assets/images/sorry.png');
        }
      }).onError((error, stackTrace) => print(error));
    }
    return;
  }

  // _getCurrentLocation() async {
  //   LocationPermission permission;
  //   permission = await Geolocator.checkPermission();
  //   if (permission == LocationPermission.denied) {
  //     permission = await Geolocator.requestPermission();
  //     if (permission == LocationPermission.deniedForever) {
  //       // return Future.error('Location Not Available');
  //     }
  //   } else if (permission == LocationPermission.always ||
  //       permission == LocationPermission.whileInUse) {
  //     Geolocator.getCurrentPosition(
  //             desiredAccuracy: LocationAccuracy.best,
  //             forceAndroidLocationManager: true)
  //         .then((Position position) {
  //       print('Posisi:' + position.toString());
  //       setState(() {
  //         _currentPosition = position;
  //       });
  //     }).catchError((e) {
  //       print(e);
  //     });
  //   } else {
  //     throw Exception('Error');
  //   }
  //   return await Geolocator.getCurrentPosition();
  // }
}
