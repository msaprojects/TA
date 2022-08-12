import 'dart:io';

import 'package:face_net_authentication/pages/login/login.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ReusableClasses {
  // ! MODAL BOTTOM SHEET FOR WARNING ERROR
  modalbottomWarning(context, String title, String message, String kode,
      String imagelocation) {
    dynamic navigation;
    showModalBottomSheet(
        isDismissible: false,
        isScrollControlled: true,
        enableDrag: false,
        context: context,
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.only(
                topLeft: Radius.circular(15.0),
                topRight: Radius.circular(15.0))),
        builder: (BuildContext context) {
          return WillPopScope(
            onWillPop: () async => false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                kode != '401'
                    ? Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          IconButton(
                              onPressed: () {
                                Navigator.pop(context);
                              },
                              tooltip: 'Close Message',
                              icon: Icon(Icons.close))
                        ],
                      )
                    : SizedBox(
                        height: 20.0,
                      ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 20.0, right: 20.0, bottom: 20.0, top: 5.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            title.toUpperCase(),
                            style: TextStyle(
                                fontSize: 22.0, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            "[ " + kode.toUpperCase() + " ]",
                            style: TextStyle(fontSize: 11.0),
                          )
                        ],
                      ),
                      SizedBox(height: 10.0),
                      Image.asset(
                        imagelocation,
                        height: 150,
                        width: 250,
                      ),
                      SizedBox(height: 10.0),
                      Text(
                        message.toString(),
                        style: TextStyle(fontSize: 16.0),
                      ),
                      SizedBox(
                        height: 20.0,
                      ),
                      kode != '401'
                          ? Container()
                          : ElevatedButton(
                              onPressed: () {
                                exit(context);
                              },
                              style: ElevatedButton.styleFrom(
                                  elevation: 0.0,
                                  onSurface: Color(0xFF0F0BDB),
                                  primary: Color(0xFF0F0BDB),
                                  shadowColor: Color(0xFF0F0BDB)),
                              child: Ink(
                                  decoration: BoxDecoration(
                                      borderRadius:
                                          BorderRadius.circular(18.0)),
                                  child: Container(
                                    width: 325,
                                    height: 45,
                                    alignment: Alignment.center,
                                    child: Text('L O G I N',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 18.0,
                                          fontWeight: FontWeight.bold,
                                        )),
                                  )))
                    ],
                  ),
                ),
              ],
            ),
          );
        });
  }

  void exit(context) async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    preferences.clear();
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => LoginPage()),
      (Route<dynamic> route) => false,
    );
  }
}

class GetSharedPreference {
  SharedPreferences sp;
  var tokens = "";
  getsharedpreferences() async {
    sp = await SharedPreferences.getInstance();
  }

  set setToken(String token) {
    this.tokens = token;
  }

  Future<String> get getToken async {
    return tokens;
  }
}
