import React, { PropsWithChildren, useState } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  onFileChange: (file: File | null) => void;
  children?: React.ReactNode | ((file?: File | null) => React.ReactNode);
}

const FileInput = ({
  onFileChange,
  children,
  className,
  ...props
}: PropsWithChildren<Props & JSX.IntrinsicElements['input']>) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0] || null;
    onFileChange(targetFile);
    setFile(targetFile);
  };

  return (
    <label>
      {typeof children === 'function' ? children(file) : children}
      <input
        type='file'
        capture='environment'
        accept='image/*'
        className={cn('hidden', className)}
        onChange={handleFileChange}
        {...props}
      />
    </label>
  );
};

export default FileInput;
