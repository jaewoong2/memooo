"use client";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const Greeting = () => {
  const [dateText, setDateText] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateDateAndGreeting = () => {
      const now = dayjs();
      setDateText(now.format("YYYY.MM.DD dddd"));

      const hour = now.hour();
      if (hour < 12) {
        setGreeting("좋은 아침이에요 ☀️");
      } else if (hour < 18) {
        setGreeting("오후에도 즐겁게 🚀");
      } else {
        setGreeting("저녁에도 화이팅 🌙");
      }
    };

    // 컴포넌트 마운트 시와 이후 매 분마다 날짜와 환영 문구 업데이트
    updateDateAndGreeting();
    const intervalId = setInterval(updateDateAndGreeting, 60000); // 60,000ms = 1분

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <>
      <div className="text-sm text-muted-foreground px-4">{dateText}</div>
      <div className="text-lg font-semibold relative px-4">{greeting}</div>
    </>
  );
};

export default Greeting;
