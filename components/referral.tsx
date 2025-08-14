"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { ShareAndroid, Copy, Gift } from "iconoir-react";
import { useQuery } from "@tanstack/react-query";

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

  // Generate referral code based on userId (you can customize this logic)
  const referralCode = `${userProfile?.referral_code}`;
  const referralUrl = `${window.location.origin}/login?referral_code=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      addToast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
        color: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addToast({
        title: "Copy Failed",
        description: "Failed to copy referral link",
        color: "danger",
      });
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join MYBYN",
          text: "Join me on MYBYN and discover amazing collaboration opportunities!",
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
            <Gift className="size-5 text-primary" />
            <h3 className="text-sm md:text-lg font-bold">Refer & Earn</h3>
          </div>
          <Chip color="primary" size="sm" variant="flat">
            New
          </Chip>
        </CardHeader>
        <CardBody className="space-y-3">
          <p className="text-xs md:text-sm text-default-600">
            Invite friends and earn rewards for every successful referral!
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              startContent={<Copy className="size-4" />}
              variant="flat"
              onPress={copyToClipboard}
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button
              color="primary"
              size="sm"
              startContent={<ShareAndroid className="size-4" />}
              onPress={shareReferral}
            >
              Share
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gift className="size-5 text-primary" />
          <h3 className="text-base md:text-lg font-semibold">
            Referral Program
          </h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-sm text-default-600">
          Share your referral link and earn{" "}
          <strong>{POINTS.REFERRAL_REWARD} points</strong> when friends join
          MYBYN through your link.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="referral-code">
            Your Referral Code
          </label>
          <Input
            readOnly
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={copyToClipboard}
              >
                <Copy className="size-4" />
              </Button>
            }
            id="referral-code"
            value={referralCode}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="referral-link">
            Referral Link
          </label>
          <Input
            readOnly
            className="text-xs"
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={copyToClipboard}
              >
                <Copy className="size-4" />
              </Button>
            }
            id="referral-link"
            value={referralUrl}
          />
        </div>

        <div className="flex gap-2">
          <Button
            startContent={<Copy className="size-4" />}
            variant="flat"
            onPress={copyToClipboard}
          >
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            color="primary"
            startContent={<ShareAndroid className="size-4" />}
            onPress={shareReferral}
          >
            Share
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
