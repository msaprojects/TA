import 'dart:async';
import 'package:flutter/material.dart';
import 'package:sistempresensi/pages/login/login.dart';

class SplashScreen extends StatefulWidget {
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    Timer(Duration(seconds: 4), () {
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (context) => LoginPage()));
    });
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: size.height,
        child: Column(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 175,
              height: 100,
              child: Image.asset('assets/logo.png'),
            ),
            SizedBox(
              height: 18,
            ),
            Text(
              'PRESENSI BERBASIS',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              'PENGENALAN WAJAH',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            SizedBox(
              height: 12,
            ),
            CircularProgressIndicator(
              color: Color(0xFF0F0BDB),
              strokeWidth: 2,
            ),
          ],
        ),
      ),
    );
  }
}
