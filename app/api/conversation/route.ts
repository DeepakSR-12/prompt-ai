import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const headers = {
  Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY!}`,
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { inputs } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!inputs) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    const conversationModel = "facebook/blenderbot-400M-distill";
    const endpoint = `https://api-inference.huggingface.co/models/${conversationModel}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        inputs,
      }),
    })?.then((res) => res.json());

    if (!response) {
      return new NextResponse("API call failed", { status: response.status });
    }

    if (!isPro) await incrementApiLimit();
    return NextResponse.json(response);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
