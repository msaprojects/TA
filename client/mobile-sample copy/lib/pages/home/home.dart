import 'package:camera/camera.dart';
import 'package:face_net_authentication/pages/db/database.dart';
import 'package:face_net_authentication/pages/home/child/settingchild.dart';
import 'package:face_net_authentication/pages/report/presensi/laporanpresensi.dart';
import 'package:face_net_authentication/pages/sign-up.dart';
import 'package:face_net_authentication/pages/splashscreen/splashscreen.dart';
import 'package:face_net_authentication/pages/tugas/tugas.dart';
import 'package:face_net_authentication/pages/widgets/ReusableClasses.dart';
import 'package:face_net_authentication/services/facenet.service.dart';
import 'package:face_net_authentication/services/ml_kit_service.dart';
import 'package:face_net_authentication/utils/warna.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../home.dart';
import '../pencocokanwajah.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  /// Services injection
  FaceNetService _faceNetService = FaceNetService();
  MLKitService _mlKitService = MLKitService();
  DataBaseService _dataBaseService = DataBaseService();
  bool loading = false;
  SharedPreferences sp;
  String token = "",
      nama = "",
      jabatan = "",
      rekam_wajah = "",
      latitude,
      longitude;
  Position _position;

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

  @override
  initState() {
    cekToken();
    super.initState();
    _startUp();
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

  // * ceking token and getting dashboard value from api
  cekToken() async {
    sp = await SharedPreferences.getInstance();
    setState(() {
      token = sp.getString("access_token");
      nama = sp.getString("nama");
      jabatan = sp.getString("jabatan");
      rekam_wajah = sp.getString("rekam_wajah");
    });
    // _apiService.getDashboard(token!).then((value) {
    //   // DashboardModel dashboardModel = DashboardModel();
    //   setState(() {
    //     _dashboard.addAll(value!);
    //   });

    // }).catchError((error, stackTrace) {
    //   ReusableClasses().modalbottomWarning(context, 'Warning!',
    //       error.toString(), stackTrace.toString(), 'assets/images/sorry.png');
    // });
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        physics: const ClampingScrollPhysics(),
        slivers: <Widget>[
          _buildHeader(screenHeight),
          // _buildDashboard(screenHeight),
          _buildAttendance(screenHeight),
          _buildMenu(screenHeight),
        ],
      ),
    );
  }

  /// code for header
  SliverToBoxAdapter _buildHeader(double screenHeight) {
    return SliverToBoxAdapter(
        child: Container(
            padding: const EdgeInsets.only(
                left: 25.0, right: 25.0, top: 55.0, bottom: 10.0),
            child: Row(children: [
              const CircleAvatar(
                radius: 30.0,
                backgroundColor: green,
              ),
              const SizedBox(
                width: 15.0,
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Halo, ' + nama,
                    style:
                        TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(
                    height: 5.0,
                  ),
                  Text(
                    jabatan,
                    style: TextStyle(fontSize: 14.0),
                  ),
                ],
              )
            ])));
  }

  /// code for dashboard counter
  SliverToBoxAdapter _buildDashboard(double screenHeight) {
    return SliverToBoxAdapter(
        child: Container(
      padding: const EdgeInsets.only(
          left: 25.0, right: 25.0, bottom: 10.0, top: 15.0),
      child: Card(
          color: green,
          elevation: 0,
          shadowColor: greenold.withOpacity(0.3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15.0),
          ),
          child: Padding(
            padding: const EdgeInsets.only(
                left: 12.0, right: 12.0, bottom: 8.0, top: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  height: 80.0,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: const [
                      Text(
                        'Text 1',
                        style: TextStyle(fontSize: 18.0, color: Colors.white),
                      ),
                      Text(
                        '100',
                        style: TextStyle(
                            fontSize: 32.0,
                            fontWeight: FontWeight.w900,
                            color: Colors.white),
                      ),
                      Text(
                        'Menit',
                        style: TextStyle(fontSize: 18.0, color: Colors.white),
                      )
                    ],
                  ),
                ),
                SizedBox(
                  height: 80.0,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: const [
                      Text(
                        'Text 2',
                        style: TextStyle(fontSize: 18.0, color: Colors.white),
                      ),
                      Text(
                        '100',
                        style: TextStyle(
                            fontSize: 32.0,
                            fontWeight: FontWeight.w900,
                            color: Colors.white),
                      ),
                      Text(
                        'Menit',
                        style: TextStyle(fontSize: 18.0, color: Colors.white),
                      )
                    ],
                  ),
                )
              ],
            ),
          )),
    ));
  }

  /// code for Attendance Content
  SliverToBoxAdapter _buildAttendance(double screenHeight) {
    return SliverToBoxAdapter(
        child: Container(
            padding: const EdgeInsets.only(
                left: 25.0, right: 25.0, top: 15.0, bottom: 10.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Waktu Presensi Yang Berlaku',
                  style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
                ),
                SizedBox(
                  height: 10,
                ),
                SettingChild()
              ],
            )));
  }

  /// code for Menu
  SliverToBoxAdapter _buildMenu(double screenHeight) {
    return SliverToBoxAdapter(
        child: Container(
            padding: const EdgeInsets.only(
                left: 25.0, right: 25.0, top: 15.0, bottom: 10.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Menu',
                  style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
                ),
                const SizedBox(
                  height: 15.0,
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    rekam_wajah.toString() == '0'
                        ? Card(
                            elevation: 0,
                            shadowColor: greenold,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8.0),
                                side: BorderSide(
                                    color: green.withOpacity(0.3), width: 2)),
                            child: Container(
                              alignment: Alignment.center,
                              width: double.infinity,
                              child: ListTile(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (BuildContext context) => SignUp(
                                          cameraDescription: cameraDescription,
                                          nama: nama,
                                          token: token),
                                    ),
                                  );
                                },
                                title: (const Text(
                                  'REGISTRASI WAJAH',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                )),
                                leading: const Icon(
                                  Icons.camera_front_outlined,
                                  color: green,
                                  size: 22,
                                ),
                                trailing: const Icon(
                                  Icons.arrow_forward_ios_rounded,
                                  color: green,
                                  size: 22,
                                ),
                              ),
                            ),
                          )
                        : Card(
                            elevation: 0,
                            shadowColor: greenold,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8.0),
                                side: BorderSide(
                                    color: green.withOpacity(0.3), width: 2)),
                            child: Container(
                              alignment: Alignment.center,
                              width: double.infinity,
                              child: ListTile(
                                onTap: _position != null
                                    ? () {
                                        ReusableClasses().modalbottomWarning(
                                            context,
                                            "Lokasi anda mati!",
                                            '"Pastikan lokasi anda aktif untuk melakukan presesi, harap keluar dan masuk lagi untuk melakukan presensi!',
                                            'f404',
                                            'assets/images.sorry.png');
                                      }
                                    : () {
                                        // Navigator.push(
                                        //   context,
                                        //   MaterialPageRoute(
                                        //     builder: (BuildContext context) =>
                                        //         SignIn(
                                        //             cameraDescription:
                                        //                 cameraDescription,
                                        //             token: token),
                                        //   ),
                                        // );
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (BuildContext context) =>
                                                  ListTugas()),
                                        );
                                      },
                                title: (const Text(
                                  'TUGAS',
                                  style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: blackcolor),
                                )),
                                leading: const Icon(
                                  Icons.photo_camera_front_outlined,
                                  color: green,
                                  size: 22,
                                ),
                                trailing: const Icon(
                                  Icons.arrow_forward_ios_rounded,
                                  color: green,
                                  size: 22,
                                ),
                              ),
                            ),
                          ),
                    const SizedBox(
                      height: 8.0,
                    ),
                    Card(
                      elevation: 0,
                      shadowColor: greenold,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                          side: BorderSide(
                              color: green.withOpacity(0.3), width: 2)),
                      child: Container(
                        alignment: Alignment.center,
                        width: double.infinity,
                        child: ListTile(
                          onTap: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        LaporanPresensiPage()));
                          },
                          title: (const Text(
                            'LAPORAN PRESENSI',
                            style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: blackcolor),
                          )),
                          leading: const Icon(
                            Icons.book_outlined,
                            color: green,
                            size: 22,
                          ),
                          trailing: const Icon(
                            Icons.arrow_forward_ios_rounded,
                            color: green,
                            size: 22,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 45,
                    ),
                    Card(
                      color: yellowcolor,
                      elevation: 3.0,
                      shadowColor: yellowcolor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: Container(
                        alignment: Alignment.center,
                        width: double.infinity,
                        child: ListTile(
                          onTap: () {
                            Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => SplashScreen()));
                          },
                          title: (const Text(
                            'KELUAR',
                            style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: blackcolor),
                          )),
                          leading: const Icon(
                            Icons.exit_to_app,
                            color: blackcolor,
                            size: 22,
                          ),
                        ),
                      ),
                    ),
                  ],
                )
              ],
            )));
  }
}
