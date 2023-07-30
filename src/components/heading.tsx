import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const Heading = ({
  title,
  description,
  icon: Icon,
  color,
  bgColor,
}: HeadingProps) => {
  return (
    <div className="flex items-center px-4 lg:px-8 gap-x-3 mb-8">
      <div className={cn("w-fit p-2 rounded-md", bgColor)}>
        <Icon className={cn("w-10 h-10", color)} />
      </div>
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Heading;
