"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Loader, X } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserAddSheetProps {
  className?: string;
}

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3, {
    message: "Name must be at least 2 characters",
  }),
  surname: z.string().min(3, {
    message: "Surname must be at least 2 characters",
  }),
  role: z.string().min(3, {
    message: "Role must be at least 2 characters",
  }),
  status: z.string().min(3, {
    message: "Status must be at least 2 characters",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

const UserAddSheet = ({ className }: UserAddSheetProps) => {
  const { register } = useAuthStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      surname: "",
      role: "USER",
      status: "PENDING",
      password: "",
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Formun varsayılan davranışını engelle
    const values = form.getValues(); // Formdan değerleri al
    console.log("Kayıt Ol Response: ", values);

    const registerResponse = await register(
      values.name,
      values.surname,
      values.email,
      values.password
    );
    if (registerResponse) {
      // Toast mesajı göster
      toast.success(`Kayıt işlemi başarılı \n ${registerResponse} 👏`, {
        style: {
          textAlign: "center",
        },
      });
      form.reset(); // Formu sıfırla
    }
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Button className="ml-auto" variant="outline">
          <Plus
            className="-ms-1 me-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          Öğrenci Ekle
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-center text-2xl">Öğrenci Ekle</SheetTitle>
          <SheetDescription className="text-center text-gray-500/60">
            Sisteme öğrenci eklemek için lütfen aşağıdaki formu doldurun.
          </SheetDescription>
          <Form {...form}>
            <form
              className={cn("flex flex-col gap-4", className)}
              onSubmit={onSubmit}
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
                      <Input
                        type="password"
                        placeholder="e.q `123456`"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full gap-x-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Kullanıcı Rolü</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange} // Değişiklikleri burada bağlayın
                          value={field.value} // Seçim değerini burada ayarlayın
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Kullanıcı Rolü" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">Öğrenci</SelectItem>
                            <SelectItem value="SUPER_ADMIN">
                              Süper Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Kullanıcı Durumu</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange} // Değişiklikleri burada bağlayın
                          value={field.value} // Seçim değerini burada ayarlayın
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Kullanıcı Durumu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">
                              <Check
                                width={16}
                                height={16}
                                className="inline-block mr-1"
                              />
                              Aktif
                            </SelectItem>
                            <SelectItem value="INACTIVE">
                              <Loader
                                width={16}
                                height={16}
                                className="inline-block mr-1 animate-spin duration-1000"
                              />
                              Pasif
                            </SelectItem>
                            <SelectItem value="PENDING">
                              <X
                                width={16}
                                height={16}
                                className="inline-block mr-1"
                              />{" "}
                              Beklemede
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex">
                <Button type="submit" className="w-full text-lg">
                  Kaydet
                </Button>
              </div>
            </form>
          </Form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default UserAddSheet;
