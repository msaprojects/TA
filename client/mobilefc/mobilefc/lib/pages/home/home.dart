import 'package:flutter/material.dart';
import 'package:mobilefc/pages/splashscreen/splashscreen.dart';
import 'package:mobilefc/utils/warna.dart';

class HomePage extends StatefulWidget {
  HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: backgroundpallete,
      body: CustomScrollView(
        physics: const ClampingScrollPhysics(),
        slivers: <Widget>[
          _buildHeader(screenHeight),
          _buildDashboard(screenHeight),
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
                backgroundColor: bluepallete,
              ),
              const SizedBox(
                width: 15.0,
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Halo, Syahrul',
                    style:
                        TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(
                    height: 5.0,
                  ),
                  Text(
                    'Administrator',
                    style: TextStyle(fontSize: 14.0),
                  )
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
          color: bluepallete,
          elevation: 3.0,
          shadowColor: darkbluepallete,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.0),
              side: BorderSide(color: redpallete.withOpacity(0.5), width: 2)),
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
                        style: TextStyle(fontSize: 18.0),
                      ),
                      Text(
                        '100',
                        style: TextStyle(
                            fontSize: 32.0, fontWeight: FontWeight.w900),
                      ),
                      Text(
                        'Menit',
                        style: TextStyle(fontSize: 18.0),
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
                        style: TextStyle(fontSize: 18.0),
                      ),
                      Text(
                        '100',
                        style: TextStyle(
                            fontSize: 32.0, fontWeight: FontWeight.w900),
                      ),
                      Text(
                        'Menit',
                        style: TextStyle(fontSize: 18.0),
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
              children: const [
                Text(
                  'Attendance',
                  style: TextStyle(
                    fontSize: 18.0,
                  ),
                )
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
                  style: TextStyle(
                    fontSize: 18.0,
                  ),
                ),
                const SizedBox(
                  height: 15.0,
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Card(
                      elevation: 3.0,
                      shadowColor: darkbluepallete,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                          side: BorderSide(
                              color: bluepallete.withOpacity(0.3), width: 2)),
                      child: Container(
                        alignment: Alignment.center,
                        width: double.infinity,
                        child: ListTile(
                          onTap: () {},
                          title: (const Text(
                            'PRESENSI',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          )),
                          leading: const Icon(
                            Icons.photo_camera_front_outlined,
                            color: darkbluepallete,
                            size: 22,
                          ),
                          trailing: const Icon(
                            Icons.arrow_forward_ios_rounded,
                            color: darkbluepallete,
                            size: 22,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 8.0,
                    ),
                    Card(
                      elevation: 3.0,
                      shadowColor: darkbluepallete,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                          side: BorderSide(
                              color: bluepallete.withOpacity(0.3), width: 2)),
                      child: Container(
                        alignment: Alignment.center,
                        width: double.infinity,
                        child: ListTile(
                          onTap: () {},
                          title: (const Text(
                            'LAPORAN',
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          )),
                          leading: const Icon(
                            Icons.book_outlined,
                            color: darkbluepallete,
                            size: 22,
                          ),
                          trailing: const Icon(
                            Icons.arrow_forward_ios_rounded,
                            color: darkbluepallete,
                            size: 22,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 45,
                    ),
                    Card(
                      color: redpallete,
                      elevation: 3.0,
                      shadowColor: darkbluepallete,
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
                                color: Colors.white),
                          )),
                          leading: const Icon(
                            Icons.exit_to_app,
                            color: Colors.white,
                            size: 22,
                          ),
                        ),
                      ),
                    )
                  ],
                )
              ],
            )));
  }
}
