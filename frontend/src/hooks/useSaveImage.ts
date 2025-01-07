// Implement useSaveImage Hooks On Current Device (Mobile, Desktop, Tablet...)
import { useEffect, useState } from 'react';

// Utility to detect the device type
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobi/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

// Hook implementation
export const useSaveImage = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const type = getDeviceType();
    setDeviceType(type);
  }, []);

  const saveImage = (imageUrl?: string, filename?: string) => {
    if (!imageUrl || !filename) {
      return;
    }

    // Create an anchor element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    link.referrerPolicy = 'no-referrer';

    // Trigger download for desktop or tablet
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { saveImage, deviceType };
};
