"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";
import { Skeleton } from "@heroui/skeleton";
import { Link } from "@heroui/link";
import { Edit, Message, SpockHandGesture, Xmark } from "iconoir-react";
import { useQuery } from "@tanstack/react-query";

import { ConfirmationModal } from "@/components/business/ConfirmationModal";
import { APPLICATION_STATUS, COLLAB_STATUS, COLLAB_TYPE } from "@/utils/enums";
import {
  getSingleBusinessCollabsOptions,
  useUpdateCollabStatusMutation,
} from "@/utils/react-query/business/collabs";
import { getUserOptions } from "@/utils/react-query/user";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { formatDateForDisplay, timeAgo } from "@/utils/date";
import { createClient } from "@/supabase/client";
import {
  getAllCollabApplicationsOptions,
  useAcceptOrRejectApplicationMutation,
} from "@/utils/react-query/business/applications";
import { toTitleCase } from "@/utils/string";
import { formatNumber } from "@/utils/number";

export default function CollabDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const collabId = params.id as string;
  const supabase = createClient();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);

  // Confirmation modal states
  const [showCloseModal, setShowCloseModal] = useState<boolean>(false);
  const [showAcceptModal, setShowAcceptModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null,
  );
  const [selectedApplicantName, setSelectedApplicantName] =
    useState<string>("");

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: businessProfile } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );

  const businessId = useMemo(() => businessProfile?.id, [businessProfile]);

  const { data: collab, isPending } = useQuery(
    getSingleBusinessCollabsOptions(supabase, businessId as string, collabId),
  );
  const { data: collabApplications } = useQuery(
    getAllCollabApplicationsOptions(supabase, businessId as string, collabId),
  );

  const acceptOrRejectApplicationMutation =
    useAcceptOrRejectApplicationMutation(supabase);

  // Handle accept applicant
  const handleAcceptApplicant = (collabApplicationId: string) => {
    acceptOrRejectApplicationMutation.mutate({
      collabApplicationId,
      status: APPLICATION_STATUS.ACCEPTED,
      collabId,
      businessId: businessId as string,
    });
  };

  // Handle reject applicant
  const handleRejectApplicant = (collabApplicationId: string) => {
    acceptOrRejectApplicationMutation.mutate({
      collabApplicationId,
      status: APPLICATION_STATUS.REJECTED,
      collabId,
      businessId: businessId as string,
    });
  };

  const updateCollabStatusMutation = useUpdateCollabStatusMutation(supabase);

  // Confirm close collab
  const confirmCloseCollab = () => {
    if (selectedCollabId) {
      updateCollabStatusMutation.mutate({
        collabId: selectedCollabId,
        status: COLLAB_STATUS.CLOSED,
        businessId: businessId as string,
      });
      setSelectedCollabId(null);
      router.replace("/business/dashboard/collabs");
    }
  };

  // Open accept confirmation modal
  const openAcceptModal = (applicantId: string, applicantName: string) => {
    setSelectedApplicantId(applicantId);
    setSelectedApplicantName(applicantName);
    setShowAcceptModal(true);
  };

  // Open reject confirmation modal
  const openRejectModal = (applicantId: string, applicantName: string) => {
    setSelectedApplicantId(applicantId);
    setSelectedApplicantName(applicantName);
    setShowRejectModal(true);
  };

  // Confirm accept applicant
  const confirmAcceptApplicant = () => {
    if (selectedApplicantId !== null) {
      handleAcceptApplicant(selectedApplicantId);
      setSelectedApplicantId(null);
    }
  };

  // Confirm reject applicant
  const confirmRejectApplicant = () => {
    if (selectedApplicantId !== null) {
      handleRejectApplicant(selectedApplicantId);
      setSelectedApplicantId(null);
    }
  };

  // Filter applicants by status
  const filteredApplicants = (collabApplications || []).filter((applicant) => {
    if (statusFilter === "all") return true;

    return applicant.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case COLLAB_STATUS.ACTIVE:
        return (
          <Chip color="success" size="sm">
            Active
          </Chip>
        );
      case COLLAB_STATUS.CLOSED:
        return (
          <Chip color="danger" size="sm">
            Closed
          </Chip>
        );
      default:
        return null;
    }
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>

        {/* Collab details skeleton */}
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </CardBody>
        </Card>

        {/* Tabs skeleton */}
        <Skeleton className="h-10 w-full rounded-lg" />

        {/* Content skeleton */}
        <Card>
          <CardBody>
            <Skeleton className="h-32 w-full rounded-lg" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg md:text-xl font-semibold">
          Collaboration not found
        </h2>
        <p className="text-sm md:text-base text-default-500 mt-2">
          The collaboration you&#39;re looking for doesn&#39;t exist or has been
          removed.
        </p>
        <Button
          as={Link}
          className="mt-6"
          color="primary"
          href="/business/dashboard/collabs"
        >
          Back to Collaborations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-3xl font-bold">
              {toTitleCase(collab.title)}
            </h1>
            {renderStatusBadge(collab.status)}
          </div>
          <p className="text-sm md:text-base text-default-500">
            Posted {formatDateForDisplay(collab.created_at)} (
            {timeAgo(collab.created_at)})
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            as={Link}
            href={`/business/dashboard/collabs/${collab.id}/edit`}
            startContent={<Edit />}
            variant="flat"
          >
            Edit
          </Button>
          {collab.status === COLLAB_STATUS.ACTIVE && (
            <Button
              color="danger"
              startContent={<Xmark />}
              variant="flat"
              onPress={() => setShowCloseModal(true)}
            >
              Close Collab
            </Button>
          )}
        </div>
      </div>

      {/* Collab details */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-default-500">
                Collab Type
              </h3>
              <p className="font-medium">{COLLAB_TYPE[collab?.collab_type]}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-default-500">Location</h3>
              <p className="font-medium">location</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-default-500">Format</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {/*{collab.formats.map((format) => (*/}
                {/*  <Chip key={format} size="sm" variant="flat">*/}
                {/*    {format}*/}
                {/*  </Chip>*/}
                {/*))}*/}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-default-500">
                {collab.collab_type === COLLAB_TYPE.BARTER
                  ? "Value"
                  : "Amount Offered"}
              </h3>
              <p className="font-medium">
                {collab.collab_type === COLLAB_TYPE.BARTER
                  ? "Product Exchange"
                  : `₹${collab?.amount && collab?.amount?.toLocaleString()}`}
              </p>
            </div>
          </div>

          <Divider className="my-4" />

          <div>
            <h3 className="text-sm font-medium text-default-500 mb-2">
              Description
            </h3>
            <p className="text-foreground">{collab.description}</p>
          </div>
        </CardBody>
      </Card>

      {/* Applicants Section */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Applicants ({collabApplications?.length || 0})
        </h2>

        {/* Filter tabs */}
        <Tabs
          aria-label="Filter applicants by status"
          className="w-full overflow-y-auto"
          classNames={{
            tabList: "gap-2 md:gap-6",
          }}
          color="primary"
          selectedKey={statusFilter}
          variant="underlined"
          onSelectionChange={(key) => setStatusFilter(key as string)}
        >
          <Tab key="all" title={`All (${collabApplications?.length})`} />
          <Tab
            key="pending"
            title={`Pending (${(collabApplications || []).filter((a) => a.status === APPLICATION_STATUS.PENDING).length})`}
          />
          <Tab
            key="accepted"
            title={`Accepted (${(collabApplications || []).filter((a) => a.status === APPLICATION_STATUS.ACCEPTED).length})`}
          />
          <Tab
            key="rejected"
            title={`Rejected (${(collabApplications || []).filter((a) => a.status === APPLICATION_STATUS.REJECTED).length})`}
          />
        </Tabs>

        {/* Applicants list */}
        {filteredApplicants.length > 0 ? (
          <div className="space-y-4 mt-4">
            {filteredApplicants.map((applicant) => (
              <Card key={applicant.id} className="overflow-hidden">
                <CardBody className="p-0">
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Influencer info */}
                      <div className="flex items-start gap-4">
                        <Avatar
                          className="h-16 w-16 text-large bg-primary/10 text-primary"
                          src={
                            applicant.creator_profile?.profile_pic_url as string
                          }
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {toTitleCase(applicant?.creator_profile?.name)}
                            </h3>
                            {renderStatusBadge(applicant.status)}
                          </div>
                          <p className="text-sm md:text-base text-default-500">
                            <Link
                              href={`https://instagram.com/${applicant?.creator_profile?.instagram_handle}`}
                              target="_blank"
                            >
                              {applicant?.creator_profile?.instagram_handle}
                            </Link>{" "}
                            •{" "}
                            {formatNumber(
                              applicant?.creator_profile?.followers_count || 0,
                            )}{" "}
                            followers
                          </p>
                          {/*<div className="flex flex-wrap gap-1 mt-1">*/}
                          {/*  {applicant.niches.map((niche) => (*/}
                          {/*    <Chip key={niche} size="sm" variant="flat">*/}
                          {/*      {niche}*/}
                          {/*    </Chip>*/}
                          {/*  ))}*/}
                          {/*  <Chip size="sm" variant="flat">*/}
                          {/*    {applicant.location}*/}
                          {/*  </Chip>*/}
                          {/*</div>*/}
                        </div>
                      </div>

                      {/* Applied date - mobile */}
                      <div className="md:hidden mt-2">
                        <p className="text-xs text-default-500">
                          Applied {timeAgo(applicant.created_at)}
                        </p>
                      </div>

                      {/* Applied date - desktop */}
                      <div className="hidden md:block ml-auto text-right">
                        <p className="text-sm text-default-500">
                          Applied {timeAgo(applicant.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Message */}
                    {applicant.message && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-default-500 mb-1">
                          Message
                        </h4>
                        <p className="text-foreground">{applicant.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <Divider />
                  <div className="px-5 py-3 flex flex-wrap gap-2">
                    {applicant.status === APPLICATION_STATUS.PENDING ? (
                      <>
                        <Button
                          color="success"
                          onPress={() =>
                            openAcceptModal(
                              applicant.id,
                              applicant?.creator_profile?.name as string,
                            )
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          color="danger"
                          variant="flat"
                          onPress={() =>
                            openRejectModal(
                              applicant.id,
                              applicant?.creator_profile?.name as string,
                            )
                          }
                        >
                          Reject
                        </Button>
                      </>
                    ) : applicant.status === APPLICATION_STATUS.ACCEPTED ? (
                      <Button
                        color="primary"
                        startContent={<Message />}
                        // onPress={() => navigateToChat(applicant.id)}
                      >
                        Message
                      </Button>
                    ) : (
                      <Button color="danger" disabled={true} variant="flat">
                        Rejected
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          // Empty state
          <Card className="mt-4">
            <CardBody className="py-12 flex flex-col items-center justify-center">
              <SpockHandGesture className="text-default-300 size-16" />
              <h3 className="text-xl font-medium mt-6">No applicants found</h3>
              <p className="text-default-500 mt-2 text-center max-w-md">
                {statusFilter !== "all"
                  ? `No ${statusFilter.toLowerCase()} applicants found. Try a different filter.`
                  : "No one has applied to this collab yet. Share it on your socials to get noticed!"}
              </p>
              {statusFilter !== "all" ? (
                <Button
                  className="mt-6"
                  color="primary"
                  variant="flat"
                  onPress={() => setStatusFilter("all")}
                >
                  View All Applicants
                </Button>
              ) : (
                <Button
                  as={Link}
                  className="mt-6"
                  color="primary"
                  href="#"
                  target="_blank"
                >
                  Share Collab
                </Button>
              )}
            </CardBody>
          </Card>
        )}
      </div>

      <ConfirmationModal
        cancelText="Cancel"
        confirmColor="danger"
        confirmText="Yes, Close Collab"
        isOpen={showCloseModal}
        message="Are you sure you want to close this collaboration? Closed collaborations will no longer accept new applications."
        title="Close Collaboration"
        onClose={() => setShowCloseModal(false)}
        onConfirm={confirmCloseCollab}
      />
      <ConfirmationModal
        cancelText="Cancel"
        confirmColor="danger"
        confirmText="Yes, Reject"
        isOpen={showRejectModal}
        message={`Are you sure you want to reject ${selectedApplicantName}? This action is irreversible.`}
        title="Reject Collaboration"
        onClose={() => setShowRejectModal(false)}
        onConfirm={confirmRejectApplicant}
      />
      <ConfirmationModal
        cancelText="Cancel"
        confirmColor="success"
        confirmText="Yes, Accept"
        isOpen={showAcceptModal}
        message={`Are you sure you want to accept ${selectedApplicantName}?`}
        title="Accept Collaboration"
        onClose={() => setShowAcceptModal(false)}
        onConfirm={confirmAcceptApplicant}
      />
    </div>
  );
}
