import { NextResponse } from "next/server";

export function checkAuth(req) {
  const userId = req.headers.get("user-id");
  console.log(userId);
  return userId;
}