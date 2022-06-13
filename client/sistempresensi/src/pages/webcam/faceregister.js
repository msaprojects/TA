import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import Nav from '../components/Navbar';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const FaceRegister = (e) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [linkgambar, setlinkgambar] = useState('');
    
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        
        console.log('xxx',imageSrc, '--', imageSrc.toDataURL())
      getBase64(imageSrc).then(base64 => {
        localStorage["fileBase64"] = base64;
        console.debug("file stored",base64);
        setImgSrc(base64);
      });
    

        setlinkgambar(URL.createObjectURL(imageSrc))
    }, [webcamRef, setImgSrc]);

    const getBase64 = (file) => {
        return new Promise((resolve,reject) => {
           const reader = new FileReader();
           reader.onload = () => resolve(reader.result);
           reader.onerror = error => reject(error);
           reader.readAsDataURL(file);
        });
      }

    return (
        <>
            {/* /// import navigation */}
            <Nav />
            {/* /// put code of dashboard component here! */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Capture Wajah</h1>
                </div>
            </header>
            <main>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                />
                <button onClick={capture}>Capture photo</button>
                {imgSrc && (
                    <img src={imgSrc} />
                )}
            </main>
        </>
    );
}

export default FaceRegister;
