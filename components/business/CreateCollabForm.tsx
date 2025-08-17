"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { RadioGroup, Radio } from "@heroui/radio";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { COLLAB_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { createClient } from "@/supabase/client";
import {
  useCreateCollabMutation,
  useUpdateCollabMutation,
} from "@/utils/react-query/business/collabs";
import { Database } from "@/supabase/database.types";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import {
  getUserOptions,
  getUserProfileOptions,
} from "@/utils/react-query/user";
import { toTitleCase } from "@/utils/string";
import { POINTS } from "@/utils/constants";
import { BalanceWarning } from "@/components/balance-warning";

export interface FormData {
  title: string;
  description: string;
  platform: Database["public"]["Enums"]["platform_type"];
  collab_type: Database["public"]["Enums"]["collab_type"];
  amount: number;
  min_followers: number;
  languages: Database["public"]["Enums"]["languages"][];
}

interface CreateCollabFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
  collabId?: string;
}

// Language options from database enum
const languageOptions: Database["public"]["Enums"]["languages"][] = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
];

export function CreateCollabForm({
  initialData,
  isEditing = false,
  collabId,
}: CreateCollabFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    platform: "INSTAGRAM",
    collab_type: "BARTER",
    amount: 0,
    min_followers: 1000,
    languages: [],
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: businessProfile } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );

  const { data: userProfile } = useQuery(
    getUserProfileOptions(supabase, user?.id as string),
  );

  // Mutations
  const createCollabMutation = useCreateCollabMutation(
    supabase,
    user?.id as string,
  );
  const updateCollabMutation = useUpdateCollabMutation(supabase);

  const isSubmitting =
    createCollabMutation.isPending || updateCollabMutation.isPending;

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // Handle input change
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
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
        if (!formData.title.trim()) {
          newErrors.title = "Title is required";
        }
        break;
      case 2:
        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
        }
        break;
      case 3:
        if (!formData.platform) {
          newErrors.platform = "Platform is required";
        }
        break;
      case 4:
        if (!formData.min_followers) {
          newErrors.min_followers = "Minimum count is required";
        }
        break;
      case 5:
        if (!formData.collab_type) {
          newErrors.collabType = "Collaboration type is required";
        }
        break;
      case 6:
        if (formData.collab_type !== "BARTER" && formData.amount <= 0) {
          newErrors.amount = "Amount must be greater than 0";
        }
        break;
      case 7:
        if (formData.languages.length === 0) {
          newErrors.languages = "Select at least one language";
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

  // Add this validation function before handleSubmit
  const validateBalance = () => {
    const currentBalance = userProfile?.balance || 0;

    if (currentBalance < POINTS.CREATE_COLLAB) {
      addToast({
        title: "Insufficient Balance",
        description: `You need ${POINTS.CREATE_COLLAB} points to create a collaboration. Current balance: ${currentBalance} points.`,
        color: "warning",
      });

      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep() || !businessProfile?.id) return;

    // Add balance validation for new collabs only
    if (!isEditing && !validateBalance()) return;

    const collabData = {
      ...formData,
      amount: formData.collab_type === "BARTER" ? null : formData.amount,
      business_id: businessProfile.id,
      status:
        COLLAB_STATUS.ACTIVE as Database["public"]["Enums"]["collab_status"],
    };

    if (isEditing && collabId) {
      updateCollabMutation.mutate(
        { ...collabData, id: collabId },
        {
          onSuccess: () => {
            setShowSuccess(true);
          },
        },
      );
    } else {
      createCollabMutation.mutate(collabData, {
        onSuccess: () => {
          setShowSuccess(true);
        },
      });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isEditing && collabId) {
      router.push(`/business/dashboard/collabs/${collabId}`);
    } else {
      router.push("/business/dashboard/collabs");
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              What&#39;s your collab title?
            </h2>
            <p className="text-default-600">
              Create a catchy title that describes your collaboration
              opportunity
            </p>
            <Input
              className="max-w-lg"
              errorMessage={errors.title}
              isInvalid={!!errors.title}
              label="Collab Title"
              placeholder="e.g., Summer Fashion Showcase"
              value={formData.title}
              variant="bordered"
              onValueChange={(value) => handleChange("title", value)}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Describe your collaboration
            </h2>
            <p className="text-default-600">
              Provide details about what you&#39;re looking for from creators
            </p>
            <Textarea
              className="max-w-lg"
              errorMessage={errors.description}
              isInvalid={!!errors.description}
              label="Description"
              minRows={5}
              placeholder="Describe what you want creators to do, what you're offering, and any specific requirements"
              value={formData.description}
              variant="bordered"
              onValueChange={(value) => handleChange("description", value)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preferred social platform</h2>
            <p className="text-default-600">
              Choose platform you want creator to use to create their content
            </p>
            <Select
              className="max-w-lg"
              errorMessage={errors.platform}
              isInvalid={!!errors.platform}
              label="Platform"
              placeholder="Select platform"
              selectedKeys={[formData.platform]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const selected = Array.from(
                  keys,
                )[0] as Database["public"]["Enums"]["platform_type"];

                if (selected) handleChange("platform", selected);
              }}
            >
              <SelectItem key="INSTAGRAM">Instagram</SelectItem>
              <SelectItem key="YOUTUBE">YouTube</SelectItem>
            </Select>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{`Minimum ${formData?.platform === "INSTAGRAM" ? "followers" : "subscribers"} count`}</h2>
            <p className="text-default-600">
              Specify the minimum number of{" "}
              {formData?.platform === "INSTAGRAM" ? "followers" : "subscribers"}{" "}
              a creator must have on their{" "}
              {toTitleCase(formData?.platform?.toLowerCase())} to be eligible
              for this collaboration.
            </p>
            <Input
              className="max-w-xs"
              errorMessage={errors.min_followers}
              isInvalid={!!errors.min_followers}
              label={`Minimum ${formData?.platform === "INSTAGRAM" ? "followers" : "subscribers"} count`}
              placeholder="e.g., 5000"
              type="number"
              value={formData.min_followers.toString()}
              variant="bordered"
              onValueChange={(value) =>
                handleChange("min_followers", Number(value))
              }
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              What type of collaboration is this?
            </h2>
            <p className="text-default-600">
              Choose how you&#39;ll compensate creators for their content
            </p>
            <RadioGroup
              errorMessage={errors.collabType}
              isInvalid={!!errors.collabType}
              label="Collaboration Type"
              orientation="horizontal"
              value={formData.collab_type}
              onValueChange={(value) =>
                handleChange(
                  "collab_type",
                  value as Database["public"]["Enums"]["collab_type"],
                )
              }
            >
              <Radio value="PAID">Paid</Radio>
              <Radio value="BARTER">Barter</Radio>
              <Radio value="PRODUCT_CASH">Product + Cash</Radio>
            </RadioGroup>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">What&#39;s your budget?</h2>
            <p className="text-default-600">
              {formData.collab_type === "BARTER"
                ? "For barter collaborations, describe what you're offering instead of cash"
                : "Enter the amount you're willing to pay creators"}
            </p>
            {formData.collab_type !== "BARTER" ? (
              <Input
                className="max-w-xs"
                errorMessage={errors.amount}
                isInvalid={!!errors.amount}
                label="Amount (₹)"
                placeholder="e.g., 5000"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₹</span>
                  </div>
                }
                type="number"
                value={formData.amount.toString()}
                variant="bordered"
                onValueChange={(value) => handleChange("amount", Number(value))}
              />
            ) : (
              <div className="text-muted-foreground space-y-4">
                <p>
                  Since this is a barter collaboration, you can describe your
                  offer in the description section.
                </p>
                <Textarea
                  className="max-w-lg"
                  errorMessage={errors.description}
                  isInvalid={!!errors.description}
                  label="Description"
                  minRows={5}
                  placeholder="Describe what you want creators to do, what you're offering, and any specific requirements"
                  value={formData.description}
                  variant="bordered"
                  onValueChange={(value) => handleChange("description", value)}
                />
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preferred languages</h2>
            <p className="text-default-600">
              Select the languages creators should be able to create content in
            </p>
            <div className="flex flex-wrap gap-2 max-w-lg">
              {languageOptions.map((language) => (
                <Chip
                  key={language}
                  className="cursor-pointer"
                  color={
                    formData.languages.includes(language)
                      ? "primary"
                      : "default"
                  }
                  variant={
                    formData.languages.includes(language) ? "solid" : "bordered"
                  }
                  onClick={() => {
                    const updatedLanguages = formData.languages.includes(
                      language,
                    )
                      ? formData.languages.filter((lang) => lang !== language)
                      : [...formData.languages, language];

                    handleChange("languages", updatedLanguages);
                  }}
                >
                  {language}
                </Chip>
              ))}
            </div>
            {errors.languages && (
              <p className="text-danger text-sm">{errors.languages}</p>
            )}
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review Your Collaboration</h2>
            <p className="text-default-600">
              Please review all details before submitting your collaboration
            </p>

            <Card className="bg-content1/50">
              <CardBody className="gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Title
                  </h3>
                  <p className="text-foreground">{formData.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Description
                  </h3>
                  <p className="text-foreground">{formData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Platform
                    </h3>
                    <p className="text-foreground">{formData.platform}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Collaboration Type
                    </h3>
                    <p className="text-foreground">
                      {COLLAB_TYPE[formData.collab_type]}
                    </p>
                  </div>

                  {formData.collab_type !== "BARTER" && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Budget
                      </h3>
                      <p className="text-foreground">
                        ₹{formData.amount.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.languages.map((language) => (
                        <Chip key={language} size="sm" variant="flat">
                          {language}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {!isEditing && (
        <BalanceWarning
          action="create"
          className="mb-4"
          currentBalance={userProfile?.balance || 0}
          requiredPoints={POINTS.CREATE_COLLAB}
        />
      )}
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
            <h2 className="text-xl font-semibold">
              {isEditing ? "Collaboration Updated!" : "Collaboration Posted!"}
            </h2>
            <p className="text-center mt-2 text-default-600">
              {isEditing
                ? "Your collaboration has been successfully updated."
                : "Your collaboration has been successfully posted. Creators can now apply."}
            </p>
            <Link className="mt-4" href="/business/dashboard/collabs">
              <Button>Go to my collabs</Button>
            </Link>
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
                <Button
                  variant="flat"
                  onPress={() => setShowConfirmModal(true)}
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex gap-2">
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
                  {isEditing ? "Update Collab" : "Submit Collab"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditing ? "Cancel Editing?" : "Cancel Creation?"}
              </ModalHeader>
              <ModalBody>
                <p>
                  {isEditing
                    ? "Are you sure you want to cancel editing this collaboration? All changes will be lost."
                    : "Are you sure you want to cancel creating this collaboration? All progress will be lost."}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Continue {isEditing ? "Editing" : "Creating"}
                </Button>
                <Button color="danger" onPress={handleCancel}>
                  Yes, Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
