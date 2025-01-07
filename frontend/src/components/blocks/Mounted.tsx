import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useIsMounted } from 'usehooks-ts';

type Props = {
  children: (options: { isMounted: boolean; isViewEnter: boolean }) => React.ReactNode;
};

const Mounted = ({ children }: Props) => {
  const isMounted = useIsMounted();
  const [isViewEnter, setIsViewEnter] = useState(false);

  return (
    <>
      <motion.div
        className='absolute left-1/2 top-1/2 h-1 w-1 bg-transparent'
        onViewportLeave={() => setIsViewEnter(false)}
        onViewportEnter={() => setIsViewEnter(true)}
      />
      {children({ isMounted: isMounted(), isViewEnter })}
    </>
  );
};

export default Mounted;
