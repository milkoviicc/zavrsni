import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(req: NextRequest) {
  // Await the cookies() to get the resolved cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token');  // Get the token cookie

  if (!token) {
    // If no token, redirect to /auth
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  if(token && req.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth', '/people', '/users'],  // You can change this to match specific paths
};
