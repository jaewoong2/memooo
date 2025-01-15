"use client";

import React, { useState } from "react";

interface Habit {
  id: number;
  name: string;
  progress: number; // 0 ~ 100
}

const PuzzleBoard = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "Drink Water", progress: 50 },
    { id: 2, name: "Exercise", progress: 75 },
    { id: 3, name: "Read", progress: 30 },
    { id: 4, name: "Meditate", progress: 100 },
  ]);

  const updateProgress = (id: number, increment: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id
          ? { ...habit, progress: Math.min(habit.progress + increment, 100) }
          : habit,
      ),
    );
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-8">Habit Tracker</h1>
      <div className="grid grid-cols-2 gap-4">
        {habits.map((habit) => (
          <PuzzlePiece
            key={habit.id}
            habit={habit}
            onProgressUpdate={(increment) =>
              updateProgress(habit.id, increment)
            }
          />
        ))}
      </div>
    </div>
  );
};

interface PuzzlePieceProps {
  habit: Habit;
  onProgressUpdate: (increment: number) => void;
}

const PuzzlePiece = ({ habit, onProgressUpdate }: PuzzlePieceProps) => {
  return (
    <div
      className={`relative w-40 h-40 flex items-center justify-center rounded-lg cursor-pointer 
      bg-gray-200 shadow-lg hover:shadow-2xl transition-all`}
      onClick={() => onProgressUpdate(10)} // 클릭 시 진행률 증가
      style={{
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // 퍼즐 조각 형태
      }}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(to top, #4caf50 ${habit.progress}%, #f0f0f0 ${habit.progress}%)`,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // 퍼즐 조각 모양과 동일
          zIndex: -1,
        }}
      ></div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{habit.name}</h2>
        <p className="text-sm text-gray-600">{habit.progress}% Complete</p>
      </div>
    </div>
  );
};

export default PuzzleBoard;
