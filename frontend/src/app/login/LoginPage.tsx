"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useIsMounted } from "usehooks-ts";

import { useUserGetMe } from "@/apis/services/user/useUserService";
import { customRevalidateTag } from "@/lib/serverActions";

type Props = {
  code?: string;
  accessToken?: string;
  redirectUrl?: string;
};

const LOGIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_AUTH_URL ||
      "http://localhost:3001/api/auth/google/login"
    : "https://api-habbits.bamtoly.com/api/auth/google/login";

const ClientLoginPage = ({ accessToken, code, redirectUrl }: Props) => {
  const { replace } = useRouter();
  const isMount = useIsMounted();
  useUserGetMe();

  const handleAuthentication = useCallback(async () => {
    try {
      await customRevalidateTag("user");
      replace(redirectUrl ?? "/");
    } catch (error) {
      console.error("Authentication error:", error);
      // You could set an error state here or show a notification
    }
  }, [redirectUrl, replace]);

  const redirectToLogin = useCallback(() => {
    replace(LOGIN_URL);
  }, [replace]);

  useEffect(() => {
    if (!isMount()) return;
    if (accessToken && code) {
      handleAuthentication();
    } else if (!accessToken && !code) {
      redirectToLogin();
    }
  }, [
    accessToken,
    code,
    redirectUrl,
    isMount,
    replace,
    handleAuthentication,
    redirectToLogin,
  ]);

  return (
    <main className="flex size-full min-h-[calc(100vh-60px)] items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image
          width={128}
          height={128}
          alt="플라워"
          src={process.env.NEXT_PUBLIC_DEFAULT_IMAGE!}
          className="size-32"
        />
        <div className="flex flex-col items-center justify-center">
          <span className="text-grey-800 text-lg font-semibold">로딩중</span>
          <span className="text-grey-700 text-sm">잠시만 기다려주세요 :)</span>
        </div>
      </div>
    </main>
  );
};

export default ClientLoginPage;
