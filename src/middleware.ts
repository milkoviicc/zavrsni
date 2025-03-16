import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const isAuthPage = req.nextUrl.pathname === "/auth";

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/people", "/users"], // Define the routes where this middleware applies
};
