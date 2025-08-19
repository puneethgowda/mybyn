"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { RiFileCopyLine, RiShareLine } from "@remixicon/react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getUserOptions,
  getUserProfileOptions,
} from "@/utils/react-query/user";
import { createClient } from "@/supabase/client";
import { POINTS } from "@/utils/constants";

interface ReferralProps {
  variant?: "dashboard" | "profile" | "business";
  className?: string;
}

export function Referral({ variant = "dashboard", className }: ReferralProps) {
  const [copied, setCopied] = useState(false);

  const supabase = createClient();

  const { data: userData } = useQuery(getUserOptions(supabase));
  const user = userData?.user;

  const { data: userProfile } = useQuery(
    getUserProfileOptions(supabase, user?.id as string),
  );

  const referralCode = `${userProfile?.referral_code}`;
  const referralUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/login?referral_code=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success("Referral link copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
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
      } catch (error) {
        // User cancelled sharing or error occurred
      }
    } else {
      copyToClipboard();
    }
  };

  if (variant === "dashboard") {
    return (
      <Card className={className}>
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-sm md:text-lg font-bold">Refer & Earn</h3>
          </div>
          <Badge className="text-xs" variant="secondary">
            New
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs md:text-sm text-muted-foreground">
            Invite friends and earn rewards for every successful referral!
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <RiFileCopyLine className="size-4 mr-2" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button size="sm" variant="default" onClick={shareReferral}>
              <RiShareLine className="size-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Referral Program</h3>
          <p className="text-sm text-muted-foreground">
            Share your referral link and earn{" "}
            <strong>{POINTS.REFERRAL_REWARD} points</strong> when friends join
            KOLLABIT through your link.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            className="text-sm text-muted-foreground"
            htmlFor="referral-code"
          >
            Your Referral Code
          </label>
          <Input readOnly id="referral-code" value={referralCode} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm text-muted-foreground"
            htmlFor="referral-link"
          >
            Referral Link
          </label>
          <Input
            readOnly
            className="text-xs"
            id="referral-link"
            value={referralUrl}
          />
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={copyToClipboard}>
            <RiFileCopyLine />
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button size="sm" variant="default" onClick={shareReferral}>
            <RiShareLine />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
