import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isPro = await checkSubscription();

    return NextResponse.json({ isPro });
  } catch (error) {
    console.log("[CHECK_SUBSCRIPTION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
