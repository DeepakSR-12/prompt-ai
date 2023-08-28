import { getApiLimitCount } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const limit = await getApiLimitCount();

    return NextResponse.json({ limit });
  } catch (error) {
    console.log("[API_LIMIT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
