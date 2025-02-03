import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  PropsWithChildren,
} from "react";
import { motion, PanInfo } from "framer-motion";

// Swipe Context & Provider
interface SwipeContextType {
  swipeStatus: "add" | "remove" | null;
  setSwipeStatus: (status: "add" | "remove" | null) => void;
}

const SwipeContext = createContext<SwipeContextType | undefined>(undefined);

const Swipe = ({ children }: PropsWithChildren) => {
  const [swipeStatus, setSwipeStatus] = useState<"add" | "remove" | null>(null);

  return (
    <SwipeContext.Provider value={{ swipeStatus, setSwipeStatus }}>
      {children}
    </SwipeContext.Provider>
  );
};

const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (!context) {
    throw new Error("useSwipe must be used within a SwipeProvider");
  }
  return context;
};

// SwipeableCard Component
interface SwipeableCardProps {
  onSwipeAdd?: () => void;
  onSwipeRemove?: () => void;
  children: ReactNode;
}

const SwipeCard: React.FC<SwipeableCardProps> = ({
  onSwipeAdd,
  onSwipeRemove,
  children,
}) => {
  const { swipeStatus, setSwipeStatus } = useSwipe();

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      setSwipeStatus("add");
      if (onSwipeAdd) onSwipeAdd();
    } else if (info.offset.x < -100) {
      setSwipeStatus("remove");
      if (onSwipeRemove) onSwipeRemove();
    } else {
      setSwipeStatus(null);
    }
  };

  const getBackgroundStyles = () => {
    if (swipeStatus === "add") return "bg-green-200";
    if (swipeStatus === "remove") return "bg-red-200";
    return "bg-transparent";
  };

  return (
    <motion.div
      className={`relative flex mx-auto w-full h-full`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      {swipeStatus === "add" && (
        <span className="text-xl font-bold w-fit bg-green-200  py-4">Add</span>
      )}
      {children}
      {swipeStatus === "remove" && (
        <span className="text-xl font-bold">Remove</span>
      )}
    </motion.div>
  );
};

// HabitCardContent Component
interface HabitCardContentProps {
  title: string;
  progress: string;
  icon: ReactNode;
}

const SwipeCardContent: React.FC<HabitCardContentProps> = ({
  title,
  progress,
  icon,
}) => (
  <div className="flex items-center gap-4 w-full">
    <div className="">{icon}</div>
    <span className="font-bold w-full">{title}</span>
    {/* <span className="ml-auto text-gray-500">{progress}</span> */}
  </div>
);

Swipe.Card = SwipeCard;
Swipe.CardContent = SwipeCardContent;

export default Swipe;
