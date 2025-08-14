"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { useQuery } from "@tanstack/react-query";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Textarea } from "@heroui/input";
import { addToast } from "@heroui/toast";

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
      addToast({
        title: "Insufficient Balance",
        description: `You need ${POINTS.APPLY_COLLAB} points to apply for collaborations. Current balance: ${currentBalance} points.`,
        color: "warning",
      });

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
          addToast({
            title: "Application Submitted",
            description: "Your application has been sent to the business",
            color: "success",
          });
          onMessageModalClose();
          setApplicationMessage("");
          refetch();
        },
        onError: (error) => {
          addToast({
            title: "Application failed to send",
            description:
              error?.message ??
              "There was an error submitting your application",
            color: "danger",
          });
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
      <Drawer isOpen={isOpen} placement="bottom" size="3xl" onClose={onClose}>
        <DrawerContent>
          <DrawerHeader className="flex justify-between items-center container mx-auto">
            <div>
              <h3 className="text-xl font-bold">{toTitleCase(collab.title)}</h3>
              <p className="text-default-500 text-sm">
                Posted {formatDateForDisplay(collab.created_at)}
              </p>
            </div>
          </DrawerHeader>

          <DrawerBody className="overflow-y-auto container mx-auto">
            {/* Business Info */}
            <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Avatar
                  className="bg-primary/20 text-primary"
                  size="lg"
                  src={collab.business_profile.logo_url}
                />
                <div>
                  <h4 className="font-semibold text-lg">
                    {collab.business_profile.name}
                  </h4>
                  <p className="text-default-500">
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
                        isDisabled={!canApply}
                        onPress={handleApply}
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
                        variant="solid"
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
                        variant="flat"
                        onPress={handleMessageBusiness}
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
                <Chip
                  color={
                    collab.status === COLLAB_STATUS.ACTIVE
                      ? "success"
                      : "danger"
                  }
                  size="sm"
                  variant="flat"
                >
                  {collab.status}
                </Chip>
              </div>

              {!!collabApplicationDetails && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium">Your Application:</span>
                  <Chip
                    color={
                      collabApplicationDetails?.status ===
                      APPLICATION_STATUS.ACCEPTED
                        ? "success"
                        : collabApplicationDetails?.status ===
                            APPLICATION_STATUS.REJECTED
                          ? "danger"
                          : "warning"
                    }
                    size="sm"
                    variant="flat"
                  >
                    {collabApplicationDetails?.status}
                  </Chip>
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
            {/*    <Chip variant="flat" size="sm">*/}
            {/*      {collab.collab_type}*/}
            {/*    </Chip>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/* Languages */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                <Chip size="sm" variant="flat">
                  {collab.languages}
                </Chip>
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Application Message Modal */}
      <Modal isOpen={isMessageModalOpen} onClose={onMessageModalClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1  text-base md:text-lg">
                Apply for Collaboration
              </ModalHeader>
              <ModalBody>
                <p className="text-xs md:text-base text-default-600 mb-2">
                  Send a message to the business explaining why you&#39;re a
                  good fit for this collaboration.
                </p>
                <Textarea
                  label="Your Message"
                  minRows={5}
                  placeholder="Introduce yourself and explain why you're interested in this collaboration..."
                  value={applicationMessage}
                  onValueChange={setApplicationMessage}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onMessageModalClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isDisabled={applicationMessage.trim().length === 0}
                  isLoading={isSubmitting}
                  onPress={handleSubmitApplication}
                >
                  Submit Application
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
