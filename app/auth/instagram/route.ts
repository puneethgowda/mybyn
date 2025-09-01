import { NextResponse } from "next/server";

import { createClient } from "@/supabase/server";
import { COLLAB_LIMITS } from "@/utils/constants";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
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
    } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    const form = new FormData();

    form.append(
      "client_id",
      process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID as string
    );
    form.append("client_secret", process.env.INSTAGRAM_SECRET_KEY as string);
    form.append("grant_type", "authorization_code");
    form.append(
      "redirect_uri",
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/instagram/`
    );
    form.append("code", code.replace("#_", ""));

    const accessTokenJson = await fetch(
      `https://api.instagram.com/oauth/access_token`,
      {
        method: "POST",
        body: form,
      }
    );

    const accessToken = await accessTokenJson.json();

    if (!accessTokenJson.ok && !accessToken)
      return NextResponse.redirect(`${origin}/auth/instagram/error`);

    const instagramUserDetailsJson = await fetch(
      `https://graph.instagram.com/v23.0/me?fields=user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken?.access_token}`
    );
    const instagramUserDetails = await instagramUserDetailsJson.json();

    if (!instagramUserDetails)
      return NextResponse.redirect(`${origin}/auth/instagram/error`);

    if (!error && instagramUserDetails && instagramUserDetails.username) {
      if (instagramUserDetails.followers_count <= COLLAB_LIMITS.MIN_FOLLOWERS) {
        return NextResponse.redirect(
          `${origin}/auth/instagram/error?message=You need at least ${COLLAB_LIMITS.MIN_FOLLOWERS} followers to connect your Instagram account`
        );
      }
      const { error } = await supabase.from("creator_profile").insert({
        id: user?.id as string,
        name: instagramUserDetails.name,
        followers_count: instagramUserDetails.followers_count,
        profile_pic_url: instagramUserDetails.profile_picture_url,
        synced_at: new Date().toISOString(),
        bio: "",
        instagram_handle: instagramUserDetails.username,
      });

      if (error) {
        return NextResponse.redirect(
          `${origin}/auth/instagram/error?message=${error.message}`
        );
      }

      // Handle referral points for creator profile creation
      if (user?.id) {
        try {
          await supabase.rpc("handle_referral_points_for_profile", {
            profile_user_id: user.id,
            action_type: "CREATOR_PROFILE_CREATED",
          });
        } catch (_referralError) {
          // console.error("Error handling referral points:", referralError);
          // Don't fail the auth flow if referral handling fails
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}/auth/instagram/success`);
      } else if (forwardedHost) {
        return NextResponse.redirect(
          `https://${forwardedHost}${next}/auth/instagram/success`
        );
      } else {
        return NextResponse.redirect(`${origin}${next}/auth/instagram/success`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/instagram/error`);
}
