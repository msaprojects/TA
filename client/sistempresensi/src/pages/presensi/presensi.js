import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, createMatcher } from '../components/face';
import DrawBox from './drawBox';
import { JSON_PROFILE } from './profile';

import axios from '../../utils/server'
import swal from 'sweetalert'

const WIDTH = 1024;
const HEIGHT = 780;
const inputSize = 320;

class PresensiWebcam extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      faceMatcher: null,
      facingMode: null
    };
  }

  componentWillMount() {
    loadModels();
    this.setInputDevice();
    this.matcher();
  }

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 'user'
        });
      } else {
        await this.setState({
          facingMode: { exact: 'environment' }
        });
      }
      this.startCapture();
    });
  };

  matcher = async () => {
    const faceMatcher = await createMatcher(JSON_PROFILE);
    // console.log('data', faceMatcher.)
    this.setState({ faceMatcher });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(fullDesc => {
        this.setState({ fullDesc })
      });
    }
  };

  render() {
    const { fullDesc, faceMatcher, facingMode } = this.state;
    let videoConstraints = null;
    let camera = '';
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
      if (facingMode === 'user') {
        camera = 'Front';
      } else {
        camera = 'Back';
      }
    }


    return (
      <div>
        <div className='h-screen w-screen flex bg-slate-800'>
          <div className='columns'>
            <h1 className='text-white items-center items-center'>GRAB YOUR {camera} FACE HERE!</h1>
            <div className='flex'>
              {/* <div style={{ position: 'absolute', width: WIDTH }}> */}
              {!!videoConstraints ? (
                <div style={{ position: 'absolute' }}>
                  <Webcam
                    style={{ borderRadius: '25px' }}
                    audio={false}
                    width={WIDTH}
                    height={HEIGHT}
                    ref={this.webcam}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                  />
                </div>
              ) : null}
              {!!fullDesc ? (
                // this.presensiHandler(match[i]._label.split(' - ')[1]);
                <DrawBox
                  fullDesc={fullDesc}
                  faceMatcher={faceMatcher}
                  imageWidth={WIDTH}
                  boxColor={'blue'}
                />
              ) : null}
            </div>
            {/* </div> */}
          </div>
          {/* <div
        className="Camera"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      > */}
          {/* <p>Camera: {camera}</p>
        <div
          style={{
            width: WIDTH,
            height: HEIGHT
          }}
        >
          <div style={{ position: 'relative', width: WIDTH }}>
            {!!videoConstraints ? (
              <div style={{ position: 'absolute' }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {!!fullDesc ? (
              <DrawBox
                fullDesc={fullDesc}
                faceMatcher={faceMatcher}
                imageWidth={WIDTH}
                boxColor={'blue'}
              />
            ) : null}
          </div>
        </div> */}
        </div>
      </div>
    );
  }
}

export default (PresensiWebcam);
