import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse(
        "Music Generation is a premium feature. Please upgrade to pro.",
        { status: 403 }
      );
    }

    const data = {
      worklet_input: {
        alpha: 0.75,
        num_inference_steps: 50,
        seed_image_id: "og_beat",
        mask_image_id: null,
        start: {
          prompt,
          seed: 674,
          denoising: 0.75,
          guidance: 7,
        },
        end: {
          prompt,
          seed: 675,
          denoising: 0.75,
          guidance: 7,
        },
      },
    };

    const response = await postData(process.env.RIFFUSION_URL, data).then(
      (data) => {
        return data?.output?.audio;
      }
    );

    if (!response) {
      return new NextResponse("API call failed");
    }

    if (!isPro) await incrementApiLimit();

    return new NextResponse(response);
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
