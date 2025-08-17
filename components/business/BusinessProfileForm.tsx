"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Progress } from "@heroui/progress";
import { Avatar } from "@heroui/avatar";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { createClient } from "@/supabase/client";
import { getStoragePublicUrlBase } from "@/supabase/storage";
import { Constants } from "@/supabase/database.types";
import { getUserOptions } from "@/utils/react-query/user";
import { BusinessProfileFormValues } from "@/types/business-profile";
import { useSaveBusinessProfileMutation } from "@/utils/react-query/business/profile";

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

export function BusinessProfileForm() {
  const router = useRouter();

  const supabase = createClient();

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState<BusinessProfileFormValues>({
    name: "",
    description: "",
    type: "Retail",
    location: "",
    website: "",
    email: user?.email || "",
    phone: "",
    logo_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: saveBusinessProfile } =
    useSaveBusinessProfileMutation(supabase);

  // Handle input change
  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");

      setFormData({
        ...formData,
        [parent]: {
          ...((formData[parent as keyof BusinessProfileFormValues] ||
            {}) as Record<string, unknown>),
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }

    // Clear error when field is updated
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = "Business name is required";
        }
        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
        }
        break;
      case 2:
        if (!formData.type) {
          newErrors.type = "Business type is required";
        }
        if (!formData.location) {
          newErrors.location = "Location is required";
        }
        break;
      case 3:
        if (!formData.website.trim()) {
          newErrors.website = "Website is required";
        } else if (
          !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
            formData.website,
          )
        ) {
          newErrors.website = "Please enter a valid website URL";
        }
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        ) {
          newErrors.email = "Please enter a valid email address";
        }
        break;
      case 4:
        if (formData.logo_url === "") {
          newErrors.logo_url = "Please upload a logo";
        }
        break;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToDashboard = () => {
    router.push("/business/dashboard");
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (validateStep()) {
        setIsSubmitting(true);

        await saveBusinessProfile({
          ...formData,
          owner_id: user?.id as string,
        });

        setIsSubmitting(false);
        setShowSuccess(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      addToast({
        title: "Failed to create profile",
        description: "Something went wrong. Please try again.",
        color: "danger",
      });
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = async (newFiles: File[]) => {
    const { data, error } = await supabase.storage
      .from("business-profile-images")
      .upload(`${user?.id}-logo.png`, newFiles[0]);

    if (error)
      return addToast({
        title: "Failed to upload logo",
        description: "Something went wrong. Please try again.",
        color: "danger",
      });
    setFormData({
      ...formData,
      logo_url: getStoragePublicUrlBase(data?.fullPath),
    });
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <p className="text-default-600">
                Let&#39;s start with the basics about your business
              </p>
              <Input
                className="max-w-lg"
                errorMessage={errors.name}
                isInvalid={!!errors.name}
                label="Business Name"
                placeholder="e.g., Acme Corporation"
                value={formData.name}
                variant="bordered"
                onValueChange={(value) => handleChange("name", value)}
              />
              <Textarea
                className="max-w-lg"
                errorMessage={errors.description}
                isInvalid={!!errors.description}
                label="Business Description"
                minRows={4}
                placeholder="Describe what your business does, your mission, and what makes you unique"
                value={formData.description}
                variant="bordered"
                onValueChange={(value) => handleChange("description", value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Business Details</h2>
              <p className="text-default-600">
                Tell us more about your business type and location
              </p>
              <Select
                className="max-w-lg"
                errorMessage={errors.type}
                isInvalid={!!errors.type}
                label="Business Type"
                placeholder="Select business type"
                selectedKeys={formData.type ? [formData.type] : []}
                variant="bordered"
                onChange={(e) => handleChange("type", e.target.value)}
              >
                {TypeOptions.map((type) => (
                  <SelectItem key={type}>{type}</SelectItem>
                ))}
              </Select>
              <Select
                className="max-w-lg"
                errorMessage={errors.location}
                isInvalid={!!errors.location}
                label="Primary Location"
                placeholder="Select location"
                selectedKeys={formData.location ? [formData.location] : []}
                variant="bordered"
                onChange={(e) => handleChange("location", e.target.value)}
              >
                {locationOptions.map((location) => (
                  <SelectItem key={location}>{location}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <p className="text-default-600">
                How can influencers reach your business?
              </p>
              <Input
                className="max-w-lg"
                errorMessage={errors.website}
                isInvalid={!!errors.website}
                label="Website"
                placeholder="business.com"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">
                      https://
                    </span>
                  </div>
                }
                type="url"
                value={formData.website}
                variant="bordered"
                onValueChange={(value) => handleChange("website", value)}
              />
              <Input
                className="max-w-lg"
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Business Email"
                placeholder="contact@example.com"
                type="email"
                value={formData.email}
                variant="bordered"
                onValueChange={(value) => handleChange("email", value)}
              />
              <Input
                className="max-w-lg"
                label="Phone Number (optional)"
                maxLength={10}
                placeholder="8888888888"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">+91</span>
                  </div>
                }
                type="number"
                value={formData.phone}
                variant="bordered"
                onValueChange={(value) => handleChange("phone", value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Business Logo</h2>
              <p className="text-default-600">
                Upload your business logo to make your profile stand out
              </p>
              {formData.logo_url ? (
                <div className="flex flex-col items-center gap-4">
                  <Avatar
                    alt="Business Logo"
                    className="w-32 h-32"
                    src={formData.logo_url}
                  />
                  <div>
                    <Input
                      ref={fileInputRef}
                      className="hidden"
                      type="file"
                      onChange={(e) =>
                        handleLogoUpload(Array.from(e.target.files || []))
                      }
                    />
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => {
                        fileInputRef?.current?.click();
                      }}
                    >
                      Change Logo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-default-100 flex items-center justify-center">
                    <svg
                      className="text-default-400"
                      fill="none"
                      height="40"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="40"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  {errors.logo_url && (
                    <div className="text-sm text-danger">{errors.logo_url}</div>
                  )}
                  <div>
                    <Input
                      ref={fileInputRef}
                      className="hidden"
                      type="file"
                      onChange={(e) =>
                        handleLogoUpload(Array.from(e.target.files || []))
                      }
                    />
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => {
                        fileInputRef?.current?.click();
                      }}
                    >
                      Upload Logo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <Progress
          className="h-2"
          color="primary"
          value={(currentStep / totalSteps) * 100}
        />
      </div>

      {/* Success message */}
      {showSuccess ? (
        <Card className="w-full bg-success-50 border-success-200">
          <CardBody className="flex flex-col items-center py-10">
            <div className="rounded-full bg-success-100 p-3 mb-4">
              <svg
                className="text-success"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Profile Created!</h2>
            <p className="text-center mt-2 text-default-600">
              Your business profile has been successfully created. You can now
              start creating collaboration opportunities.
            </p>
            <div className="mt-2">
              <Button onPress={goToDashboard}>Go to dashboard</Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="w-full">
          <CardBody className="p-6">
            <motion.div
              key={currentStep}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </CardBody>
          <CardFooter className="flex justify-between px-6 py-4 border-t border-divider">
            <div>
              {currentStep > 1 ? (
                <Button
                  startContent={
                    <svg
                      fill="none"
                      height="18"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="19" x2="5" y1="12" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  }
                  variant="flat"
                  onPress={handleBack}
                >
                  Back
                </Button>
              ) : (
                <Button variant="flat" onPress={() => router.push("/")}>
                  Cancel
                </Button>
              )}
            </div>

            <div>
              {currentStep < totalSteps ? (
                <Button
                  color="primary"
                  endContent={
                    <svg
                      fill="none"
                      height="18"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="5" x2="19" y1="12" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  }
                  onPress={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  onPress={handleSubmit}
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
