import { useCallback, useState } from 'react';

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  }, []);

  return { selectedFile, handleFileChange };
};
