import 'dart:convert';

class ResponseCode {
  var statusCode, messageApi, data;
  ResponseCode({this.statusCode, this.messageApi, this.data});

  factory ResponseCode.fromJson(Map<dynamic, dynamic> map) {
    return ResponseCode(
        statusCode: map["statuscode"],
        messageApi: map["message"],
        data: map["data"]);
  }

  @override
  String toString() {
    return 'message: $messageApi, data: $data';
  }
}

List<ResponseCode> responsecodeFromJson(String dataJson) {
  final data = json.decode(dataJson);
  return List<ResponseCode>.from(
      data.map((item) => ResponseCode.fromJson(item)));
}
