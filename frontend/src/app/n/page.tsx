import TaskForm from "@/components/blocks/TaskForm";
import { PageProps } from "@/lib/type";
import React from "react";

type Props = {
  imageUrl?: string;
};

const NotionIntegration = async ({ searchParams }: PageProps) => {
  const { imageUrl } = await searchParams;

  return (
    <section className="container mx-auto px-4">
      <TaskForm imageUrl={imageUrl} />
    </section>
  );
};

export default NotionIntegration;
