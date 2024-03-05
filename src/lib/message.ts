import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { Message } from "@/constants";

export const addMessage = async (type: string, messages: Message[] = []) => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userMessage = await prismadb.userMessages.findFirst({
    where: { userId, type },
  });

  if (userMessage) {
    await prismadb.message.deleteMany({
      where: {
        userMessagesId: userMessage.id,
      },
    });

    await prismadb.$transaction(
      messages.map((message) =>
        prismadb.message.create({
          data: {
            userMessagesId: userMessage.id,
            role: message.role,
            content: message.content,
          },
        })
      )
    );
  } else {
    await prismadb.userMessages.create({
      data: {
        userId,
        type,
        messages: {
          create: messages,
        },
      },
    });
  }
};

export const retrieveMessages = async (type: string) => {
  const { userId } = auth();

  if (!userId) return [];

  const userMessages = await prismadb.userMessages.findFirst({
    where: { userId, type },
    include: {
      messages: true,
    },
  });

  const messagesData = userMessages?.messages?.map(({ role, content }) => {
    return {
      role,
      content,
    };
  });

  return messagesData || [];
};

export const deleteMessages = async (type: string) => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  await prismadb.userMessages.deleteMany({
    where: {
      userId,
      type,
    },
  });
};
