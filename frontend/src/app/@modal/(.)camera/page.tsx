'use client';

import React from 'react';
import { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';

const CamaeraPage = () => {
  const camera = useRef<any>(null);
  const [image, setImage] = useState(null);

  return (
    <div>
      {!image && <Camera ref={camera} errorMessages={{}} aspectRatio={16 / 9} />}
      <button className='fixed bottom-10 z-10' onClick={() => setImage(camera.current?.takePhoto())}>
        Take photo
      </button>
      {image && <img src={image} alt='Taken photo' />}
      <button
        onClick={() => {
          camera.current.switchCamera();
        }}
      >
        변경
      </button>
    </div>
  );
};

export default CamaeraPage;
