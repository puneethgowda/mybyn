"use client";

import {
  RiClipboardLine,
  RiFlashlightLine,
  RiShareLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/supabase/client";
import { getReferralCreditsOptions } from "@/utils/react-query/referral";
import {
  getUserOptions,
  getUserProfileOptions,
} from "@/utils/react-query/user";

export default function ReferralsPage() {
  const supabase = createClient();

  const { data: userData } = useQuery(getUserOptions(supabase));
  const user = userData?.user;

  const { data: userProfile, isPending: isPendingUserProfile } = useQuery(
    getUserProfileOptions(supabase, user?.id as string)
  );

  const { data: referralCredits, isPending: isPendingReferralCredits } =
    useQuery(getReferralCreditsOptions(supabase, user?.id as string));

  const referralCode = userProfile?.referral_code;
  const referralUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/login?referral_code=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      toast.success("Referral link copied to clipboard!");
    } catch {
      toast.error("Failed to copy referral link");
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join KOLLABIT",
          text: "Join me on KOLLABIT and discover amazing collaboration opportunities!",
          url: referralUrl,
        });
      } catch {
        // User cancelled sharing or error occurred
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-center items-center h-full">
        <Card className="shadow-none">
          <CardContent>
            <div>
              <h1 className="text-base lg:text-xl font-bold">Referrals</h1>
              <p className="text-muted-foreground text-xs md:text-sm">
                Track your referral progress and earnings
              </p>
            </div>
            <div className="my-6">
              {isPendingReferralCredits ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold">{referralCredits || 0}</h1>
                  <RiFlashlightLine
                    aria-hidden="true"
                    className="-ms-0.5 opacity-60"
                    size={24}
                  />
                </div>
              )}

              <p className="text-muted-foreground text-sm">
                Credits earned from referrals
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                disabled={isPendingUserProfile}
                variant="secondary"
                onClick={copyToClipboard}
              >
                <RiClipboardLine />
                Copy link
              </Button>
              <Button disabled={isPendingUserProfile} onClick={shareReferral}>
                <RiShareLine />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
