"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { redirect } from "next/navigation";

import { BusinessProfileForm } from "@/components/business/BusinessProfileForm";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";

export default function BusinessOnboardingPage() {
  const supabase = createClient();

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { error, isPending } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );

  useEffect(() => {
    if (!isPending && !error) {
      redirect("/business/dashboard");
    }
  }, [error, isPending]);

  return (
    <div className="flex flex-col justify-center container max-w-3xl mx-auto my-auto h-full px-4 py-6">
      <div className="mb-8">
        <h1 className="text-lg font-bold">Create Your Business Profile</h1>
        <p className="text-muted-foreground text-sm">
          Complete your profile to start connecting with creators
        </p>
      </div>

      <BusinessProfileForm />
    </div>
  );
}
