"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { CollabWithBusinessProfile } from "@/types/collab";
import { createClient } from "@/supabase/client";
import { formatDateForDisplay } from "@/utils/date";
import { APPLICATION_STATUS, COLLAB_STATUS, COLLAB_TYPE } from "@/utils/enums";
import {
  checkUserAppliedToCollabOptions,
  useApplyToCollabMutation,
} from "@/utils/react-query/collabs";
import {
  getUserOptions,
  getUserProfileOptions,
} from "@/utils/react-query/user";
import { toTitleCase } from "@/utils/string";
import { POINTS } from "@/utils/constants";

interface CollabDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collabDetails?: CollabWithBusinessProfile | null;
  onApply?: () => void;
}

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
      collabDetails?.id as string,
    ),
  );

  const { data: userProfile } = useQuery(
    getUserProfileOptions(supabase, user?.id as string),
  );

  const validateApplicationBalance = () => {
    const currentBalance = userProfile?.balance || 0;

    if (currentBalance < POINTS.APPLY_COLLAB) {
      toast.warning(
        `You need ${POINTS.APPLY_COLLAB} points to apply for collaborations. Current balance: ${currentBalance} points.`,
      );

      return false;
    }

    return true;
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

    // Add balance validation
    if (!validateApplicationBalance()) return;

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
        onError: (error) => {
          toast.error(
            error?.message ?? "There was an error submitting your application",
          );
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  const handleMessageBusiness = () => {
    onClose();
  };

  if (!collab) return null;

  const currentBalance = userProfile?.balance || 0;
  const canApply = currentBalance >= POINTS.APPLY_COLLAB;

  return (
    <>
      <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent className=" overflow-y-auto px-6">
          <DrawerHeader className="flex justify-between items-center ">
            <div>
              <h3 className="text-xl font-bold">{toTitleCase(collab.title)}</h3>
              <p className="text-muted-foreground text-sm">
                Posted {formatDateForDisplay(collab.created_at)}
              </p>
            </div>
          </DrawerHeader>
          <div className="mx-auto w-full container">
            {/* Business Info */}
            <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="rounded-md w-20 h-20">
                  <AvatarImage
                    alt="business profile"
                    src={collab.business_profile.logo_url}
                  />
                  <AvatarFallback className=" rounded-md">
                    {collab.business_profile.name}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-lg">
                    {collab.business_profile.name}
                  </h4>
                  <p className="text-muted-foreground">
                    {collab.business_profile.location}
                  </p>
                </div>
              </div>
              <div>
                <div className="w-full flex flex-row gap-2 container mx-auto items-center">
                  {collab.status === COLLAB_STATUS.ACTIVE &&
                    !collabApplicationDetails && (
                      <Button
                        className="w-full max-w-sm"
                        color="primary"
                        disabled={!canApply}
                        onClick={handleApply}
                      >
                        {canApply
                          ? `Apply (${POINTS.APPLY_COLLAB} pts)`
                          : `Need ${POINTS.APPLY_COLLAB} pts`}
                      </Button>
                    )}
                  {collab.status === COLLAB_STATUS.ACTIVE &&
                    collabApplicationDetails &&
                    collabApplicationDetails?.status ===
                      APPLICATION_STATUS.PENDING && (
                      <Button
                        className="w-full max-w-sm"
                        color="success"
                        disabled={true}
                        size="sm"
                        variant="ghost"
                      >
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
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">Description</h4>
              <p className="text-default-700">{collab.description}</p>
            </div>
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-semibold mb-1">Business type</h4>
                <p>{collab.business_profile.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Collab Type</h4>
                <p>{COLLAB_TYPE[collab.collab_type]}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Amount</h4>
                <p>₹{collab.amount}</p>
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
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>{collab.languages}</Badge>
              </div>
            </div>
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
                onChange={(e) => setApplicationMessage(e.target.value)}
              />
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
