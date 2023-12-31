"use client";

import Heading from "@/components/heading";
import { Code } from "lucide-react";
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
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

interface Message {
  role: string;
  content: string;
}

const CodePage = () => {
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
      const response = await axios.get("/api/messages?type=code");
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
      const response = await axios.post("/api/code", {
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
        toast.error(
          "Code Generation is a premium feature. Please upgrade to pro.",
          { duration: 2000 }
        );
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
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        bgColor="bg-green-700/10"
        color="text-green-700"
        showHistory
        type="code"
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
                        placeholder="Simple toggle button using react hooks."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                className="col-span-12 lg:col-span-2 w-full bg-green-700 hover:bg-green-700/90"
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
              <Loader message="Code is being generated..." />
            </div>
          )}
          {!messages.length && !isLoading && (
            <Empty label="No code generated!" />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages?.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "w-full p-8 flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "border bg-white border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <PromptAIAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                  className="leading-7 text-sm overflow-hidden"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
