"use client";

import {
  RiCalendar2Line,
  RiCheckDoubleLine,
  RiInformationLine,
  RiInstagramFill,
  RiMapPin2Line,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// removed Avatar imports after banner change
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useDisclosure } from "@/hooks/useDisclosure";
import { createClient } from "@/supabase/client";
import { CollabWithBusinessProfile } from "@/types/collab";
import { ValidationResult } from "@/types/validation";
import { POINTS } from "@/utils/constants";
import { formatDateForDisplay } from "@/utils/date";
import {
  APPLICATION_STATUS,
  COLLAB_STATUS,
  COLLAB_TYPE,
  PLATFORM_TYPE,
} from "@/utils/enums";
import { handleConnectInstagram } from "@/utils/instagram-connect";
import {
  checkUserAppliedToCollabOptions,
  useApplyToCollabMutation,
} from "@/utils/react-query/collabs";
import {
  getCreatorProfileOptions,
  getUserOptions,
  getUserProfileOptions,
} from "@/utils/react-query/user";
import { toTitleCase } from "@/utils/string";
import {
  areAllValidationsPassed,
  getFirstValidationError,
  validateCreatorApplication,
} from "@/utils/validation/creator-application";

interface CollabDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collabDetails?: CollabWithBusinessProfile | null;
  onApply?: () => void;
}

const MAX_CHARACTERS = 200;

