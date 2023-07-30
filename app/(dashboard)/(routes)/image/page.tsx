"use client";

import Heading from "@/components/heading";
import { Download, ImageIcon, Terminal } from "lucide-react";
import * as z from "zod";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

const ConversationPage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const generateImage = async () => {
    try {
      if (!key) {
        toast({
          title: "No API key available",
          description: "Please enter a valid Open AI API key",
        });
        return;
      }
      setOpen(false);
      const values = form.getValues();
      setImages([]);
      const response = await axios.post("/api/image", {
        ...values,
        apiKey: key,
      });

      if (response.data.status === 401) {
        toast({
          title: "Invalid API Key",
          description: "Please enter a valid Open AI API key",
        });
        return;
      }
      const urls = response.data.map((image: { url: string }) => image.url);
      setImages(urls);
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  const onSubmit = () => {
    setOpen(true);
  };

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image."
        icon={ImageIcon}
        bgColor="bg-pink-700/10"
        color="text-pink-700"
      />

      <div className="px-4 lg:px-8">
        <Alert className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            Image generation is a premium resource heavy feature which requires
            user's Open AI API key. <br /> Obtain an OpenAI API Key from &nbsp;
            <Link
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              className="underline"
            >
              OpenAI API Keys
            </Link>
          </AlertDescription>
        </Alert>
        <div>
          <Form {...form}>
            <form
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of a horse in swiss alps"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="amount"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      value={value}
                      onValueChange={onChange}
                      defaultValue={value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                name="resolution"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      value={value}
                      onValueChange={onChange}
                      defaultValue={value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {!images.length && !isLoading && (
            <Empty label="No images generated!" />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((src) => (
              <Card key={src} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image fill alt="Generated" src={src} />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(src)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {!!open ? (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Open AI api key</DialogTitle>
              <DialogDescription>
                <Input
                  type="password"
                  className=""
                  disabled={isLoading}
                  placeholder="Enter key..."
                  value={key}
                  onChange={(event) => setKey(event.target.value)}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={generateImage}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}

      <Toaster />
    </div>
  );
};

export default ConversationPage;
