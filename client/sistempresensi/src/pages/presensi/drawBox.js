import React, { Component } from 'react';
import axios from '../../utils/server'
import swal from 'sweetalert'

class DrawBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptors: null,
      detections: null,
      match: null,
      expression: null
    };
  }


  componentDidMount() {
    this.getDescription();
  }

  componentWillReceiveProps(newProps) {
    this.getDescription(newProps);
  }

  getDescription = async (props = this.props) => {
    const { fullDesc, faceMatcher } = props;
    if (!!fullDesc) {
      
      await this.setState({
        descriptors: fullDesc.map(fd => fd.descriptor),
        detections: fullDesc.map(fd => fd.detection),
        expression: fullDesc.map(fd => fd.expressions)
      });
      if (!!this.state.descriptors && !!faceMatcher) {
        let match = await this.state.descriptors.map(descriptor =>
          faceMatcher.findBestMatch(descriptor)
        );
        this.setState({ match });
      }
      // console.log('data deskriptoe:'+this.state.descriptors)
    }
  };

  presensiHandler = async (e) => {
    // console.log(e)
    // e.preventDefault();
    /// setting value post
    const presensiData = {
      latitude: '0',
      longitude: '0',
      device: 'Site',
      idpengguna: e,
      idtugas: '0'
    }
    console.log(presensiData)
    await axios.post('presensi', presensiData, {
      headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
    }).then((response) => {
      console.log(response)
      swal(`${response.data.message}`, {
        icon: "success",timer: 2000
      });
    }).catch((error) => {
      swal(`Sorry! ${error}`, {
        icon: "error",
      });
    })
  }

  render() {
    const { imageWidth, boxColor } = this.props;
    const { detections, match } = this.state;
    let box = null;

    if (!!detections) {


      box = detections.map((detection, i) => {

        const relativeBox = detection.relativeBox;
        const dimension = detection._imageDims;
        let _X = imageWidth * relativeBox._x;
        let _Y =
          (relativeBox._y * imageWidth * dimension._height) / dimension._width;
        let _W = imageWidth * relativeBox.width;
        let _H =
          (relativeBox.height * imageWidth * dimension._height) /
          dimension._width;

        if (this.state.expression[0].happy >= 0.8) {
          this.presensiHandler(this.state.match[i]._label.split(' - ')[1])
        }
        return (
          <div key={i}>

            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: boxColor,
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`
              }}
            >
              {!!match && match[i] && match[i]._label !== 'unknown' ? (
                <p
                  style={{
                    backgroundColor: boxColor,
                    border: 'solid',
                    borderColor: boxColor,
                    width: _W,
                    marginTop: 0,
                    color: '#fff',
                    transform: `translate(-3px,${_H}px)`
                  }}
                >
                  {this.state.expression[0].happy >= 0.7 ? 'Terima Kasih telah senyum ' + match[i]._label.split(' - ')[0] : `Senyum Dong ${match[i]._label.split(' - ')[0]}!`}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    return <div>{box}</div>;
  }
}

export default DrawBox;
