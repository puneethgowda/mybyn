"use client";

import { RiCheckDoubleLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BalanceWarning } from "@/components/balance-warning";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { POINTS } from "@/utils/constants";
import { COLLAB_STATUS } from "@/utils/enums";
import {
  useCreateCollabMutation,
  useUpdateCollabMutation,
} from "@/utils/react-query/business/collabs";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import {
  getUserOptions,
  getUserProfileOptions,
} from "@/utils/react-query/user";
import { toTitleCase } from "@/utils/string";

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
    getBusinessProfileOptions(supabase, user?.id as string)
  );

  const { data: userProfile } = useQuery(
    getUserProfileOptions(supabase, user?.id as string)
  );

  const createCollabMutation = useCreateCollabMutation(
    supabase,
    user?.id as string
  );
  const updateCollabMutation = useUpdateCollabMutation(supabase);

  const isSubmitting =
    createCollabMutation.isPending || updateCollabMutation.isPending;

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = "Collab title is required";
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
          newErrors.collab_type = "Collaboration type is required";
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

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateBalance = () => {
    const currentBalance = userProfile?.balance || 0;

    if (currentBalance < POINTS.CREATE_COLLAB) {
      toast.warning(
        `You need ${POINTS.CREATE_COLLAB} points to create a collaboration. Current balance: ${currentBalance} points.`
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep() || !businessProfile?.id) return;

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
            toast.success("Created Successfully");
          },
          onError: () => {
            toast.error("Failed to update!");
          },
        }
      );
    } else {
      createCollabMutation.mutate(collabData, {
        onSuccess: () => {
          setShowSuccess(true);
          toast.success("Updated Successfully");
        },
        onError: () => {
          toast.error("Failed to update!");
        },
      });
    }
  };

  const handleCancel = () => {
    if (isEditing && collabId) {
      router.push(`/business/dashboard/collabs/${collabId}`);
    } else {
      router.push("/business/dashboard/collabs");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">What&#39;s your collab title?</h2>
              <p className="text-sm text-muted-foreground">
                Create a catchy title that describes your collaboration
                opportunity
              </p>
            </div>
            <div>
              <Input
                className="max-w-lg"
                placeholder="e.g., Summer Fashion Showcase"
                value={formData.title}
                onChange={e => handleChange("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">{errors.title}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold">
                Describe your collaboration
              </h2>
              <p className="text-muted-foreground">
                Provide details about what you&#39;re looking for from creators
              </p>
            </div>
            <div>
              <Textarea
                className="max-w-lg"
                placeholder="Describe what you want creators to do, what you're offering, and any specific requirements"
                rows={5}
                value={formData.description}
                onChange={e => handleChange("description", e.target.value)}
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h2 className=" font-semibold">Preferred social platform</h2>
              <p className="text-sm text-muted-foreground">
                Choose platform you want creator to use to create their content
              </p>
            </div>
            <div>
              <Select
                value={formData.platform}
                onValueChange={value =>
                  handleChange(
                    "platform",
                    value as Database["public"]["Enums"]["platform_type"]
                  )
                }
              >
                <SelectTrigger className="max-w-lg">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                  <SelectItem value="YOUTUBE">YouTube</SelectItem>
                </SelectContent>
              </Select>
              {errors.platform && (
                <p className="text-destructive text-sm mt-1">
                  {errors.platform}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h2 className=" font-semibold">{`Minimum ${
                formData?.platform === "INSTAGRAM" ? "followers" : "subscribers"
              } count`}</h2>
              <p className="text-sm text-muted-foreground">
                Specify the minimum number of{" "}
                {formData?.platform === "INSTAGRAM"
                  ? "followers"
                  : "subscribers"}{" "}
                a creator must have on their{" "}
                {toTitleCase(formData?.platform?.toLowerCase())} to be eligible
                for this collaboration.
              </p>
            </div>
            <div>
              <Input
                className="max-w-xs"
                placeholder="e.g., 5000"
                type="number"
                value={formData.min_followers.toString()}
                onChange={e =>
                  handleChange("min_followers", Number(e.target.value))
                }
              />
              {errors.min_followers && (
                <p className="text-destructive text-sm mt-1">
                  {errors.min_followers}
                </p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold">
                What type of collaboration is this?
              </h2>
              <p className="text-muted-foreground">
                Choose how you&#39;ll compensate creators for their content
              </p>
            </div>
            <div>
              <RadioGroup
                className="flex gap-4"
                value={formData.collab_type}
                onValueChange={value =>
                  handleChange(
                    "collab_type",
                    value as Database["public"]["Enums"]["collab_type"]
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="PAID" value="PAID" />
                  <Label htmlFor="PAID">Paid</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="BARTER" value="BARTER" />
                  <Label htmlFor="BARTER">Barter</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="PRODUCT_CASH" value="PRODUCT_CASH" />
                  <Label htmlFor="PRODUCT_CASH">Product + Cash</Label>
                </div>
              </RadioGroup>
              {errors.collab_type && (
                <p className="text-destructive text-sm mt-1">
                  {errors.collab_type}
                </p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <h2 className=" font-semibold">What&#39;s your budget?</h2>
              <p className="text-sm text-muted-foreground">
                {formData.collab_type === "BARTER"
                  ? "For barter collaborations, describe what you're offering instead of cash"
                  : "Enter the amount you're willing to pay creators"}
              </p>
            </div>
            {formData.collab_type !== "BARTER" ? (
              <div>
                <Input
                  className="max-w-xs"
                  placeholder="e.g., 5000"
                  type="number"
                  value={formData.amount.toString()}
                  onChange={e => handleChange("amount", Number(e.target.value))}
                />
                {errors.amount && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.amount}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground space-y-4">
                <p className="text-sm text-muted-foreground">
                  Since this is a barter collaboration, you can describe your
                  offer in the description section.
                </p>
                <Textarea
                  className="max-w-lg"
                  placeholder="Describe what you want creators to do, what you're offering, and any specific requirements"
                  rows={5}
                  value={formData.description}
                  onChange={e => handleChange("description", e.target.value)}
                />
                {errors.description && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <h2 className=" font-semibold">Preferred languages</h2>
              <p className="text-sm text-muted-foreground">
                Select the languages creators should be able to create content
                in
              </p>
            </div>
            <div className="flex flex-wrap gap-2 max-w-lg">
              {languageOptions.map(language => (
                <Badge
                  key={language}
                  className={`cursor-pointer px-3 py-1 ${
                    formData.languages?.includes(language)
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                  variant={
                    formData.languages?.includes(language)
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => {
                    const updatedLanguages = formData.languages?.includes(
                      language
                    )
                      ? formData.languages.filter(lang => lang !== language)
                      : [...(formData.languages || []), language];

                    handleChange("languages", updatedLanguages);
                  }}
                >
                  {language}
                </Badge>
              ))}
              {errors.languages && (
                <p className="text-destructive text-sm mt-1">
                  {errors.languages}
                </p>
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
      {!isEditing && (
        <BalanceWarning
          action="create"
          className="mb-4"
          currentBalance={userProfile?.balance || 0}
          requiredPoints={POINTS.CREATE_COLLAB}
        />
      )}
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

      {showSuccess ? (
        <Card className="w-full shadow-none">
          <CardContent className="flex flex-col items-center py-10">
            <div className="rounded-full bg-success-100 p-3 mb-2">
              <RiCheckDoubleLine />
            </div>
            <h2 className="text-xl font-semibold">
              {isEditing ? "Collaboration Updated!" : "Collaboration Posted!"}
            </h2>
            <p className="text-sm text-center text-muted-foreground">
              {isEditing
                ? "Your collaboration has been successfully updated."
                : "Your collaboration has been successfully posted. Creators can now apply."}
            </p>
            <Link className="mt-4" href="/business/dashboard/collabs">
              <Button>Go to my collabs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full shadow-none">
          <CardContent className="">
            <motion.div
              key={currentStep}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between px-6 py-4 border-t">
            <div>
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Cancel
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button variant="default" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  disabled={isSubmitting}
                  variant="default"
                  onClick={handleSubmit}
                >
                  {isEditing ? "Update Collab" : "Submit Collab"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      <Dialog
        open={showConfirmModal}
        onOpenChange={open => !open && setShowConfirmModal(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Cancel Editing?" : "Cancel Creation?"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Are you sure you want to cancel editing this collaboration? All changes will be lost."
                : "Are you sure you want to cancel creating this collaboration? All progress will be lost."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Continue {isEditing ? "Editing" : "Creating"}
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
