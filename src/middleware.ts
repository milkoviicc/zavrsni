import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const isAuthPage = req.nextUrl.pathname === "/auth";

  if (!token && !isAuthPage) {
    // 🚀 If user is NOT authenticated, allow access to /auth, but block other pages
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (token && isAuthPage) {
    // 🚀 If user IS authenticated, prevent them from accessing /auth and redirect home
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/people", "/users"], // Define the routes where this middleware applies
};
