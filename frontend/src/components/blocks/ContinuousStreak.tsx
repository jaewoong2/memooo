import React from "react";
import dayjs from "dayjs";
import { Record } from "@/apis/type";

interface Props {
  records?: Record[];
}

const ContinuousStreak: React.FC<Props> = ({ records = [] }) => {
  // records 배열이 비어있다면 연속 기록 없음 표시
  if (records.length === 0) {
    return <p>인증 하고 기록을 이어 가요.</p>;
  }

  // 하루 단위로 날짜를 비교하기 위해 records를 Set으로 변환
  const recordDates = new Set(
    records
      .filter((record) => record.createdAt) // createdAt이 존재하는 경우만
      .map((record) => dayjs(record.createdAt).format("YYYY-MM-DD")),
  );

  let streak = 0;
  let currentDay = dayjs().startOf("day"); // 오늘을 기준

  // 오늘부터 과거로 거슬러 올라가면서 연속 기록 계산
  while (recordDates.has(currentDay.format("YYYY-MM-DD"))) {
    streak += 1;
    currentDay = currentDay.subtract(1, "day");
  }

  return <p>오늘까지 연속 {streak}일 째에요!</p>;
};

export default ContinuousStreak;
