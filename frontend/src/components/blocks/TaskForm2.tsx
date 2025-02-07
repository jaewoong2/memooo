"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { CheckBoxForm } from "./CheckboxForm";
import { SelectForm } from "./SelectForm";
import { Button, buttonVariants } from "../ui/button";
import {
  useGetDatabase,
  useGetDatabases,
  usePostCreatePage,
} from "@/apis/services/integration/useIntegrationService";
import { useGetAiResponse } from "@/apis/services/openai/useOpenAiService";
import { cn, transformToBoolean } from "@/lib/utils";
import { Label } from "../ui/label";
import { NotionLogoIcon } from "@radix-ui/react-icons";
import ActionToolbar from "./ActionToolbar";
import ImageWithBackground from "../ui/image-bg";
import Link from "next/link";
import { XCircleIcon } from "lucide-react";
import DateForm from "./DateForm";
import dayjs from "dayjs";

enum ITEM_STATUS {
  ORIGIN = "ORIGIN",
  UPDATED = "UPDATED",
}

const ItemSchema = z.object({
  name: z.string(),
  checked: z.boolean(),
  id: z.string().or(z.number()),
  status: z.nativeEnum(ITEM_STATUS),
  type: z.string().optional(),
});

const TaskSchema = z.object({
  items: z.array(ItemSchema),
  database: z.string({
    required_error: "데이터베이스를 골라주세요.",
  }),
  date: z.string(),
});

type TaskFormData = z.infer<typeof TaskSchema>;

type Props = {
  imageUrl?: string;
};

const TaskForm = ({ imageUrl }: Props) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: { items: [], database: "", date: "" },
  });

  const { data: ai } = useGetAiResponse(
    { imageUrl },
    { enabled: transformToBoolean(imageUrl), staleTime: 0 },
  );
  const { data: databases } = useGetDatabases();
  const { data: database } = useGetDatabase(form.getValues("database"), {
    enabled: transformToBoolean(form.getValues("database")),
    staleTime: 0,
  });

  const createPage = usePostCreatePage();

  const onSubmitForm: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data = form.getValues();

    createPage.mutate({
      databaseId: data.database,
      checkboxes: data.items.map((item) => ({ ...item, checked: true })),
      pageTitle: `${dayjs(data.date).format("YYYY-MM-DD")}`,
      createdTime: new Date().toString(),
    });
  };

  const properties = useMemo(() => {
    const databaseProperty =
      database?.data?.properties.map((property) => {
        return {
          ...property,
          checked: false,
          status: ITEM_STATUS.ORIGIN,
        };
      }) ?? [];

    const newProperty =
      ai?.data?.contents?.habits.map((content) => ({
        id: `${Math.random()}`,
        name: content.name,
        checked: content.checked,
        type: "checkbox",
        status: ITEM_STATUS.UPDATED,
      })) ?? [];

    return [...newProperty, ...databaseProperty];
  }, [database, ai]);

  useEffect(() => {
    form.setValue("items", [...form.getValues("items"), ...properties]);

    if (ai?.data?.contents.date) {
      form.setValue("date", `${ai.data.contents.date}`);
    }
  }, [ai?.data?.contents.date, form, properties]);

  useEffect(() => {
    if (!ai?.data) {
      form.reset();
    }
  }, [ai?.data, database?.data, databases?.data, form]);

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-2 pb-10" onSubmit={onSubmitForm}>
        <div className="bg-background rounded-xl p-6 border ">
          <Label className="text-base">사진 등록하기</Label>
          <p className="text-[0.8rem] text-muted-foreground flex gap-1 items-center">
            <NotionLogoIcon /> 사진을 등록하고 동기화 해요
          </p>
          {imageUrl ? (
            <div className="relative">
              <div className="relative w-auto h-[160px] overflow-hidden border rounded-lg mt-4">
                <ImageWithBackground
                  as="link"
                  src={imageUrl}
                  alt={"이미지"}
                  fill
                  className="object-center object-cover p-2 hover:scale-105 transition-transform duration-50"
                />
              </div>
              <Link href={"/n"} className="absolute -right-2 -top-2">
                <XCircleIcon className="fill-white text-primary" />
              </Link>
            </div>
          ) : (
            <ActionToolbar>
              {({ isLoading }) => (
                <ActionToolbar.CameraButton
                  className={buttonVariants({
                    variant: "outline",
                    className: cn(
                      "w-full px-6 h-[120px] border justify-center shadow-none rounded-lg text-foreground",
                      "flex-col gap-0",
                      isLoading && "animate-pulse bg-secondary",
                    ),
                  })}
                >
                  {isLoading ? (
                    <span className="text-sm">로딩중...</span>
                  ) : (
                    <span className="text-sm">사진을 등록해주세요</span>
                  )}
                </ActionToolbar.CameraButton>
              )}
            </ActionToolbar>
          )}
        </div>
        <div className="text-base flex items-center gap-4">
          <div className="whitespace-nowrap flex">
            <DateForm /> {"\b"} 에 진행한 기록이에요
          </div>
          <div className="w-full h-[1px] bg-muted" />
        </div>
        {imageUrl && (
          <SelectForm
            header={{
              label: "데이터베이스",
              description: "기록을 저장할 데이터베이스를 선택 해주세요",
            }}
            databases={databases?.data ?? []}
          />
        )}
        {database?.data && (
          <CheckBoxForm
            header={{
              label: "기록",
              description: "기록을 선택해서 동기화 해요",
            }}
            items={properties}
          />
        )}
        {database?.data && (
          <Button
            type="submit"
            className="shadow-none rounded-lg py-6 hover:opacity-80 hover:bg-background"
            variant={"outline"}
          >
            기록하기
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default TaskForm;
