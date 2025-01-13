"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useUserGetMe } from "@/apis/services/user/useUserService";

import LoginModal from "../blocks/LoginModal";

function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    isCreator?: boolean;
  },
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

    useEffect(() => {
      if (user?.data?.id) {
        setIsDialogOpen(false);
      }
    }, [user]);

    return isDialogOpen ? (
      <LoginModal
        title={"로그인"}
        description={"습관을 만들러 가봐요"}
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
