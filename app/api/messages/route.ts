import { deleteMessages, retrieveMessages } from "@/lib/message";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: { url: string | URL }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the 'type' query parameter from the request
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "defaultType"; // Replace 'defaultType' with your default type

    const messages = await retrieveMessages(type);

    return NextResponse.json({ messages });
  } catch (error) {
    console.log("[MESSAGES_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: { url: string | URL }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the 'type' query parameter from the request
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "defaultType"; // Replace 'defaultType' with your default type

    // Assuming deleteMessages deletes messages based on type (and possibly userId)
    await deleteMessages(type);

    return new NextResponse("Messages deleted successfully", { status: 200 });
  } catch (error) {
    console.log("[DELETE_MESSAGES_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
