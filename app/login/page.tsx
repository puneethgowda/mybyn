"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const urlReferralCode = searchParams.get("referral_code");

    if (urlReferralCode) {
      setReferralCode(urlReferralCode);
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    if (!acceptTerms) {
      toast.warning("Please accept the terms and conditions to continue.");

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
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <AnimatedGridPattern
        className={cn(
          "[mask-image:radial-gradient(800_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
        duration={3}
        maxOpacity={0.1}
        numSquares={30}
        repeatDelay={1}
      />
      <div className="bg-white rounded-4xl z-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <div className="mb-12">
            <Link href="/">
              <button className="flex items-center cursor-pointer transition-colors w-fit">
                <ArrowLeft className="mr-2" size={18} />
                <span className="text-sm">Back to the website</span>
              </button>
            </Link>
          </div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-semibold">KOLLABIT</span>
            </div>
            <h1 className="text-4xl font-medium font-mosans">
              Sign in to KOLLABIT
            </h1>
            <p className="text-muted-foreground">Your collab, made simple.</p>
          </div>
          {/* Terms and Conditions */}
          <div className="flex items-center gap-2 mb-6">
            <Checkbox
              checked={acceptTerms}
              id="accept-terms"
              onCheckedChange={(v) => setAcceptTerms(v === true)}
            />
            <label className="text-sm cursor-pointer" htmlFor="accept-terms">
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
            </label>
          </div>
          {/* Google Sign Up */}
          <Button
            aria-label="Sign in with Google"
            className="w-full"
            disabled={loading}
            variant="outline"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
