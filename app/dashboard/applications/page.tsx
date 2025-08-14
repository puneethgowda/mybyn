"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";
import { Skeleton } from "@heroui/skeleton";
import { Link } from "@heroui/link";
import { useDisclosure } from "@heroui/modal";
import { useQuery } from "@tanstack/react-query";
import { Message, Suitcase } from "iconoir-react";

import { createClient } from "@/supabase/client";
import { APPLICATION_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { CollabWithBusinessProfile } from "@/types/collab";
import { timeAgo } from "@/utils/date";
import { CollabDetailsDrawer } from "@/components/dashboard/collab-details-drawer";
import { getAllCollabApplicationsOptions } from "@/utils/react-query/collabs";
import { getUserOptions } from "@/utils/react-query/user";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { toTitleCase } from "@/utils/string";

const CollabApplicationsPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    isOpen: isCollabDetailsOpen,
    onOpen: onCollabDetailsOpen,
    onClose: onCollabDetailsClose,
  } = useDisclosure();

  const [collabDetails, setCollabDetails] =
    useState<CollabWithBusinessProfile | null>(null);

  const { isSm } = useBreakpoint();

  const { data, isLoading: loading } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: applications } = useQuery(
    getAllCollabApplicationsOptions(supabase, user?.id as string),
  );

  const handleViewCollabDetails = (collab: CollabWithBusinessProfile) => {
    onCollabDetailsOpen();
    setCollabDetails(collab);
  };

  // Filter applications by status
  const filteredApplications = (applications || []).filter((application) => {
    if (statusFilter === "all") return true;

    return application.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Navigate to chat for accepted applications
  const navigateToChat = (applicationId: string) => {
    router.push(`/dashboard/messages/${applicationId}`);
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    let color:
      | "success"
      | "primary"
      | "default"
      | "secondary"
      | "warning"
      | "danger"
      | undefined;

    switch (status) {
      case "Accepted":
        color = "success";
        break;
      case "Rejected":
        color = "danger";
        break;
      default:
        color = "warning";
    }

    return (
      <Chip color={color} size="sm" variant="flat">
        {status}
      </Chip>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-base lg:text-xl font-bold">My Applications</h1>
        <p className="text-default-500 text-xs md:text-sm">
          Track all your collab applications
        </p>
      </div>

      {/* Filter tabs */}
      <Tabs
        aria-label="Filter applications by status"
        className="w-full overflow-x-auto"
        classNames={{
          tabList: "gap-2 md:gap-6",
        }}
        color="primary"
        selectedKey={statusFilter}
        variant="underlined"
        onSelectionChange={(key) => setStatusFilter(key as string)}
      >
        <Tab key="all" title={`All (${applications?.length})`} />
        <Tab
          key="pending"
          title={`Pending (${(applications || []).filter((a) => a.status === APPLICATION_STATUS.PENDING).length})`}
        />
        <Tab
          key="accepted"
          title={`Accepted (${(applications || []).filter((a) => a.status === APPLICATION_STATUS.ACCEPTED).length})`}
        />
        <Tab
          key="rejected"
          title={`Rejected (${(applications || []).filter((a) => a.status === APPLICATION_STATUS.REJECTED).length})`}
        />
      </Tabs>

      {loading ? (
        // Loading skeleton
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardBody className="p-0">
                <div className="p-3 md:p-5">
                  <div className="flex gap-4">
                    <Skeleton className="rounded-full h-16 w-16" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3 rounded-lg" />
                      <Skeleton className="h-4 w-1/4 rounded-lg" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
                <Divider />
                <div className="p-3">
                  <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : filteredApplications.length > 0 ? (
        // Applications list
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardBody className="p-0">
                <div className="p-3 md:p-5">
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                    {/* Business info */}
                    <div className="flex items-start gap-4">
                      <Avatar
                        className="h-16 w-16 text-large bg-primary/10 text-primary"
                        src={application.collabs.business_profile.logo_url}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold line-clamp-2">
                            {toTitleCase(
                              application.collabs.business_profile.name,
                            )}
                          </h3>
                          {renderStatusBadge(application.status)}
                        </div>
                        <p className="text-xs text-default-500 line-clamp-2">
                          {toTitleCase(application.collabs.title)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Chip size="sm" variant="flat">
                            {application.collabs.collab_type === "PAID"
                              ? `₹${application.collabs.amount}`
                              : COLLAB_TYPE[application.collabs.collab_type]}
                          </Chip>
                          <Chip size="sm" variant="flat">
                            {application.collabs.business_profile.location}
                          </Chip>
                        </div>
                      </div>
                    </div>

                    {/* Applied date - mobile */}
                    <div className="md:hidden mt-2">
                      <p className="text-xs text-default-500">
                        Applied {timeAgo(application.created_at)}
                      </p>
                    </div>

                    {/* Applied date - desktop */}
                    <div className="hidden md:block ml-auto text-right">
                      <p className="text-sm text-default-500">
                        Applied {timeAgo(application.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {application.message && (
                    <div className="mt-4">
                      <h4 className="text-xs md:text-sm font-medium text-default-500 mb-1">
                        Your Message
                      </h4>
                      <p className="text-sm md:text-base  text-foreground">
                        {application.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <Divider />
                <div className="px-5 py-3 flex flex-wrap gap-2">
                  {application.status === APPLICATION_STATUS.ACCEPTED ? (
                    <Button
                      color="primary"
                      size={isSm ? "sm" : "md"}
                      startContent={<Message />}
                      onPress={() => navigateToChat(application.id)}
                    >
                      Message Business
                    </Button>
                  ) : application.status === APPLICATION_STATUS.REJECTED ? (
                    <Button
                      as={Link}
                      color="primary"
                      href="/dashboard/discover"
                      variant="flat"
                    >
                      Find Similar Opportunities
                    </Button>
                  ) : (
                    <Button isDisabled color="primary" variant="flat">
                      Awaiting Response
                    </Button>
                  )}

                  <Button
                    size={isSm ? "sm" : "md"}
                    variant="flat"
                    onPress={() => handleViewCollabDetails(application.collabs)}
                  >
                    View Collab Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-default-100">
            <Suitcase />
          </div>
          <h3 className="text-base md:text-xl font-semibold mb-2">
            No applications found
          </h3>
          <p className="text-sm md:text-base text-default-500 mb-6">
            {statusFilter !== "all"
              ? `You don't have any ${statusFilter.toLowerCase()} applications.`
              : "You haven't applied to any collaborations yet."}
          </p>
          {statusFilter !== "all" ? (
            <Button
              color="primary"
              variant="flat"
              onPress={() => setStatusFilter("all")}
            >
              View All Applications
            </Button>
          ) : (
            <Button as={Link} color="primary" href="/dashboard/discover">
              Discover Opportunities
            </Button>
          )}
        </div>
      )}

      <CollabDetailsDrawer
        collabDetails={collabDetails}
        isOpen={isCollabDetailsOpen}
        onClose={onCollabDetailsClose}
      />
    </div>
  );
};

export default CollabApplicationsPage;
