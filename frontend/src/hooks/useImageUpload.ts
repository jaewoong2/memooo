import { useCallback } from 'react';

import { useUploadImageMutation } from '@/apis/services/image/useImageService';

export const useImageUpload = () => {
  const { mutate, ...rest } = useUploadImageMutation();

  const uploadImage = useCallback(
    async (file: File | null) => {
      if (!file) {
        return;
      }

      try {
        mutate({ file });
      } catch (error) {
        console.error('Upload error:', error);
      }
    },
    [mutate]
  );

  return { uploadImage, ...rest };
};
