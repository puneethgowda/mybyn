"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/supabase/client";
import { getStoragePublicUrlBase } from "@/supabase/storage";
import { Constants } from "@/supabase/database.types";
import { getUserOptions } from "@/utils/react-query/user";
import { useSaveBusinessProfileMutation } from "@/utils/react-query/business/profile";
import { Toaster } from "@/components/ui/sonner";

// Business type options
const TypeOptions = Constants.public.Enums.business_type;

// Location options
const locationOptions = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(TypeOptions, {
    error: "Business type is required",
  }),
  location: z.string().min(1, "Location is required"),
  website: z
    .string()
    .min(1, "Website is required")
    .url("Please enter a valid website URL"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().optional(),
  logo_url: z.string().min(1, "Please upload a logo"),
});

type FormValues = z.infer<typeof formSchema>;

export function BusinessProfileForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const supabase = createClient();
  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { mutateAsync: saveBusinessProfile } =
    useSaveBusinessProfileMutation(supabase);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "Retail",
      location: locationOptions[0],
      website: "",
      email: user?.email || "",
      phone: "",
      logo_url: "",
    },
  });

  // Validate current step
  const validateStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await form.trigger(["name", "description"]);
        break;
      case 2:
        isValid = await form.trigger(["type", "location"]);
        break;
      case 3:
        isValid = await form.trigger(["website", "email", "phone"]);
        break;
      case 4:
        isValid = await form.trigger(["logo_url"]);
        break;
    }

    return isValid;
  };

  // Handle next step
  const handleNext = async () => {
    if (await validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Handle back step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from("business-profile-images")
        .upload(`${user?.id}-logo.png`, file);

      if (error) throw error;

      const logoUrl = getStoragePublicUrlBase(data?.fullPath);

      form.setValue("logo_url", logoUrl);
    } catch (error) {
      toast.error("Failed to upload logo");
    }
  };

  // Form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await saveBusinessProfile({
        ...data,
        phone: data?.phone as string,
        owner_id: user?.id as string,
      });
      setIsSubmitting(false);
      setShowSuccess(true);
    } catch (error) {
      toast.error("Failed to create profile");
      setIsSubmitting(false);
    }
  };

  // Step content components
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Let&#39;s start with the basics about your business
        </p>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">
              Business Name
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., Acme Corporation" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">
              Business Description
            </FormLabel>
            <FormControl>
              <Textarea
                className="min-h-[100px]"
                placeholder="Describe what your business does..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold">Business Details</h2>
        <p className="text-sm text-muted-foreground">
          Tell us more about your business type and location
        </p>
      </div>

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">
              Business Type
            </FormLabel>
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">
              Primary Location
            </FormLabel>
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locationOptions.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold">Contact Information</h2>
        <p className="text-sm text-muted-foreground">
          How can influencers reach your business?
        </p>
      </div>

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">Website</FormLabel>
            <FormControl>
              <div className="flex">
                <Input
                  {...field}
                  className=""
                  placeholder="https://business.com"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">
              Business Email
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="contact@example.com"
                type="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">
              Phone Number (optional)
            </FormLabel>
            <FormControl>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                  +91
                </span>
                <Input
                  {...field}
                  className="rounded-l-none"
                  maxLength={10}
                  placeholder="8888888888"
                  type="tel"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold">Business Logo</h2>
        <p className="text-sm text-muted-foreground">
          Upload your business logo to make your profile stand out
        </p>
      </div>

      <FormField
        control={form.control}
        name="logo_url"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex flex-col items-center gap-4">
                {field.value ? (
                  <Avatar className="w-32 h-32">
                    <AvatarImage alt="Business Logo" src={field.value} />
                    <AvatarFallback>LOGO</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="text-muted-foreground"
                      fill="none"
                      height="40"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="40"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) handleLogoUpload(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {field.value ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
            </FormControl>
            <FormMessage className="text-center" />
          </FormItem>
        )}
      />
    </div>
  );

  // Success message component
  const renderSuccess = () => (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center py-10">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <svg
            className="text-green-600"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Profile Created!</h2>
        <p className="text-center mt-2 text-muted-foreground">
          Your business profile has been successfully created. You can now start
          creating collaboration opportunities.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push("/business/dashboard")}
        >
          Go to dashboard
        </Button>
      </CardContent>
    </Card>
  );

  if (showSuccess) {
    return renderSuccess();
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <Progress className="h-2" value={(currentStep / totalSteps) * 100} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="">
              <motion.div
                key={currentStep}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </motion.div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  currentStep > 1 ? handleBack() : router.push("/")
                }
              >
                {currentStep > 1 ? "Back" : "Cancel"}
              </Button>

              <Button
                disabled={isSubmitting}
                type={currentStep === totalSteps ? "submit" : "button"}
                onClick={currentStep < totalSteps ? handleNext : undefined}
              >
                {currentStep < totalSteps ? "Next" : "Complete Profile"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
