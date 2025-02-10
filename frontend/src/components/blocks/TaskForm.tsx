"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetDatabase,
  useGetDatabases,
  usePostCreatePage,
} from "@/apis/services/integration/useIntegrationService";
import { useGetAiResponse } from "@/apis/services/openai/useOpenAiService";
import { cn, transformToBoolean } from "@/lib/utils";
import dayjs from "dayjs";
import { z } from "zod";
import { OpenAiFindResponseResponse } from "@/apis/services/openai/type";
import {
  GetDatabaseResponse,
  GetDatabaseResponses,
} from "@/apis/services/integration/type";
import { DefaultResponse } from "@/lib/type";
import ImageWithBackground from "../ui/image-bg";
import Link from "next/link";
import { XIcon } from "lucide-react";
import ActionToolbar from "./ActionToolbar";
import { Button, ButtonProps, buttonVariants } from "../ui/button";
import DateForm from "./DateForm";
import { SelectForm } from "./SelectForm";
import { CheckBoxForm } from "./CheckboxForm";
import { Label } from "../ui/label";
import { NotionLogoIcon } from "@radix-ui/react-icons";

enum ITEM_STATUS {
  ADD = "ADD",
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
  items: z.array(ItemSchema).nullable(),
  database: z
    .string({
      required_error: "데이터베이스를 골라주세요.",
    })
    .nullable(),
  date: z.string().nullable(),
});

type TaskFormData = z.infer<typeof TaskSchema>;

interface TaskFormContextProps extends UseFormReturn<TaskFormData> {
  aiData?: DefaultResponse<OpenAiFindResponseResponse | null>;
  databases?: DefaultResponse<GetDatabaseResponses | null>;
  database?: DefaultResponse<GetDatabaseResponse | null>;
  properties: TaskFormData["items"];
  onSubmitForm: React.FormEventHandler<HTMLFormElement>;
  imageUrl?: string;
  onClickDeleteButton: React.MouseEventHandler<HTMLButtonElement>;
  onClickAddButton?: React.MouseEventHandler<HTMLButtonElement>;
  onChangeItemName?: (
    itemId: string | number,
  ) => React.ChangeEventHandler<HTMLInputElement>;

  onClickCheckbox?: (itemId: string | number) => void;
}

const TaskFormContext = createContext<TaskFormContextProps | undefined>(
  undefined,
);

export const useTaskForm = (): TaskFormContextProps => {
  const context = useContext(TaskFormContext);
  if (!context) {
    throw new Error("useTaskForm must be used within a TaskFormProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
  imageUrl?: string;
}

export const TaskFormProvider = ({ children, imageUrl }: Props) => {
  const formMethods = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: { items: null, database: null, date: null },
  });

  const databaseId = formMethods.getValues("database");

  const { data: ai } = useGetAiResponse(
    { imageUrl },
    { enabled: transformToBoolean(imageUrl), staleTime: 0 },
  );
  const { data: databases } = useGetDatabases();
  const { data: database } = useGetDatabase(databaseId!, {
    enabled: transformToBoolean(databaseId),
    staleTime: 0,
  });

  const [properties, setProperties] = useState<
    z.infer<typeof ItemSchema>[] | null
  >(null);

  const createPage = usePostCreatePage();

  const onClickAddButton: React.MouseEventHandler<HTMLButtonElement> = () => {
    setProperties((prev) => {
      if (!prev) return prev;
      return [
        {
          id: `${Math.random()}`,
          name: "",
          checked: false,
          type: "checkbox",
          status: ITEM_STATUS.ADD,
        },
        ...prev,
      ];
    });
  };

  const onChangeItemName: (
    itemId: string | number,
  ) => React.ChangeEventHandler<HTMLInputElement> = (itemId) => (event) => {
    setProperties((prev) => {
      if (!prev) return prev;
      return prev?.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            name: event.target.value,
          };
        }
        return item;
      });
    });
  };

  const onClickDeleteButton: React.MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    setProperties((prev) => {
      if (!prev) return prev;
      return prev?.filter((_, index) => {
        if (
          event.currentTarget &&
          `${event.currentTarget.dataset.index}` === `${index}`
        ) {
          return false;
        }
        return true;
      });
    });
  };

  const onSubmitForm: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data = formMethods.getValues();

    if (!data.database || !data.items) {
      return;
    }

    createPage.mutate({
      databaseId: data.database,
      checkboxes: data.items.map((item) => ({ ...item, checked: true })),
      pageTitle: `${dayjs(data.date).format("YYYY-MM-DD")}`,
      createdTime: new Date().toString(),
    });
  };

  const onClickCheckbox = (itemId?: z.infer<typeof ItemSchema>["id"]) => {
    setProperties((prev) => {
      if (!prev) return prev;
      return prev?.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    const getCurrentProperty = () => {
      if (!database?.success || !ai?.success) return null;

      const object: Record<string, z.infer<typeof ItemSchema>> = {};

      ai?.data?.contents?.habits.forEach((content) => {
        object[content.name] = {
          id: `${Math.random()}`,
          name: content.name,
          checked: content.checked,
          type: "checkbox",
          status: ITEM_STATUS.UPDATED,
        };
      });

      database?.data?.properties.forEach((property) => {
        object[property.name] = {
          ...property,
          checked: object[property.name]?.checked ? true : false,
          status: ITEM_STATUS.ORIGIN,
        };
      });

      return Object.values(object).sort((a, b) =>
        a.status === ITEM_STATUS.UPDATED ? -1 : 1,
      );
    };

    setProperties(() => getCurrentProperty());
  }, [
    database?.data?.properties,
    ai?.data?.contents,
    database?.success,
    ai?.success,
  ]);

  useEffect(() => {
    if (properties) {
      // const prevItems = formMethods.getValues("items")
      const checked = properties.filter((habit) => {
        if (habit.checked) {
          return true;
        }
        return false;
      });

      const newItems = checked.filter((item, index, self) => {
        if (!item.checked) return false;
        return index === self.findIndex((t) => t.id === item.id);
      });

      formMethods.setValue("items", newItems);
    }

    if (ai?.data?.contents.date) {
      formMethods.setValue("date", `${ai.data.contents.date}`);
    }
  }, [formMethods, properties, ai]);

  useEffect(() => {
    if (!ai?.data) {
      formMethods.reset();
    }
  }, [ai?.data, database?.data, databases?.data, formMethods]);

  return (
    <TaskFormContext.Provider
      value={{
        ...formMethods,
        aiData: ai,
        databases: databases,
        database: database,
        properties,
        onSubmitForm,
        imageUrl,
        onClickDeleteButton,
        onClickAddButton,
        onChangeItemName,
        onClickCheckbox,
      }}
    >
      <form className="flex flex-col gap-2 pb-10" onSubmit={onSubmitForm}>
        <FormProvider {...formMethods}>{children}</FormProvider>
      </form>
    </TaskFormContext.Provider>
  );
};

