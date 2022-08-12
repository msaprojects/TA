import * as faceapi from 'face-api.js';

const maxDescriptorDistance = 0.5;

export async function loadModels() {
  const MODEL_URL = process.env.PUBLIC_URL + '/models';
  // Promise.all([
  //   faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),    
  //   faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),    
  //   faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),    
  // ]).catch((error)=>{
  //   console.log(error)
  // })
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
  await faceapi.loadFaceExpressionModel(MODEL_URL);
}

export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  let scoreThreshold = 0.8;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold
  });
  const useTinyModel = true;

  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors().withFaceExpressions();
  return fullDesc;
}

export async function createMatcher(faceProfile) {
  console.log('hehe', faceProfile)
  // Create labeled descriptors of member from profile
  let members = Object.keys(faceProfile);

  console.log('member?', members)
  let labeledDescriptors = members.map(
    member =>
      // {
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map(
          descriptor => new Float32Array(descriptor)
        )
      )
      
    // }
  );

  // Create face matcher (maximum descriptor distance is 0.8)
  let faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance
  );
  return faceMatcher;
}

export function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.tinyFaceDetector.params;
}
