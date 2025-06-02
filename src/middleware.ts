import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const isAuthPage = req.nextUrl.pathname === "/auth";

  // šaljemo korisnika na stranicu za prijavu ako nije prijavljen i pokušava pristupiti stranicama koje zahtijevaju autentifikaciju
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // šaljemo korisnika na home page ako je prijavljen i pokušava pristupiti stranicama za prijavu
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ako je korisnik prijavljen i na stranici gdje može pristupiti, nastavljamo s zahtjevom
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/people", "/users"], // rute u kojima middleware treba da se primjeni
};
