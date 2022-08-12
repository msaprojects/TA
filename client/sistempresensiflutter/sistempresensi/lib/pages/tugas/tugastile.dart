import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:sistempresensi/models/tugas/tugasmodel.dart';
import 'package:sistempresensi/pages/widgets/ReusableClasses.dart';

import '../pencocokanwajah.dart';

class TugasTile extends StatelessWidget {
  final TugasModel tugasModel;
  final String token, idpengguna;
  final CameraDescription cameraDescription;
  TugasTile(
      {this.tugasModel, this.token, this.cameraDescription, this.idpengguna});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Card(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
          elevation: 3.0,
          // shadowColor: Colors.grey.withOpacity(7.0),
          child: InkWell(
            onTap: tugasModel.flag_aktif == 0 || tugasModel.flag_aktif == '1'
                ? () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (BuildContext context) => SignIn(
                          cameraDescription: cameraDescription,
                          token: token,
                          idtugas: tugasModel.idtugas.toString(),
                          idpengguna: idpengguna,
                        ),
                      ),
                    );
                  }
                : () {
                    ReusableClasses().modalbottomWarning(
                        context,
                        'Sudah Selesai!' + tugasModel.flag_aktif.toString(),
                        'Tugas ${tugasModel.keterangan} sudah anda kerjakan!',
                        'f200',
                        'assets/images/success.png');
                  },
            child: Container(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    color: tugasModel.flag_aktif == 0
                        ? Colors.grey[300]
                        : tugasModel.flag_aktif == 1
                            ? Colors.red
                            : tugasModel.flag_aktif == 2
                                ? Colors.blue
                                : Colors.grey,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              tugasModel.flag_aktif == 0
                                  ? Text('Belum melakukan Presensi')
                                  : tugasModel.flag_aktif == 1
                                      ? Text('Anda belum menyelesaikan tugas')
                                      : tugasModel.flag_aktif == 2
                                          ? Text('Tugas Selesai Dikerjakan')
                                          : Container()
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                  Container(
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(tugasModel.keterangan,
                              style: TextStyle(fontSize: 18.0)),
                          SizedBox(
                            height: 5,
                          ),
                          Text('Lokasi : ${tugasModel.lokasi}'),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          )),
    );
  }
}
