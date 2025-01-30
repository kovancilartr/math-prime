export type DataTableItem = {
  id: string;
  name: string;
  email: string;
  location: string;
  flag: string;
  status: "Active" | "Inactive" | "Pending";
  balance: number;
};

export type Users = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: "USER" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
};

export type ResponseCourses = {
  message: string;
  page: number;
  pageSize: number;
  success: boolean;
  totalCourses: number;
  data: Courses;
};
export type Courses = {
  id: string;
  title: string;
  description: string;
  courseVideoUrl: string;
  price: number;
  thumbnail: string;
  isPublished: boolean;
  instructorId: string;
  instructor: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  Section: Sections[];
  CourseEnrollment: CourseEnrollment[];
  Rating: Rating[];
  categories: Category[];
};
export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};
export type Sections = {
  id: string;
  courseId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
export type CourseEnrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
};
export type Rating = {
  id: string;
  rating: number;
  review: string;
  courseId: string;
  userId: string;
  createdAt: string;
};
