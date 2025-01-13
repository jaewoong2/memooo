import React from "react";
import dayjs from "dayjs";
import { CheckIcon } from "lucide-react"; // Lucide Check 아이콘 임포트
import { cn } from "@/lib/utils";

type Record = {
  id: number;
  habbitId: number;
  imageUrl?: string;
  createdAt?: Date | string;
  updateAt?: Date | string;
  deleted_at?: Date | string | null;
};

interface Props {
  records?: Record[];
  MAX_PROGRESS?: number; // 일반적으로 7일
}

const ProgressComponent: React.FC<Props> = ({
  records = [],
  MAX_PROGRESS = 7,
}) => {
  const hasRecord = records.find((record) => {
    const createdAt = dayjs(record.createdAt);
    const now = dayjs();
    const diff = now.diff(createdAt, "day");
    return diff === 0;
  });

  return (
    <div
      className={cn(
        "flex aspect-square h-full max-w-10 items-center justify-center rounded-2xl border bg-primary",
        hasRecord ? "bg-primary" : "bg-primary-foreground",
      )}
    >
      {hasRecord && (
        <CheckIcon className="text-green-500 w-4 h-4" strokeWidth={3} />
      )}
      {!hasRecord && <div className="w-full h-full" />}
    </div>
  );
};

export default ProgressComponent;
