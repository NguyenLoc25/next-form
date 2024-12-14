import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const protectedRoutes = ["/manage-form", "/account"]; // Add routes to protect

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      const signInUrl = new URL("/api/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  const userId = token?._id;

  if (!userId) {
    console.error("User ID is missing in the token:", token);
  }else{
    console.log("User ID:", userId);
  }

  const modifiedRequest = NextResponse.next();
  modifiedRequest.headers.set("user-id", userId);
  return modifiedRequest;
}