export function CollabDetailsDrawer({
  isOpen,
  onClose,
  collabDetails,
}: CollabDetailsDrawerProps) {
  const [collab, setCollab] = useState<CollabWithBusinessProfile | null>(null);
  const supabase = createClient();
  const [applicationMessage, setApplicationMessage] = useState("");
  const {
    isOpen: isMessageModalOpen,
    onOpen: onMessageModalOpen,
    onClose: onMessageModalClose,
  } = useDisclosure();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const applyToCollabMutation = useApplyToCollabMutation(supabase);

  const { data: collabApplicationDetails, refetch } = useQuery(
    checkUserAppliedToCollabOptions(
      supabase,
      user?.id as string,
      collabDetails?.id as string
    )
  );

  const { data: userProfile } = useQuery(
    getUserProfileOptions(supabase, user?.id as string)
  );

  const { data: creatorProfile } = useQuery(
    getCreatorProfileOptions(supabase, user?.id as string)
  );

  // Run validations
  const validationResults: ValidationResult[] = validateCreatorApplication({
    creatorProfile,
    creatorFollowers: creatorProfile?.followers_count || null,
    requiredFollowers: collab?.min_followers || 0,
    userBalance: userProfile?.balance || 0,
    requiredPoints: POINTS.APPLY_COLLAB,
  });

  const canApply = areAllValidationsPassed(validationResults);
  const validationError = getFirstValidationError(validationResults);

  const router = useRouter();

  // Platform helpers
  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case PLATFORM_TYPE.INSTAGRAM:
        return <RiInstagramFill className="text-pink-500" />;
      default:
        return <RiInformationLine />;
    }
  };

  const getPlatformBlurb = (platform?: string) => {
    switch (platform) {
      case PLATFORM_TYPE.INSTAGRAM:
        return "Instagram-focused collaboration — create engaging Reels, Stories, carousels, or posts for the brand.";
      default:
        return "Social content collaboration — craft platform-appropriate content for the brand.";
    }
  };

  const getCreationHints = (platform?: string) => {
    switch (platform) {
      case PLATFORM_TYPE.INSTAGRAM:
        return ["Reels", "Stories", "Carousel posts"];
      default:
        return ["Short-form video", "Static posts"];
    }
  };

  useEffect(() => {
    if (!!collabDetails) {
      setCollab(collabDetails);
    }
  }, [isOpen, collabDetails]);

  const handleApply = () => {
    onMessageModalOpen();
  };

  const handleSubmitApplication = () => {
    if (!user?.id || !collab?.id) return;

    // Check if all validations pass
    if (!canApply) {
      toast.error(
        validationError?.errorMessage ||
          "Please fix the validation errors before applying"
      );

      return;
    }

    setIsSubmitting(true);

    applyToCollabMutation.mutate(
      {
        userId: user.id,
        collabId: collab.id,
        message: applicationMessage,
      },
      {
        onSuccess: () => {
          toast.success("Your application has been sent to the business");
          onMessageModalClose();
          setApplicationMessage("");
          refetch();
        },
        onError: error => {
          toast.error(
            error?.message ?? "There was an error submitting your application"
          );
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= MAX_CHARACTERS) {
      setApplicationMessage(value);
    } else {
      setApplicationMessage(value.slice(0, MAX_CHARACTERS));
    }
  };

  const handleMessageBusiness = () => {
    // Use proper chat room lookup instead of direct application ID
    if (collabApplicationDetails?.id) {
      // Navigate to the chat room using the application ID
      // The chat room ID is the same as the application ID in the current system
      router.push(`/dashboard/messages/${collabApplicationDetails.id}`);
    }
    onClose();
  };

  const charCount = applicationMessage.length;

  if (!collab) return null;

  return (
    <>
      <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent className=" overflow-y-auto px-6">
          <DrawerHeader className="flex justify-between items-center " />
          <div className="mx-auto w-full space-y-6 container">
            {/* Banner - gradient bg with compact brand block */}
            <div className="mb-6 rounded-lg border bg-gradient-to-r from-violet-600/15 via-sky-500/10 to-transparent">
              <div className="p-4 flex items-center gap-4">
                <div className="h-28 w-28 rounded-md overflow-hidden border bg-background">
                  <Image
                    alt="brand logo"
                    className="h-full w-full object-cover"
                    height={112}
                    src={
                      collab.business_profile.logo_url || "/assets/brand.png"
                    }
                    width={112}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-semibold truncate">
                    {collab.business_profile.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
                    <RiMapPin2Line className="h-4 w-4" />
                    <span className="truncate">
                      {collab.business_profile.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title and apply button */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">
                  {toTitleCase(collab.title)}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Posted {formatDateForDisplay(collab.created_at)}
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col gap-2">
                {collab.status === COLLAB_STATUS.ACTIVE &&
                  !collabApplicationDetails &&
                  !canApply &&
                  validationError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                      {validationError?.errorMessage}
                    </div>
                  )}

                <div className="w-full flex flex-row gap-2 items-center">
                  {collab.status === COLLAB_STATUS.ACTIVE &&
                    !collabApplicationDetails && (
                      <Button
                        className="w-full max-w-sm"
                        color="primary"
                        disabled={
                          !canApply && validationError?.field !== "profile"
                        }
                        onClick={
                          !canApply
                            ? validationError?.field === "profile"
                              ? handleConnectInstagram
                              : () => {}
                            : handleApply
                        }
                      >
                        {canApply
                          ? `Apply (${POINTS.APPLY_COLLAB} credits)`
                          : validationError
                            ? validationError?.field === "profile"
                              ? "Connect Instagram"
                              : "Apply"
                            : `Apply ${POINTS.APPLY_COLLAB} credits`}
                      </Button>
                    )}
                  {collab.status === COLLAB_STATUS.ACTIVE &&
                    collabApplicationDetails &&
                    collabApplicationDetails?.status ===
                      APPLICATION_STATUS.PENDING && (
                      <Button
                        className="w-full max-w-sm"
                        disabled={true}
                        size="sm"
                        variant="secondary"
                      >
                        <RiCheckDoubleLine />
                        Already Applied
                      </Button>
                    )}

                  {collab.status === COLLAB_STATUS.ACTIVE &&
                    collabApplicationDetails &&
                    collabApplicationDetails?.status ===
                      APPLICATION_STATUS.ACCEPTED && (
                      <Button
                        className="w-full max-w-sm"
                        size="sm"
                        variant="secondary"
                        onClick={handleMessageBusiness}
                      >
                        Message Business
                      </Button>
                    )}
                </div>
              </div>
            </div>

            {/* Platform strip */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-md border bg-background/60">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-md bg-muted">
                      {getPlatformIcon(collab.platform ?? undefined)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-medium">
                        This is an {collab.platform?.toLowerCase()} job
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {getPlatformBlurb(collab.platform ?? undefined)}
                      </p>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <RiInformationLine />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="text-sm max-w-xs">
                        Platform guidelines and expectations vary by brand.
                        Clarify deliverables in chat after applying.
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="p-3 rounded-md border bg-background/60">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-md bg-muted">
                      <RiInformationLine />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-medium">
                        This job may have extra revenue potential
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        High-performing content is sometimes licensed for
                        additional use. Any extra usage is at the brand’s
                        discretion and isn’t guaranteed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Status */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  color={
                    collab.status === COLLAB_STATUS.ACTIVE
                      ? "success"
                      : "danger"
                  }
                >
                  {collab.status}
                </Badge>
              </div>

              {!!collabApplicationDetails && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium">Your Application:</span>
                  <Badge
                    color={
                      collabApplicationDetails?.status ===
                      APPLICATION_STATUS.ACCEPTED
                        ? "success"
                        : collabApplicationDetails?.status ===
                            APPLICATION_STATUS.REJECTED
                          ? "danger"
                          : "warning"
                    }
                  >
                    {collabApplicationDetails?.status}
                  </Badge>
                </div>
              )}
            </div>
            {/* About this collab */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">About this collab</h4>
              <div className="p-4 rounded-md border">
                <p className="text-default-700 text-sm md:text-base leading-relaxed">
                  {collab.description}
                </p>
                <p className="text-default-700 text-sm md:text-base leading-relaxed mt-3">
                  You’ll collaborate with{" "}
                  <span className="font-medium">
                    {collab.business_profile.name}
                  </span>{" "}
                  on {collab.platform?.toLowerCase()} content. Compensation is{" "}
                  <span className="font-medium">₹{collab.amount}</span>.
                  Creators with at least{" "}
                  <span className="font-medium">
                    {collab.min_followers?.toLocaleString() || 0}
                  </span>{" "}
                  followers are a strong fit. Content in{" "}
                  {Array.isArray(collab.languages) &&
                  collab.languages.length > 0
                    ? collab.languages.join(", ")
                    : "any language"}{" "}
                  is welcome.
                </p>
              </div>
            </div>

            {/* Products or services being promoted */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">
                Products or services being promoted
              </h4>
              <div className="p-4 rounded-md border">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Help showcase the brand’s{" "}
                  {collab.business_profile.type?.toLowerCase()} offering in a
                  way that feels real and useful. Speak to a common shopper
                  behavior or problem and how choosing{" "}
                  {collab.business_profile.name} makes the experience better.
                </p>
              </div>
            </div>
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-md border">
                <h4 className="text-sm font-semibold mb-1">Business</h4>
                <p className="text-sm">{collab.business_profile.type}</p>
              </div>
              <div className="p-4 rounded-md border">
                <h4 className="text-sm font-semibold mb-1">Collab type</h4>
                <p className="text-sm">{COLLAB_TYPE[collab.collab_type]}</p>
              </div>
              <div className="p-4 rounded-md border md:col-span-2">
                <h4 className="text-sm font-semibold mb-1">
                  What you may be hired to create
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {getCreationHints(collab.platform ?? undefined).map(item => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Important dates & timelines */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">
                Important dates & timelines
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-md border flex items-start gap-3">
                  <RiCalendar2Line className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateForDisplay(collab.created_at)}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-md border flex items-start gap-3">
                  <RiCalendar2Line className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Applications close</p>
                    <p className="text-sm text-muted-foreground">
                      Not specified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ideal creator & metrics */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">
                The ideal creator & metrics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-md border">
                  <h5 className="text-sm font-medium mb-1">
                    Minimum followers
                  </h5>
                  <p className="text-sm">
                    {collab.min_followers?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-4 rounded-md border">
                  <h5 className="text-sm font-medium mb-1">
                    Preferred languages
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(collab.languages) &&
                    collab.languages.length > 0 ? (
                      collab.languages.map(lang => (
                        <Badge key={lang}>{lang}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Not specified
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-md border">
                  <h5 className="text-sm font-medium mb-1">Platform</h5>
                  <div className="flex items-center gap-2 text-sm">
                    {getPlatformIcon(collab.platform ?? undefined)}
                    <span>{collab.platform}</span>
                  </div>
                </div>
              </div>
            </div>
            {/*/!* Content Formats *!/*/}
            {/*<div className="mb-6">*/}
            {/*  <h4 className="text-md font-semibold mb-2">Content Formats</h4>*/}
            {/*  <div className="flex flex-wrap gap-2">*/}
            {/*    <Badge variant="flat" size="sm">*/}
            {/*      {collab.collab_type}*/}
            {/*    </Badge>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/* Languages */}

            {/* Reference Images */}
            {/*{collab.images.length > 0 && (*/}
            {/*  <div className="mb-6">*/}
            {/*    <h4 className="text-md font-semibold mb-2">Reference Images</h4>*/}
            {/*    <div className="grid grid-cols-2 gap-2">*/}
            {/*      {collab.images.map((image, index) => (*/}
            {/*        <Card key={index} isPressable>*/}
            {/*          <CardBody className="p-0 overflow-hidden">*/}
            {/*            <Image*/}
            {/*              src={image}*/}
            {/*              alt={`Reference image ${index + 1}`}*/}
            {/*              className="w-full h-40 object-cover"*/}
            {/*            />*/}
            {/*          </CardBody>*/}
            {/*        </Card>*/}
            {/*      ))}*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Application Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={onMessageModalClose}>
        <DialogContent>
          <>
            <DialogHeader className="flex flex-col gap-1  text-base md:text-lg">
              Apply for Collaboration
            </DialogHeader>
            <DialogContent>
              <p className="text-xs md:text-base text-muted-foreground mb-2">
                Send a message to the business explaining why you&#39;re a good
                fit for this collaboration.
              </p>
              <Textarea
                placeholder="Introduce yourself and explain why you're interested in this collaboration..."
                rows={5}
                value={applicationMessage}
                onChange={handleTextareaChange}
              />
              <div className="text-xs text-muted-foreground mt-1 text-end w-full">
                {charCount} / {MAX_CHARACTERS} characters
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={onMessageModalClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={
                    applicationMessage.trim().length === 0 || isSubmitting
                  }
                  onClick={handleSubmitApplication}
                >
                  Submit Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        </DialogContent>
      </Dialog>
    </>
  );
}
