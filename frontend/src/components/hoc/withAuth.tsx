'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useUserGetMe } from '@/apis/services/user/useUserService';

import LoginModal from '../blocks/LoginModal';

function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    isCreator?: boolean;
  }
) {
  const Component = (props: P) => {
    const { back, push } = useRouter();
    const { data: user } = useUserGetMe({ staleTime: 0, gcTime: 0 });
    const [isDialogOpen, setIsDialogOpen] = useState(true);

    const onOpenChange = (isOpen: boolean, redirectUrl?: string | null) => {
      setIsDialogOpen(isOpen);
      if (!isOpen) {
        redirectUrl ? push(redirectUrl) : back();
      }
    };

    return isDialogOpen ? (
      <LoginModal
        title={options?.isCreator ? '로그인' : '이벤트 참여하기'}
        description={
          options?.isCreator ? '서비스 이용을 위해 로그인해 주세요' : '즐거운 이벤트 참여를 위해 등록해 주세요'
        }
        isApply={options?.isCreator}
        isOpen={isDialogOpen}
        onOpenChange={onOpenChange}
      />
    ) : (
      <WrappedComponent {...props} user={user} />
    );
  };

  return Component;
}

export default withAuth;
