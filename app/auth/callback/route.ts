import { NextResponse } from "next/server";

import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const referralCode = searchParams.get("referral_code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";

  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (referralCode && user) {
      // Store referral code in user_profile.referred_by
      await supabase.from("user_profile").upsert(
        {
          user_id: user.id,
          referred_by: referralCode,
          balance: 0,
        },
        {
          onConflict: "user_id",
        },
      );
    }

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
