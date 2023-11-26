import { Message } from "@/constants";
import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { addMessage } from "@/lib/message";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const instruction = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages) {
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

    const payload = {
      messages: [instruction, ...messages],
    };

    const completion = await openai.chat.completions.create({
      messages: payload.messages,
      model: "gpt-3.5-turbo-1106",
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      return new NextResponse("API call failed");
    }

    if (isPro) {
      const userMessages: Message[] = [
        ...messages,
        {
          role: "assistant",
          content: response,
        },
      ];

      await addMessage("code", userMessages);
    } else {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
