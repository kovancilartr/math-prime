// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const publicRoutes = ["/", "/auth/login", "/courses"];

// const superAdminRoutes = ["/super-admin", "/super-admin/:path*"];

// const userRoutes = ["/courses/:path*"];

// export async function middleware(request: NextRequest) {
//   const accessToken = request.cookies.get("accessToken")?.value;
//   console.log("Access token Middleware: ", accessToken);
//   const { pathname } = request.nextUrl;

//   if (accessToken) {
//     try {
//       const { payload } = await jwtVerify(
//         accessToken,
//         new TextEncoder().encode(process.env.JWT_SECRET)
//       );
//       const { role } = payload as {
//         role: string;
//       };

//       console.log("Role Middleware: ", role, "payload Middleware: ", payload);
//       // if (publicRoutes.includes(pathname)) {
//       //   return NextResponse.redirect(
//       //     new URL(
//       //       role === "SUPER_ADMIN" ? "/super-admin" : "/courses",
//       //       request.url
//       //     )
//       //   );
//       // }

//       // Bu super-admin rolüne sahip olanların userRoutes'a girmesini engeller
//       //   if (
//       //     role === "SUPER_ADMIN" &&
//       //     userRoutes.some((route) => pathname.startsWith(route))
//       //   ) {
//       //     return NextResponse.redirect(new URL("/super-admin", request.url));
//       //   }

//       if (
//         role !== "SUPER_ADMIN" &&
//         superAdminRoutes.some((route) => pathname.startsWith(route))
//       ) {
//         return NextResponse.redirect(new URL("/courses", request.url));
//       }

//       return NextResponse.next();
//     } catch (error) {
//       console.error("TOKEN verification failed:", error);
//       const refreshResponse = await fetch("/api/auth/refresh-token", {
//         method: "POST",
//         credentials: "include",
//       });

//       if (refreshResponse.ok) {
//         const response = NextResponse.next();
//         response.cookies.set(
//           "accessToken",
//           refreshResponse.headers.get("Set-Cookie") || ""
//         );
//         return response;
//       } else {
//         const response = NextResponse.redirect(
//           new URL("/auth/login", request.url)
//         );
//         console.error("Refresh token failed999:", refreshResponse.statusText);
//         response.cookies.delete("accessToken");
//         response.cookies.delete("refreshToken");
//         return response;
//       }
//     }
//   }

//   if (!publicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
