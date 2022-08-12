import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:sistempresensi/models/report/laporanpresensimodel.dart';

class LaporanPresensiTile extends StatelessWidget {
  final LaporanPresensiModel laporanpresensi;
  LaporanPresensiTile({this.laporanpresensi});

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
            onTap: () {},
            child: Container(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    color: laporanpresensi.flag_presensi == 1
                        ? Colors.green
                        : laporanpresensi.flag_presensi == 0
                            ? Colors.orange
                            : Colors.red,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              laporanpresensi.flag_presensi == 1
                                  ? Text('Masuk')
                                  : laporanpresensi.flag_presensi == 2
                                      ? Text('Pulang')
                                      : Text('Tidak Masuk')
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
                          Text(laporanpresensi.tanggalpresensi,
                              style: TextStyle(fontSize: 18.0)),
                          SizedBox(
                            height: 5,
                          ),
                          Text('Platform : ${laporanpresensi.device}'),
                          SizedBox(
                            height: 5,
                          ),
                          laporanpresensi.keterangantugas != null ||
                                  laporanpresensi.idtugas == '0' &&
                                      laporanpresensi.flag_aktiftugas != '0'
                              ? Column(
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                        'Tugas : ${laporanpresensi.keterangantugas}'),
                                    SizedBox(
                                      height: 5,
                                    ),
                                    Text('Lokasi : ${laporanpresensi.lokasi}')
                                  ],
                                )
                              : Container(),
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
