// components/blocks/HabitCard.tsx
import { CheckIcon, GlassWaterIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  title: string;
  progress: number;
}

const MAX_PROGRESS = 7;

export default function HabitCard({ title, progress }: HabitCardProps) {
  return (
    <li className="flex w-full items-center justify-center gap-4 px-3 rounded-lg border bg-background py-3">
      <span className="border bg-muted p-2 rounded-xl">
        <GlassWaterIcon className="text-blue-500" />
      </span>
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-1 text-lg">
          <p>{title}</p>
        </div>
        <div className="flex w-full justify-start gap-1 pr-2">
          {[...Array(MAX_PROGRESS)].map((_, index) => (
            <div
              key={index}
              className={cn(
                'flex aspect-square h-auto w-full items-center justify-center rounded-xl border bg-primary',
                index >= progress && 'bg-primary-foreground'
              )}
            >
              {index < progress && <CheckIcon className="text-green-500 w-4 h-4" strokeWidth={3} />}
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}