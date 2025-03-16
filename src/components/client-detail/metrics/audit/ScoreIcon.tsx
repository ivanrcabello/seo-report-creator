
import { CircleCheck, CircleX, CircleDashed } from "lucide-react";

interface ScoreIconProps {
  score: number;
}

export const ScoreIcon = ({ score }: ScoreIconProps) => {
  if (score >= 0.9) return <CircleCheck className="h-5 w-5 text-green-500" />;
  if (score >= 0.5) return <CircleDashed className="h-5 w-5 text-orange-500" />;
  return <CircleX className="h-5 w-5 text-red-500" />;
};
