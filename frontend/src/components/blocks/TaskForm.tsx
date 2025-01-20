"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { CheckBoxForm } from "./CheckboxForm";
import { SelectForm } from "./SelectForm";
import { Button } from "../ui/button";

const TaskSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  database: z.object(
    {
      id: z.string(),
      name: z.string(),
      url: z.string(),
    },
    {
      required_error: "데이터베이스를 골라주세요.",
    },
  ),
});

type TaskFormData = z.infer<typeof TaskSchema>;

const TaskForm = () => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: { items: ["recents", "home"], database: {} },
  });

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-2">
        <SelectForm
          header={{
            label: "데이터베이스",
            description: "오늘 기록을 저장할 데이터베이스를 선택 해주세요",
          }}
          databases={[
            {
              name: "Habits",
              url: "https://www.notion.so/17d944d0c7218121a61fe750a263ee1d",
              id: "17d944d0-c721-8121-a61f-e750a263ee1d",
            },
          ]}
        />
        <CheckBoxForm
          header={{
            label: "기록",
            description: "기록을 선택해서 동기화 해요",
          }}
          items={[
            {
              id: "123",
              label: "123",
            },
            { id: "1234", label: "1235" },
            {
              id: "12345",
              label: "1235",
            },
          ]}
        />
        <Button
          type="submit"
          className="shadow-none rounded-lg py-6 hover:opacity-80 hover:bg-background"
          variant={"outline"}
        >
          저장하기
        </Button>
      </form>
    </FormProvider>
  );
};

export default TaskForm;
