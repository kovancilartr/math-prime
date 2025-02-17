"use client";
import React, { useEffect, useState } from "react";
import { fetchCourseDetailsPageActions } from "@/store/useQueryStore";
import { useParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import ImageUploadThing from "@/components/image-upload-thing";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import ImageModal from "./_components/image-modal";
import { getAdminRoleAllUser } from "@/services/authServices";
import { getCategoriesServices } from "@/services/courseServices";
import { Spinner } from "@/components/spinner";
import LoadingSpinner from "@/components/loading-spinner";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().min(0),
  instructorId: z.string(),
  courseVideoUrl: z.string(),
  thumbnail: z.string(),
  isPublished: z.boolean(),
  categoryId: z.string(),
});

const CourseDetails = () => {
  const [teacher, setTeacher] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const params = useParams();
  const courseId = params.courseId;
  const {
    data: responseCourses,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = fetchCourseDetailsPageActions(courseId as string);
  const courseData = responseCourses?.data[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: courseData?.title || "",
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

  useEffect(() => {
    if (responseCourses) {
      allAdminRole();

      // Formu kurs bilgilerini doldur
      form.setValue("title", courseData?.title);
      form.setValue("description", courseData?.description);
      form.setValue("price", courseData?.price);
      form.setValue("instructorId", courseData?.instructorId);
      form.setValue("courseVideoUrl", courseData?.courseVideoUrl);
      form.setValue("thumbnail", courseData?.thumbnail);
      form.setValue("isPublished", courseData?.isPublished);
      form.setValue(
        "categoryId",
        courseData?.categories.map((category: any) => category.id)[0]
      );
    }
  }, [responseCourses]);

  if (isCourseLoading) {
    return <LoadingSpinner />;
  }
  if (isCourseError) {
    return <p>Verileri çekerken bir hata oluştu.</p>;
  }
  return (
    <div className="container mx-auto mt-6 px-2 lg:px-0 space-y-4">
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form className={cn("flex flex-col gap-4")} onSubmit={() => {}}>
            <div className="flex items-center justify-center w-full">
              <h2 className="text-2xl font-bold">Kurs Detayı</h2>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-ColorPalette-fcfcfc rounded-lg p-4">
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
            </div>

            <div className="flex w-full gap-x-6 rounded-lg border p-3 shadow-sm bg-ColorPalette-fcfcfc">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Ücret</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.q `100`" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-r" />

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

              <div className="border-r" />

              <div className="flex flex-col justify-center items-center gap-x-6 space-y-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="flex flex-row gap-4 items-center justify-between">
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
                <ImageModal form={form} />
              </div>

              <div className="border-r" />

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
                        <SelectTrigger>
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

            <div className="flex">
              <Button type="submit" className="w-full text-lg">
                Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CourseDetails;
