"use client";

import {
  RiBriefcase3Line,
  RiCalendarLine,
  RiChat1Line,
  RiChat3Line,
  RiWalletLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CollabDetailsDrawer } from "@/components/dashboard/collab-details-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useDisclosure } from "@/hooks/useDisclosure";
import { createClient } from "@/supabase/client";
import { CollabWithBusinessProfile } from "@/types/collab";
import { timeAgo } from "@/utils/date";
import { APPLICATION_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { getAllCollabApplicationsOptions } from "@/utils/react-query/collabs";
import { getUserOptions } from "@/utils/react-query/user";
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

  const { isSm: _isSm } = useBreakpoint();

  const { data, isLoading: loading } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: applications } = useQuery(
    getAllCollabApplicationsOptions(supabase, user?.id as string)
  );

  const handleViewCollabDetails = (collab: CollabWithBusinessProfile) => {
    onCollabDetailsOpen();
    setCollabDetails(collab);
  };

  // Filter applications by status
  const filteredApplications = (applications || []).filter(application => {
    if (statusFilter === "all") return true;

    return application.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Navigate to chat for accepted applications
  const navigateToChat = (applicationId: string) => {
    // Use proper chat room lookup instead of direct application ID
    // The chat room ID is the same as the application ID in the current system
    router.push(`/dashboard/messages/${applicationId}`);
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" =
      "outline";

    switch (status) {
      case "Accepted":
        variant = "default";
        break;
      case "Rejected":
        variant = "destructive";
        break;
      default:
        variant = "secondary";
    }

    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="flex flex-col px-4 md:px-6 lg:px-8 md:shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl  w-full bg-background pb-16 md:pb-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-1 flex-col lg:gap-6 py-4 lg:py-6 md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-base lg:text-xl font-bold">My Applications</h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Track all your collab applications
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <Tabs
          className="w-full"
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({applications?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending (
              {
                (applications || []).filter(
                  a => a.status === APPLICATION_STATUS.PENDING
                ).length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted (
              {
                (applications || []).filter(
                  a => a.status === APPLICATION_STATUS.ACCEPTED
                ).length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected (
              {
                (applications || []).filter(
                  a => a.status === APPLICATION_STATUS.REJECTED
                ).length
              }
              )
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6" value={statusFilter}>
            {loading ? (
              // Loading skeleton
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Skeleton className="rounded-full h-10 w-10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            ) : filteredApplications.length > 0 ? (
              // Applications list
              <div className="space-y-2">
                {filteredApplications.map(application => (
                  <div
                    key={application.id}
                    className="group hover:bg-accent/50 flex flex-col border border-border items-start gap-4 rounded-lg p-4 transition-colors sm:flex-row sm:items-center"
                  >
                    <div className="flex w-full items-start gap-4 sm:w-auto">
                      <div className="relative">
                        <Image
                          alt={toTitleCase(
                            application.collabs.business_profile.name
                          )}
                          className="rounded-md h-10 w-10"
                          height={40}
                          src={application.collabs.business_profile.logo_url}
                          width={40}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="truncate text-sm font-medium">
                            {toTitleCase(application.collabs.title)}
                          </h4>
                          {renderStatusBadge(application.status)}
                        </div>
                        <div className="text-muted-foreground mt-1 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4">
                          <div className="flex items-center gap-1">
                            <span className="truncate">
                              {toTitleCase(
                                application.collabs.business_profile.name
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RiWalletLine size={12} />
                            <span>
                              {application.collabs.collab_type === "PAID"
                                ? `₹${application.collabs.amount}`
                                : COLLAB_TYPE[application.collabs.collab_type]}
                            </span>
                          </div>
                        </div>
                        {application.message && (
                          <div className="mt-2 flex gap-1 items-center">
                            <RiChat3Line size={12} />
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {application.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <RiCalendarLine size={12} />
                        <span>{timeAgo(application.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {application.status === APPLICATION_STATUS.ACCEPTED ? (
                          <Button
                            size="sm"
                            onClick={() => navigateToChat(application.id)}
                          >
                            <RiChat1Line className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        ) : application.status ===
                          APPLICATION_STATUS.REJECTED ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push("/dashboard/discover")}
                          >
                            Find Similar
                          </Button>
                        ) : (
                          <Button disabled size="sm" variant="outline">
                            Awaiting
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleViewCollabDetails(application.collabs)
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty state
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-muted">
                  <RiBriefcase3Line className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold">
                  No applications found
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {statusFilter !== "all"
                    ? `You don't have any ${statusFilter.toLowerCase()} applications.`
                    : "You haven't applied to any collaborations yet."}
                </p>
                {statusFilter !== "all" ? (
                  <Button
                    variant="outline"
                    onClick={() => setStatusFilter("all")}
                  >
                    View All Applications
                  </Button>
                ) : (
                  <Button onClick={() => router.push("/dashboard/discover")}>
                    Discover Opportunities
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CollabDetailsDrawer
          collabDetails={collabDetails}
          isOpen={isCollabDetailsOpen}
          onClose={onCollabDetailsClose}
        />
      </div>
    </div>
  );
};

export default CollabApplicationsPage;
