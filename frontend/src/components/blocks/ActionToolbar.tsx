"use client";

import { PlusIcon, CameraIcon, FolderIcon, LoaderIcon } from "lucide-react";
import React, {
  createContext,
  useContext,
  ReactNode,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserGetMe } from "@/apis/services/user/useUserService";
import { useUploadImageMutation } from "@/apis/services/image/useImageService";
import { useOpenAiImageToText } from "@/apis/services/openai/useOpenAiService";
import FileCaptureInput from "@/components/atoms/FileCaptureInput";
import { User } from "@/apis/type";
import { cn } from "@/lib/utils";
import { ButtonProps } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

// Context 정의
interface ActionToolbarContextProps {
  user?: User | null;
  uploadImage: ReturnType<typeof useUploadImageMutation>;
  imageToText: ReturnType<typeof useOpenAiImageToText>;
  router: ReturnType<typeof useRouter>;
  isLoading: boolean;
  handleFileChange: (file: File | null) => Promise<void>;
}

const ActionToolbarContext = createContext<
  ActionToolbarContextProps | undefined
>(undefined);

type Props = {
  children:
    | React.ReactNode
    | (({ isLoading }: { isLoading?: boolean }) => React.ReactNode);
};

// 부모 컴포넌트
const ActionToolbar = ({ children }: Props) => {
  const { data: user } = useUserGetMe();
  const uploadImage = useUploadImageMutation();
  const imageToText = useOpenAiImageToText();
  const router = useRouter();
  const toast = useToast();
  const currentToast = useRef<ReturnType<typeof toast.toast>>();

  const isLoading =
    uploadImage.status === "pending" || imageToText.status === "pending";

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    try {
      const { data: image } = await uploadImage.mutateAsync({ file });

      if (!image?.url) {
        console.error("이미지 업로드 실패");
        return;
      }

      const { data } = await imageToText.mutateAsync({ imageUrl: image.url });

      if (!data.content) {
        console.error("이미지에서 텍스트 변환 실패");
        return;
      }

      router.replace(`/n?imageUrl=${encodeURIComponent(image.url)}`);
    } catch (error) {
      console.error("파일 처리 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    if (!isLoading && currentToast.current) {
      setTimeout(() => {
        toast.dismiss(currentToast.current?.id);
      }, 0);
    }

    if (!isLoading) {
      return;
    }

    if (currentToast.current) return;

    setTimeout(() => {
      currentToast.current = toast.toast({
        className: cn(
          "fixed top-4 left-[50%] z-[100] flex w-fit translate-x-[-50%]",
          "data-[state=open]:sm:slide-in-from-top-0 data-[state=open]:sm:slide-in-from-right-0",
        ),
        title: "이미지 업로드 중입니다.",
        description:
          "이미지 업로드가 완료되면 자동으로 텍스트 추출을 시작합니다.",
        duration: Infinity,
        variant: "default",
      });
    }, 0);
  }, [isLoading]);

  return (
    <ActionToolbarContext.Provider
      value={{
        user: user?.data,
        uploadImage,
        imageToText,
        router,
        isLoading,
        handleFileChange,
      }}
    >
      {typeof children === "function" && children({ isLoading })}
      {typeof children !== "function" && children}
    </ActionToolbarContext.Provider>
  );
};

// 자식 컴포넌트: 버튼의 공통 속성 정의
interface ToolbarButtonProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children }: PropsWithChildren) => {
  const context = useContext(ActionToolbarContext);
  if (!context)
    throw new Error("CameraButton must be used within an ActionToolbar");

  const { isLoading } = context;

  return (
    <>
      {isLoading && (
        <div className="fixed left-0 top-0 w-screen h-screen z-[99999] justify-center items-start flex bg-secondary/20">
          <LoaderIcon className="w-6 h-6 animate-spin mt-20" />
        </div>
      )}
      <div className="h-[65px] sticky bottom-4 w-full z-10 flex justify-center">
        <div className="border border-primary bg-primary-foreground grid items-center grid-cols-3 w-[240px] h-[65px] rounded-[50px_50px] shadow-xl shadow-black/60">
          {children}
        </div>
      </div>
    </>
  );
};

// 일반 버튼 컴포넌트
const Button = ({
  children,
  href,
  className,
}: ToolbarButtonProps & { href?: string }) => {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          `w-full h-full flex justify-center items-center`,
          className,
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cn(
        `w-full h-full flex justify-center items-center`,
        className,
      )}
    >
      {children}
    </button>
  );
};

// Camera 버튼 컴포넌트
const CameraButton = ({
  className,
  children,
}: ToolbarButtonProps | JSX.IntrinsicElements["input"]) => {
  const context = useContext(ActionToolbarContext);
  if (!context)
    throw new Error("CameraButton must be used within an ActionToolbar");

  const { user, handleFileChange, isLoading } = context;

  return !user?.id ? (
    <Button
      href="/auth"
      className={cn(
        "mx-auto p-0 cursor-pointer shadow-gray-600 hover:opacity-80 transition-opacity shadow-sm text-background h-[50px] rounded-full flex justify-center items-center bg-primary w-auto aspect-square",
        className,
      )}
    >
      <CameraIcon />
      {children}
    </Button>
  ) : (
    <FileCaptureInput
      type="file"
      capture="environment"
      accept="image/*"
      onFileChange={handleFileChange}
      className={cn(
        "mx-auto p-0 cursor-pointer shadow-gray-600 hover:opacity-80 transition-opacity shadow-sm text-background h-[50px] rounded-full flex justify-center items-center bg-primary w-auto aspect-square",
        className,
      )}
      readOnly={isLoading}
      disabled={isLoading}
    >
      <CameraIcon />
      {children}
    </FileCaptureInput>
  );
};

// Folder 버튼 컴포넌트
const FolderButton = ({
  className,
  ...props
}: ToolbarButtonProps | JSX.IntrinsicElements["input"]) => {
  const context = useContext(ActionToolbarContext);
  if (!context)
    throw new Error("FolderButton must be used within an ActionToolbar");

  const currentPath = usePathname();
  const { user, handleFileChange } = context;

  return !user?.id ? (
    <Button
      href={`/auth?redirectUrl=${currentPath}`}
      className={cn(
        "w-full cursor-pointer br h-full flex justify-center items-center",
        className,
      )}
      {...props}
    >
      <FolderIcon />
    </Button>
  ) : (
    <FileCaptureInput
      type="file"
      capture="environment"
      accept="image/*"
      onFileChange={handleFileChange}
      className={cn(
        "w-full cursor-pointer br h-full flex justify-center items-center",
        className,
      )}
      {...props}
    >
      <FolderIcon />
    </FileCaptureInput>
  );
};

// Plus 버튼 컴포넌트
const PlusButton = ({ className, ...props }: ButtonProps) => {
  return (
    <Button href="/habbit" className={cn("col-span-1", className)} {...props}>
      <PlusIcon />
    </Button>
  );
};

// Sub-components을 부모 컴포넌트에 할당
ActionToolbar.Layout = Layout;
ActionToolbar.Button = Button;
ActionToolbar.CameraButton = CameraButton;
ActionToolbar.FolderButton = FolderButton;
ActionToolbar.PlusButton = PlusButton;

export default ActionToolbar;
