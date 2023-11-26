import { cn } from "@/lib/utils";
import { LucideIcon, Zap, Trash } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { Message } from "@/constants";
import { useProModal } from "@/hooks/use-pro-modal";

interface HeadingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  showHistory?: boolean;
  type?: string;
  enableDeleteHistory?: boolean;
  setMessages?: (message: Message[]) => void;
}

const Heading = ({
  title,
  description,
  icon: Icon,
  color,
  bgColor,
  showHistory,
  type,
  enableDeleteHistory,
  setMessages,
}: HeadingProps) => {
  const { isPro, onOpen } = useProModal();

  const deleteMessage = async () => {
    try {
      await axios.delete(`/api/messages?type=${type}`);
      if (setMessages) setMessages([]);
      toast.success(`${title}s deleted successfully!`);
    } catch (err) {
      toast.error("Something went wrong.");
      console.log(err);
    }
  };

  return (
    <div className="flex items-center px-4 lg:px-8 justify-between mb-8">
      <div className="flex items-center gap-x-3">
        <div className={cn("w-fit p-2 rounded-md", bgColor)}>
          <Icon className={cn("w-10 h-10", color)} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {showHistory ? (
        <>
          {isPro ? (
            <Button
              disabled={!enableDeleteHistory}
              onClick={deleteMessage}
              className={cn(bgColor.split("/")[0], "hover:bg-red-700/90")}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete History
            </Button>
          ) : !isPro ? (
            <Button variant="premium" onClick={() => onOpen()}>
              history <Zap className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default Heading;
