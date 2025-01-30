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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Users } from "@/types/globalTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Loader, X } from "lucide-react";

interface UserEditSheetProps {
  className?: string;
  user: Users | null; // Kullanıcı verisi
  onClose: () => void; // Kapatma fonksiyonu
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

const UserEditSheet = ({ className, user, onClose }: UserEditSheetProps) => {
  const { editUser } = useAuthStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      surname: user?.surname || "",
      role: user?.role || "USER",
      status: user?.status || "PENDING",
      password: "",
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Formun varsayılan davranışını engelle
    const values = form.getValues(); // Formdan değerleri al
    console.log("Update Response: ", values);

    const updateResponse = await editUser({
      id: user?.id,
      newName: values.name,
      newSurname: values.surname,
      newEmail: values.email,
      newPassword: values.password,
      newRole: values.role,
      newStatus: values.status,
    });
    if (updateResponse) {
      // Toast mesajı göster
      toast.success(`Güncelleme işlemi başarılı \n ${updateResponse} 👏`, {
        style: {
          textAlign: "center",
        },
      });
      form.reset(); // Formu sıfırla
      // window.location.reload();
    }
  }

  return (
    <Sheet open={!!user} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-center text-2xl">
            Öğrenci Düzenle
          </SheetTitle>
          <SheetDescription className="text-center text-gray-500/60">
            Sisteme öğrenci eklemek için lütfen aşağıdaki formu doldurun.
          </SheetDescription>
          <Form {...form}>
            <form
              className={cn("flex flex-col gap-4", className)}
              onSubmit={onSubmit}
            >
              {/* E-Mail Adresi */}
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

              {/* Kullanıcı adı ve soyisimi */}
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

              {/* Şifre */}
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

              {/* Kullanıcı rolü */}
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

              {/* Kaydet ol butonu */}
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

export default UserEditSheet;
