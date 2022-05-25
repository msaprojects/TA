import 'package:flutter/material.dart';
import 'package:mobilefc/pages/home/home.dart';
import 'package:mobilefc/pages/splashscreen/splashscreen.dart';
import 'package:mobilefc/utils/warna.dart';

class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _tecUsername = TextEditingController();
  final TextEditingController _tecPassword = TextEditingController();
  bool showPassword = true;

  void _togglePassword() {
    setState(() {
      showPassword = !showPassword;
    });
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          color: Colors.white,
          padding: const EdgeInsets.all(25.0),
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
                      width: 120.0,
                      height: 120.0,
                      color: bluepallete,
                    ),
                    const SizedBox(
                      height: 20.0,
                    ),
                    const Text('Sign In',
                        style: TextStyle(
                          fontSize: 22.0,
                          fontWeight: FontWeight.bold,
                        )),
                    const SizedBox(
                      height: 15.0,
                    ),
                    Card(
                      elevation: 3.0,
                      shadowColor: darkbluepallete,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                          side: BorderSide(
                              color: bluepallete.withOpacity(0.5), width: 2)),
                      child: Padding(
                        padding: const EdgeInsets.only(
                            left: 12.0, right: 12.0, bottom: 8.0, top: 8.0),
                        child: TextFormField(
                            controller: _tecUsername,
                            cursorColor: darkbluepallete,
                            decoration: const InputDecoration(
                              icon: Icon(
                                Icons.person_outline_outlined,
                                color: darkbluepallete,
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
                      elevation: 3.0,
                      shadowColor: darkbluepallete,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                          side: BorderSide(
                              color: bluepallete.withOpacity(0.5), width: 2)),
                      child: Padding(
                        padding: const EdgeInsets.only(
                            left: 12.0, right: 12.0, bottom: 8.0, top: 8.0),
                        child: TextFormField(
                            controller: _tecPassword,
                            obscureText: showPassword,
                            cursorColor: darkbluepallete,
                            decoration: InputDecoration(
                                icon: const Icon(
                                  Icons.password_rounded,
                                  color: darkbluepallete,
                                ),
                                border: InputBorder.none,
                                fillColor: Colors.white,
                                focusColor: Colors.white,
                                hintText: 'Password',
                                suffixIcon: IconButton(
                                  onPressed: _togglePassword,
                                  icon: Icon(
                                    showPassword
                                        ? Icons.remove_red_eye_rounded
                                        : Icons.visibility,
                                    color: darkbluepallete,
                                  ),
                                ))),
                      ),
                    ),
                    const SizedBox(
                      height: 45.0,
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                                builder: (context) => HomePage()));
                      },
                      style: ElevatedButton.styleFrom(
                          elevation: 4.0,
                          shadowColor: darkbluepallete,
                          primary: redpallete),
                      child: Ink(
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8.0)),
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
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