const TaskFormImage = () => {
  const { imageUrl } = useTaskForm();

  if (!imageUrl) return null;

  return (
    <div className="bg-background rounded-xl p-6 border">
      <Label className="text-base">사진 등록하기</Label>
      <p className="text-[0.8rem] text-muted-foreground flex gap-1 items-center">
        <NotionLogoIcon /> 오늘 기록을 올려주세요
      </p>
      <div className="relative">
        <div className="relative w-auto h-[160px] overflow-hidden border rounded-lg mt-4">
          <ImageWithBackground
            as="link"
            src={decodeURIComponent(imageUrl)}
            alt={"이미지"}
            fill
            className="object-center object-cover p-2 hover:scale-105 transition-transform duration-50"
          />
        </div>
        <Link href={"/n"} className="absolute -right-0 -top-[1.25rem]">
          <XIcon className="fill-white text-sm" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
};

const TaskFormImageAction = ({
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <div className="bg-background rounded-xl p-6 border">
      <Label className="text-base">기록하기</Label>
      <p className="text-[0.8rem] text-muted-foreground flex gap-1 items-center">
        <NotionLogoIcon /> 오늘 기록을 올려주세요
      </p>
      <ActionToolbar>
        <ActionToolbar.CameraButton
          {...props}
          className={buttonVariants({
            variant: "outline",
            className: cn(
              "w-full px-6 my-4 h-[120px] border justify-center shadow-none rounded-lg text-foreground",
              "flex-col gap-0",
              className,
            ),
          })}
        >
          <span className="text-sm">{children ?? "사진을 등록해주세요"}</span>
        </ActionToolbar.CameraButton>
      </ActionToolbar>
    </div>
  );
};

const TaskFormDate = () => {
  return (
    <div className="text-base flex items-center gap-4">
      <div className="whitespace-nowrap flex">
        <DateForm /> {"\b"} 에 진행한 기록이에요
      </div>
      <div className="w-full h-[1px] bg-muted" />
    </div>
  );
};

const TaskFormSelectForm = () => {
  const { databases, imageUrl } = useTaskForm();

  if (!imageUrl) return null;

  return (
    <SelectForm
      header={{
        label: "데이터베이스",
        description: "기록을 저장할 데이터베이스를 선택 해주세요",
      }}
      databases={databases?.data ?? []}
    />
  );
};

const TaskFormCheckBoxForm = () => {
  const {
    properties,
    onClickDeleteButton,
    onClickAddButton,
    onChangeItemName,
    onClickCheckbox,
  } = useTaskForm();

  if (!properties) return null;

  return (
    <CheckBoxForm
      header={{
        label: "기록",
        description: "기록을 선택해서 동기화 해요",
      }}
      items={properties}
      onClickDeleteButton={onClickDeleteButton}
      onClickAddButton={onClickAddButton}
      onChangeItemName={onChangeItemName}
      onClickCheckbox={onClickCheckbox}
    />
  );
};

const TaskFormSubmitButton = () => {
  const { properties, database } = useTaskForm();

  if (!database?.data || !properties) return null;

  return (
    <Button
      type="submit"
      className="shadow-none rounded-lg py-6 hover:opacity-80 hover:bg-background"
      variant={"outline"}
    >
      기록하기
    </Button>
  );
};

const TaskForm = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <TaskFormProvider imageUrl={imageUrl}>
      {imageUrl ? <TaskFormImage /> : <TaskFormImageAction />}
      {imageUrl && <TaskFormDate />}
      <TaskFormSelectForm />
      <TaskFormCheckBoxForm />
      <TaskFormSubmitButton />
    </TaskFormProvider>
  );
};

export default TaskForm;
