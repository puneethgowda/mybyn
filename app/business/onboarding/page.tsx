"use client";

import { BusinessProfileForm } from "@/components/business/BusinessProfileForm";

export default function BusinessOnboardingPage() {
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
