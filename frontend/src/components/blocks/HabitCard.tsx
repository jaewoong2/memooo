// components/blocks/HabitCard.tsx
import Link from "next/link";
import { Habbit, Record } from "@/apis/type";
import ProgressComponent from "./ProgressComponent";
import ContinuousStreak from "./ContinuousStreak";
import {
  StarIcon,
  SmileIcon,
  SaladIcon,
  GlassWaterIcon,
  SunIcon,
  MoonIcon,
  XCircleIcon,
  PiggyBankIcon,
  BicepsFlexedIcon,
} from "lucide-react";

interface HabitCardProps {
  title: string;
  icon: Habbit["icon"];
  records?: Record[];
}

const habitIcons = {
  star: <StarIcon className="text-primary/80" />,
  smile: <SmileIcon className="text-primary/80" />,
  salad: <SaladIcon className="text-primary/80" />,
  glassWater: <GlassWaterIcon className="text-primary/80" />,
  sun: <SunIcon className="text-primary/80" />,
  moon: <MoonIcon className="text-primary/80" />,
  none: <XCircleIcon className="text-primary/80" />,
  finance: <PiggyBankIcon className="text-primary/80" />,
  workout: <BicepsFlexedIcon className="text-primary/80" />,
};

export default function HabitCard({ title, icon, records }: HabitCardProps) {
  return (
    <li className="w-full">
      <Link
        href={`/habbit?title=${title}`}
        className="flex w-full relative justify-center gap-4 px-3 rounded-lg border bg-background py-3"
      >
        <span className="border bg-muted p-2 rounded-2xl w-10 h-fit">
          {habitIcons[icon]}
        </span>
        <div className="flex flex-col w-full">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-1 text-lg">
              <p className="font-semibold">{title}</p>
            </div>
            <div className="flex justify-start gap-1 pr-2 h-[40px]">
              <ProgressComponent records={records} />
            </div>
          </div>
          <ContinuousStreak />
        </div>
      </Link>
    </li>
  );
}
