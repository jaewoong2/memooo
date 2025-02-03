"use client";

import { useQueryClient } from "@tanstack/react-query";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useIsMounted } from "usehooks-ts";

import { customRevalidateTag } from "@/lib/serverActions";

const LogoutPage = () => {
  const isMounted = useIsMounted();
  const queryClient = useQueryClient();
  const router = useRouter();
  const redirectUrl = useSearchParams().get("redirectUrl");

  const invalidateUserQuery = useCallback(async () => {
    await customRevalidateTag("user");
    await queryClient.resetQueries({ queryKey: ["getUser"] });
    redirectUrl ? router.push(redirectUrl) : router.push("/");
  }, [queryClient, redirectUrl, router]);

  useEffect(() => {
    if (!isMounted()) return;
    invalidateUserQuery();
  }, [queryClient, router, invalidateUserQuery, isMounted]);

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

export default LogoutPage;
