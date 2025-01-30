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
import { Send, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginFormProps {
  className?: React.ReactNode;
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters",
  }),
});
export const LoginForm = ({ className }: LoginFormProps) => {
  const route = useRouter();
  const { login, logout } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loginResponse = await login(values.email, values.password);
    console.log("Login Response: ", loginResponse);
    if (loginResponse) {
      // User bilgilerini al
      const user = useAuthStore.getState().user;
      const message = useAuthStore.getState().message;
      // Toast mesajı göster
      toast.success(`${message} 🚀`, {
        style: {
          textAlign: "center",
        },
        icon: "🔑",
      });
      // User bilgilerini kullanarak yönlendirme yap
      if (user?.role === "SUPER_ADMIN") {
        route.push("/super-admin");
      } else {
        route.push("/courses");
      }
    } else {
      const error = useAuthStore.getState().error;
      toast.error(`${error} 😔`, {
        style: {
          textAlign: "center",
        },
      });
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
            Giriş Yap
          </Button>
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 rounded-md px-2 text-muted-foreground">
            Hesabınız yok mu?
          </span>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Hemen kayıt departmanı ile iletişime geçin
          </p>
          <Send className="h-4 w-4" />
        </div>
        {/* <Link href="/auth/register" className="w-1/2 mx-auto">
          <Button variant="outline" className="w-full">
            <User2 className="h-6 w-6" />
            Kayıt Ol
          </Button>
        </Link> */}
      </form>
    </Form>
  );
};
