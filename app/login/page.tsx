"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { addToast } from "@heroui/toast";
import { Google } from "iconoir-react";

import { title } from "@/components/primitives";
import { createClient } from "@/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const searchParams = useSearchParams();

  // Memoize Supabase client to avoid recreating on every render
  const supabase = useMemo(() => createClient(), []);

  // Auto-fill referral code from URL
  useEffect(() => {
    const urlReferralCode = searchParams.get("referral_code");

    if (urlReferralCode) {
      setReferralCode(urlReferralCode);
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    if (!acceptTerms) {
      addToast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        color: "warning",
      });

      return;
    }

    setLoading(true);
    try {
      const redirectUrl = new URL(`${window.location.origin}/auth/callback`);

      if (referralCode.trim()) {
        redirectUrl.searchParams.set("referral_code", referralCode.trim());
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl.toString(),
        },
      });

      if (error) {
        throw new Error(error.message || "Google sign-in failed");
      }
    } catch (error) {
      addToast({
        title: "Sign-in Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        color: "danger",
      });
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center min-h-full">
      <Card className="w-full max-w-sm sm:max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className={`${title({ color: "violet" })} py-3`}>Login</h1>
          <p className="py-2 text-center">Find the collabs made for you!</p>
        </CardHeader>
        <CardBody className="py-5 pt-0 space-y-4">
          {referralCode && (
            <Input
              label="Referral Code (Optional)"
              placeholder="Enter referral code"
              value={referralCode}
              variant="bordered"
              onValueChange={setReferralCode}
            />
          )}

          <Checkbox
            className="mb-2"
            isSelected={acceptTerms}
            size="sm"
            onValueChange={setAcceptTerms}
          >
            <span className="text-sm">
              I agree to the{" "}
              <a
                className="text-primary hover:underline"
                href="/terms"
                target="_blank"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="text-primary hover:underline"
                href="/privacy"
                target="_blank"
              >
                Privacy Policy
              </a>
            </span>
          </Checkbox>

          <Button
            aria-label="Sign in with Google"
            className="w-full"
            color="primary"
            isLoading={loading}
            startContent={<Google />}
            variant="solid"
            onPress={handleGoogleLogin}
          >
            Login with Google
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
