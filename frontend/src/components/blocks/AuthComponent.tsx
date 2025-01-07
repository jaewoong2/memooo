'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useIsMounted } from 'usehooks-ts';

import { User } from '@/atoms/types';

import withAuth from '../hoc/withAuth';

type Props = {
  user: User | null;
};

const AuthComponent = ({ user }: Props) => {
  const searchParmas = useSearchParams();
  const navigation = useRouter();
  const redirectUrl = searchParmas.get('redirectUrl');
  const isMounted = useIsMounted();

  useEffect(() => {
    if (user && redirectUrl && isMounted()) {
      navigation.replace(redirectUrl);
    }
  }, [redirectUrl, navigation, user, isMounted]);

  return null;
};

export default withAuth(AuthComponent, { isCreator: true });
