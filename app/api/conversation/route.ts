import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "",
  basePath: "https://free.churchless.tech/v1",
});

const openai = new OpenAIApi(configuration);

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

    const response = await openai.createChatCompletion({
      model: "text-curie-001",
      messages,
      max_tokens: 100,
      n: 1,
      temperature: 0.7,
    });

    if (!response.data) {
      return new NextResponse("API call failed", { status: response.status });
    }

    const data = await response.data.choices[0].message;
    return NextResponse.json(data);
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
