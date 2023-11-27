"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
  Zap,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "@/components/free-counter";
import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "./ui/badge";

const poppins = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    href: "/code",
    isPremium: true,
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    href: "/image",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    href: "/music",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    href: "/video",
    isPremium: true,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false,
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { onOpen } = useProModal();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-black text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 group">
          <div
            className="relative h-8 w-8 mr-2 group-hover:animate-spin"
            onClick={() => router.push("/dashboard")}
          >
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1
            className={cn(
              "text-2xl font-bold flex items-center space-x-2",
              poppins.className
            )}
          >
            <div>Prompt AI </div>
            {isPro ? (
              <Badge variant="premium" className="h-6 uppercase text-xs">
                pro
              </Badge>
            ) : null}
          </h1>
        </Link>
        <div className="space-y-1">
          {routes?.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}{" "}
                {!isPro && route.isPremium && (
                  <Zap
                    onClick={() => onOpen()}
                    className="w-4 h-4 ml-2 fill-purple-700 text-purple-500 cursor-pointer"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} isPro={isPro} />
    </div>
  );
};
