import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./supabaseServer";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const supabaseServer = await createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (user) return NextResponse.next();
  else {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/learn/:path*", "/lesson/:path*"],
};
