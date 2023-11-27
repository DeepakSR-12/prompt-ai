"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    description:
      "Speak Easy: The AI companion that converses, enlightens, and amuses, transforming every chat into an adventure in knowledge.",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description:
      "Code Craft: Your Text-to-Code Alchemist - Effortlessly transforming ideas into code, making programming an accessible and creative journey for everyone.",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    description:
      "Imagine Ink: Where your words paint pictures - Transforming text into stunning visuals, bringing your imagination vividly to life with a tap.",
  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    description:
      "Melody Weaver: Your Text-Tuned Maestro - Crafting symphonies from sentences, turning your words into captivating melodies that resonate with every note.",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    description:
      "Visionary Vids: Your Narrative Director - Translating text into dynamic videos, crafting visual stories that captivate with every frame.",
  },
];

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div className="mt-8 md:mt-16 lg:mt-20 px-6">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          The Ultimate Creative Suite
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground font-light text-center">
          A single app that transforms text into code, images, music, and
          videos, weaving your words into a tapestry of digital artistry.
          Unleash your creativity, one tap at a time.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 px-4 lg:px-30">
        {tools?.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className={cn(
              "flex flex-col gap-4 p-6 border-black/5 cursor-pointer hover:shadow-md duration-300 transition group",
              tool.bgColor
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-4">
                <div className={cn("w-fit p-2 rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div className="font-semibold">{tool.label}</div>
              </div>
              <ArrowRight
                className={cn("w-5 h-5 group-hover:translate-x-1 duration-300")}
              />
            </div>
            <div>{tool.description}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
