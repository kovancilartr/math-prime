"use client";
import React, { useState } from "react";
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
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getAdminRoleAllUser } from "@/services/authServices";
import {
  createCourseServices,
  getCategoriesServices,
} from "@/services/courseServices";
import toast from "react-hot-toast";
import ImageUploadThing from "@/components/image-upload-thing";

interface CourseAddSheetProps {
  className?: string;
}

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  courseVideoUrl: z.string(),
  price: z.number().min(0),
  instructorId: z.string(),
  thumbnail: z.string(),
  isPublished: z.boolean(),
  categoryId: z.string(),
});

const CourseAddSheet = ({ className }: CourseAddSheetProps) => {
  const [teacher, setTeacher] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      courseVideoUrl: "",
      price: 0,
      instructorId: "",
      thumbnail: "",
      isPublished: false,
      categoryId: "",
    },
  });

  const allAdminRole = async () => {
    const all_super_admin = await getAdminRoleAllUser();
    setTeacher(all_super_admin);

    const all_categories = await getCategoriesServices({});
    setCategories(all_categories?.data);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Formun varsayılan davranışını engelle
    const values = form.getValues(); // Formdan değerleri al

    const createCourseResponse = await createCourseServices(values);
    if (createCourseResponse) {
      // Toast mesajı göster
      toast.success(`Kurs başarıyla eklendi!`, {
        style: {
          textAlign: "center",
        },
      });
      form.reset(); // Formu sıfırla
    }
    console.log("Kurs Ekle Response: ", createCourseResponse);
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Button className="ml-auto" variant="outline" onClick={allAdminRole}>
          <Plus
            className="-ms-1 me-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          Kurs Ekle
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-center text-2xl">Kurs Ekle</SheetTitle>

          <Form {...form}>
            <form
              className={cn("flex flex-col gap-4", className)}
              onSubmit={onSubmit}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kurs Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="e.q `Course 1`" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kurs Açıklaması</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.q `Course 1 description`"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseVideoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kurs Video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.q `https://www.youtube.com`"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full gap-x-6 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Ücret</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.q `100`"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructorId"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Öğretmen Seçimi</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Öğretmen Seçimi" />
                          </SelectTrigger>
                          <SelectContent>
                            {teacher?.map((admin) => (
                              <SelectItem key={admin.id} value={admin.id}>
                                {admin.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full gap-x-6 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <div className="flex flex-col gap-y-1 items-center">
                        <div className="space-y-0.5">
                          <FormLabel>Kurs Durumu</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Kategori Seçimi</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Kategori Seçimi" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadThing
                        imageValue={field.value}
                        onChange={(url: any) => field.onChange(url)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

export default CourseAddSheet;
