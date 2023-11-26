"use client";
import { UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { useProModal } from "@/hooks/use-pro-modal";
import { useEffect } from "react";

const Navbar = ({
  isPro,
  apiLimitCount,
}: {
  isPro: boolean;
  apiLimitCount: number;
}) => {
  const { setIsPro } = useProModal();

  useEffect(() => {
    setIsPro(isPro);
  }, []);

  return (
    <div className="flex items-center p-4">
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
