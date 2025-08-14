import { title, subtitle } from "@/components/primitives";
import { BusinessProfileForm } from "@/components/business/BusinessProfileForm";

export default function BusinessOnboardingPage() {
  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto my-auto h-full px-4 py-6">
      <div className="mb-8">
        <h1 className={title({ size: "sm" })}>Create Your Business Profile</h1>
        <p className={subtitle({ class: "mt-1" })}>
          Complete your profile to start connecting with creators
        </p>
      </div>

      <BusinessProfileForm />
    </div>
  );
}
