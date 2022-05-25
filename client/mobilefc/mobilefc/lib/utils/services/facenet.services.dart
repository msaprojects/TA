import 'dart:io';
import 'dart:math';
import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:google_ml_kit/google_ml_kit.dart';
import 'package:mobilefc/utils/services/database.dart';
import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:image/image.dart' as imglib;

import 'image_converter.dart';

class FaceNetService {
  // * singleton boilerplate
  static final FaceNetService _faceNetService = FaceNetService._internal();

  factory FaceNetService() {
    return _faceNetService;
  }

  FaceNetService._internal();

  // * import Database Service
  final DatabaseService _databaseService = DatabaseService();
  Interpreter _interpreter;
  double threshold = 1.0;
  List _predictedData;
  List get predictedData => _predictedData;
  dynamic data = {};

  /// load data model from device
  Future loadModel() async {
    Delegate delegate;
    var interpreterOptions;
    try {
      if (Platform.isAndroid) {
        delegate = GpuDelegateV2(
            options: GpuDelegateOptionsV2(
          false,
          TfLiteGpuInferenceUsage.fastSingleAnswer,
          TfLiteGpuInferencePriority.minLatency,
          TfLiteGpuInferencePriority.auto,
          TfLiteGpuInferencePriority.auto,
        ));
        interpreterOptions = InterpreterOptions()..addDelegate(delegate);
      } else if (Platform.isIOS) {
        delegate = GpuDelegate(
          options: GpuDelegateOptions(true, TFLGpuDelegateWaitType.active),
        );
        interpreterOptions = InterpreterOptions()..addDelegate(delegate);
      }

      _interpreter = await Interpreter.fromAsset('mobilefacenet.tflite',
          options: interpreterOptions);
      print('model loaded successfully');
    } catch (e) {
      print('Failed to load model.');
      print(e);
    }
  }

  /// pre process like crops face iimages to array data before matching recognition
  List _preProcess(CameraImage image, Face faceDetected) {
    // crops the face 💇
    imglib.Image croppedImage = _cropFace(image, faceDetected);
    imglib.Image img = imglib.copyResizeCropSquare(croppedImage, 112);

    // transforms the cropped face to array data
    Float32List imageAsList = imageToByteListFloat32(img);
    return imageAsList;
  }

  /// process crop the image faces from the image and transform to an array
  setCurrentPrediction(CameraImage cameraImage, Face face) {
    List input = _preProcess(cameraImage, face);
    List output = List.generate(1, (index) => List.filled(192, 0));

    /// then reshapes input and ouput to model format 🧑‍🔧
    input = input.reshape([1, 112, 112, 3]);
    output = output.reshape([192]);

    /// runs and transforms the data 🤖
    _interpreter.run(input, output);
    _predictedData = List.from(output);
  }

  /// takes the predicted data previously saved and do inference
  String? predict() {
    /// search closer user prediction if exists
    return _searchResult(_predictedData);
  }

  /// crops the face from the image 💇
  imglib.Image _cropFace(CameraImage image, Face faceDetected) {
    imglib.Image convertedImage = _convertCameraImage(image);
    double x = faceDetected.boundingBox.left - 10.0;
    double y = faceDetected.boundingBox.top - 10.0;
    double w = faceDetected.boundingBox.width + 10.0;
    double h = faceDetected.boundingBox.height + 10.0;
    return imglib.copyCrop(
        convertedImage, x.round(), y.round(), w.round(), h.round());
  }

  imglib.Image _convertCameraImage(CameraImage image) {
    var img = convertToImage(image);
    var img1 = imglib.copyRotate(img!, -90);
    return img1;
  }

  Float32List imageToByteListFloat32(imglib.Image image) {
    /// input size = 112
    var convertedBytes = Float32List(1 * 112 * 112 * 3);
    var buffer = Float32List.view(convertedBytes.buffer);
    int pixelIndex = 0;

    for (var i = 0; i < 112; i++) {
      for (var j = 0; j < 112; j++) {
        var pixel = image.getPixel(j, i);

        /// mean: 128
        /// std: 128
        buffer[pixelIndex++] = (imglib.getRed(pixel) - 128) / 128;
        buffer[pixelIndex++] = (imglib.getGreen(pixel) - 128) / 128;
        buffer[pixelIndex++] = (imglib.getBlue(pixel) - 128) / 128;
      }
    }
    return convertedBytes.buffer.asFloat32List();
  }

  String? _searchResult(List predictedData) {
    Map<String, dynamic> data = _databaseService.db;

    /// if no faces saved
    if (data.isEmpty) return null;
    double minDist = 999;
    double currDist = 0.0;
    String predRes;

    /// search the closest result 👓
    for (String label in data.keys) {
      currDist = _euclideanDistance(data[label], predictedData);
      if (currDist <= threshold && currDist < minDist) {
        minDist = currDist;
        predRes = label;
        return predRes;
      }
    }
  }

  /// add and configure the method
  /// Adds the power of the difference between each point
  /// then computes the sqrt of the result 📐
  double _euclideanDistance(List e1, List e2) {
    if (e1 == null || e2 == null) throw Exception("Null argument");

    double sum = 0.0;
    for (int i = 0; i < e1.length; i++) {
      sum += pow((e1[i] - e2[i]), 2);
    }
    return sqrt(sum);
  }

  void setPredictedData(value) {
    _predictedData = value;
  }
}
