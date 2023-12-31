"use client";

import { Settings } from "lucide-react";

import { SubscriptionButton } from "@/components/subscription-button";
import Heading from "@/components/heading";
import { useProModal } from "@/hooks/use-pro-modal";

const SettingsPage = () => {
  const { isPro } = useProModal();

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        color="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently on a Pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
