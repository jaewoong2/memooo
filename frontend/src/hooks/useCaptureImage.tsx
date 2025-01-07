import { useCallback, useState } from 'react';

// Custom Hook: useCaptureImage
export const useCaptureImage = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const captureImage = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('이 기기에서는 카메라 기능을 사용할 수 없습니다.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.play();

      const canvas = document.createElement('canvas');
      document.body.appendChild(videoElement); // 화면에 비디오 추가
      setTimeout(() => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const imageDataUrl = canvas.toDataURL('image/png');
          setCapturedImage(imageDataUrl);
        }
        videoElement.pause();
        stream.getTracks().forEach((track) => track.stop());
        videoElement.remove();
      }, 3000); // 3초 후 이미지 캡처
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  return { capturedImage, captureImage };
};
