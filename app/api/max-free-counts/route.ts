import { MAX_FREE_COUNTS } from "@/constants";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const maxFreeCounts = MAX_FREE_COUNTS;

    return NextResponse.json({ maxFreeCounts });
  } catch (error) {
    console.log("[MAX_FREE_COUNTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
