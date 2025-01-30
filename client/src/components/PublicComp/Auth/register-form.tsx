"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import Link from "next/link";
import { User2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  className?: React.ReactNode;
}

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3, {
    message: "Name must be at least 2 characters",
  }),
  surname: z.string().min(3, {
    message: "Surname must be at least 2 characters",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});
export const RegisterForm = ({ className }: RegisterFormProps) => {
  const route = useRouter();
  const { register } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      surname: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const registerResponse = await register(
      values.name,
      values.surname,
      values.email,
      values.password
    );
    console.log("Kayıt Ol Response: ", registerResponse);
    if (registerResponse) {
      // Toast mesajı göster
      toast.success(`Kayıt işlemi başarılı \n ${registerResponse} 👏`, {
        style: {
          textAlign: "center",
        },
      });
      // User bilgilerini al
      const userId = useAuthStore.getState().user;
      console.log("Kayıt Olundu User Bilgileri: ", userId);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input placeholder="e.q `john@example.com`" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full gap-x-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.q `John`" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input placeholder="e.q `Doe`" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="e.q `123456`" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <Button type="submit" className="w-full text-lg">
            Kayıt Ol
          </Button>
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 rounded-md px-2 text-muted-foreground">
            Mevcut bir hesabınız var mı?
          </span>
        </div>
        <Link href="/auth/login" className="w-1/2 mx-auto">
          <Button variant="outline" className="w-full">
            <User2 className="h-6 w-6" />
            Giriş Yap
          </Button>
        </Link>
      </form>
    </Form>
  );
};
