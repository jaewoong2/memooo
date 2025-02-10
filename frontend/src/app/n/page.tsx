import Greeting from "@/components/blocks/Greeting";
import TaskForm from "@/components/blocks/TaskForm";
import { PageProps } from "@/lib/type";
import React from "react";

type Props = {
  imageUrl?: string;
};

const NotionIntegration = async ({ searchParams }: PageProps) => {
  const { imageUrl } = await searchParams;

  return (
    <div className="container mx-auto max-w-[784px]">
      <Greeting />
      <main className="flex flex-col items-center justify-center relative z-10 px-4 py-6">
        <div className="w-full flex flex-col gap-2">
          <TaskForm imageUrl={imageUrl} />
        </div>
      </main>
    </div>
  );
};

export default NotionIntegration;
