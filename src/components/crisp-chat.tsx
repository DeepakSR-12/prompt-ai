"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    const crispIdentifier = process.env.NEXT_PUBLIC_CRISP_IDENTIFIER;
    if (crispIdentifier) {
      Crisp.configure(crispIdentifier);
    }
  }, []);

  return null;
};
