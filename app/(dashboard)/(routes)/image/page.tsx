"use client";

import Heading from "@/components/heading";
import { Download, ImageIcon } from "lucide-react";
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

import { Toaster } from "@/components/ui/toaster";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const ImagePage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const { onOpen } = useProModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const promptValue = form.watch("prompt");
  const isLoading = form.formState.isSubmitting;

  const generateImage = async () => {
    try {
      const values = form.getValues();
      setImages([]);
      const response = await axios.post("/api/image", {
        ...values,
      });

      const urls = response.data;
      setImages(urls);
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
        title="Image Generation"
        description="Turn your prompt into an image."
        icon={ImageIcon}
        bgColor="bg-pink-700/10"
        color="text-pink-700"
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              onSubmit={form.handleSubmit(generateImage)}
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent placeholder:text-slate-300"
                        disabled={isLoading}
                        placeholder="A picture of a dog near the river bank"
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
                        {amountOptions?.map((option) => (
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
                        {resolutionOptions?.map((option) => (
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
                className="col-span-12 lg:col-span-2 w-full bg-pink-700 hover:bg-pink-700/90"
                disabled={isLoading || !promptValue.length}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader message="Image is being generated..." />
            </div>
          )}
          {!images.length && !isLoading && (
            <Empty label="No images generated!" />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images?.map((src, index) => (
              <Card key={index} className="rounded-lg overflow-hidden">
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

      <Toaster />
    </div>
  );
};

export default ImagePage;
