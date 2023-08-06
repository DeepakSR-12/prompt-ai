import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

async function blobToBase64(blob: Blob) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return buffer.toString("base64");
}

async function generateImages(
  prompt: string,
  numImages: number,
  width: string,
  height: string
) {
  const TOKEN = "";
  const hf = new HfInference(TOKEN);

  const images = [];
  for (let i = 0; i < numImages; i++) {
    const blob = await hf.textToImage({
      inputs: prompt,
      parameters: {
        width: parseInt(width),
        height: parseInt(height),
      },
      model: "prompthero/openjourney-v4",
    });
    const base64 = await blobToBase64(blob);
    const imageUrl = `data:image/png;base64,${base64}`;
    images.push(imageUrl);
  }
  return images;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
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

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    const [width, height] = resolution.split("x");

    const response = await generateImages(prompt, amount, width, height);

    if (!response) {
      return new NextResponse("API call failed", { status: 400 });
    }

    if (!isPro) await incrementApiLimit();

    return NextResponse.json(response);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return NextResponse.json(error);
  }
}
