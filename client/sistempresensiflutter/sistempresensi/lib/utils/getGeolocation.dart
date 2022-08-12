import 'package:geolocator/geolocator.dart';

class GeoLokasi {
  Future<Position> desirePosition() async {
    LocationPermission permission;
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location Permission Denied');
      }
    }
    print('sada' + Geolocator.getCurrentPosition().toString());

    return await Geolocator.getCurrentPosition();
  }
}
