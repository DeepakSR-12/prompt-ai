import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512", apiKey } = body;

    if (!userId || !apiKey) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const configuration = new Configuration({
      apiKey,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    if (!response.data) {
      return new NextResponse("API call failed", { status: response.status });
    }

    const data = await response.data.data;
    return NextResponse.json(data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return NextResponse.json(error);
  }
}
