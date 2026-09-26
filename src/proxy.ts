import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ROUTES } from "@/config/site";
import { getSupabaseAuthEnv } from "@/server/env";

/**
 * Runs only for the admin area and login page:
 *  1. Refreshes the Supabase session cookie so Server Components see a valid session.
 *  2. Optimistically redirects signed-out visitors away from /admin.
 * Authorization is still enforced in the Data Access Layer (`requireAdmin`) and by RLS.
 */
export async function proxy(request: NextRequest) {
  const env = getSupabaseAuthEnv();
  if (!env) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  if (!user && pathname.startsWith(ROUTES.admin)) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
