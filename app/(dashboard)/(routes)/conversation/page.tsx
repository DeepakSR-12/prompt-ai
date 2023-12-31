"use client";

import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
import * as z from "zod";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { PromptAIAvatar } from "@/components/prompt-ai-avatar";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/use-pro-modal";

interface Message {
  role: string;
  content: string;
}

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const { onOpen } = useProModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const promptValue = form.watch("prompt");

  const isLoading = form.formState.isSubmitting;

  const fetchMessages = async () => {
    try {
      const response = await axios.get("/api/messages?type=conversation");
      if (response?.data?.messages) setMessages(response?.data?.messages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];
      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((current) => [
        ...current,
        userMessage,
        { role: "assistant", content: response.data },
      ]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model"
        icon={MessageSquare}
        bgColor="bg-violet-500/10"
        color="text-violet-500"
        showHistory
        type="conversation"
        enableDeleteHistory={!!messages?.length}
        setMessages={setMessages}
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent placeholder:text-slate-300"
                        disabled={isLoading}
                        placeholder="Write a blog post on stating the pros and cons of Artificial Intelligence"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                className="col-span-12 lg:col-span-2 w-full bg-violet-500 hover:bg-violet-500/90"
                disabled={isLoading || !promptValue.length}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full bg-muted flex items-center justify-center">
              <Loader />
            </div>
          )}
          {!messages.length && !isLoading && (
            <Empty label="No conversation started!" />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages?.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "w-full p-8 flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "border bg-white border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <PromptAIAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
