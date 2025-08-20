"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  RiAddLine,
  RiBriefcase3Line,
  RiCloseLine,
  RiEditBoxLine,
  RiEyeLine,
  RiTimeLine,
} from "@remixicon/react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/supabase/client";
import { COLLAB_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { ConfirmationModal } from "@/components/business/ConfirmationModal";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { getUserOptions } from "@/utils/react-query/user";
import {
  getAllBusinessCollabsOptions,
  useUpdateCollabStatusMutation,
} from "@/utils/react-query/business/collabs";
import { Database } from "@/supabase/database.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { timeAgo } from "@/utils/date";

export default function CollabsPage() {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    Database["public"]["Enums"]["collab_status"] | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [showCloseModal, setShowCloseModal] = useState<boolean>(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: businessProfile } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );

  const businessId = useMemo(() => businessProfile?.id, [businessProfile]);

  const { data: collabs, isPending } = useQuery(
    getAllBusinessCollabsOptions(
      supabase,
      businessId as string,
      statusFilter === "ALL" ? undefined : statusFilter,
    ),
  );

  const updateCollabStatusMutation = useUpdateCollabStatusMutation(supabase);

  // Filter and sort collabs
  const filteredCollabs = (collabs || [])
    .filter((collab) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        collab.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "ALL" ||
        collab.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by most recent or most applicants
      if (sortBy === "recent") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });

  // Handle close collab
  const handleCloseCollab = async (id: string) => {
    updateCollabStatusMutation.mutate({
      collabId: id,
      status: COLLAB_STATUS.CLOSED,
      businessId: businessId as string,
    });
  };

  // Open close confirmation modal
  const openCloseModal = (id: string) => {
    setSelectedCollabId(id);
    setShowCloseModal(true);
  };

  // Confirm close collab
  const confirmCloseCollab = () => {
    if (selectedCollabId) {
      handleCloseCollab(selectedCollabId);
      setSelectedCollabId(null);
    }
  };

  // Render collab type badge with appropriate color
  const renderCollabTypeBadge = (type: keyof typeof COLLAB_TYPE) => {
    return <Badge className="text-xs">{COLLAB_TYPE[type]}</Badge>;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-base lg:text-xl font-bold">
                  Your Collaborations
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Manage all your collaboration
                </p>
              </div>
              <Link href="/business/dashboard/create">
                <Button variant="default">
                  <RiAddLine />
                  Create New Collab
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              className="w-full md:w-64"
              placeholder="Search collabs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex flex-wrap gap-3 flex-1 justify-start md:justify-end">
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setStatusFilter(v as "ACTIVE" | "CLOSED" | "ALL")
                }
              >
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="applicants">Most Applicants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Collab Listings */}
          {isPending ? (
            <div className="grid grid-cols-1 xl:grid-cols-2  gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="w-full shadow-none">
                  <CardContent className="">
                    <div className="flex flex-col md:flex-row justify-between gap-3">
                      <div className="space-y-3 flex-1">
                        {/* Title and Status skeleton */}
                        <div className="flex items-start gap-2">
                          <Skeleton className="h-6 w-3/5 rounded-lg" />
                          <Skeleton className="h-5 w-16 rounded-lg" />
                        </div>

                        {/* Collab Details skeleton */}
                        <div className="flex flex-wrap gap-3 items-center">
                          <Skeleton className="h-5 w-20 rounded-lg" />
                          <Skeleton className="h-5 w-24 rounded-lg" />
                          <Skeleton className="h-5 w-16 rounded-lg" />
                        </div>

                        {/* Formats skeleton */}
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-5 w-16 rounded-lg" />
                          <Skeleton className="h-5 w-16 rounded-lg" />
                        </div>

                        {/* Action Buttons skeleton for Desktop */}
                        <div className="hidden md:flex flex-row gap-2 min-w-[180px]">
                          <Skeleton className="h-8 w-full rounded-lg" />
                          <Skeleton className="h-8 w-full rounded-lg" />
                          <Skeleton className="h-8 w-full rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCollabs.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredCollabs.map((collab) => (
                <div
                  key={collab.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 ">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {collab.title}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            collab.status,
                          )}`}
                        >
                          {collab.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {collab.description}
                      </p>

                      {/* Budget and Time */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200">
                            <span className="text-xs font-medium mr-1">
                              {COLLAB_TYPE[collab.collab_type]}
                            </span>
                          </div>
                        </div>
                        <div>
                          {collab.collab_type !== COLLAB_TYPE.BARTER && (
                            <span className="font-medium">
                              ₹
                              {collab?.amount
                                ? collab?.amount.toLocaleString()
                                : 0}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <RiTimeLine size={14} />
                          <span>Posted {timeAgo(collab.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Link href={`/business/dashboard/collabs/${collab.id}`}>
                      <Button className="" size="sm" variant="default">
                        <RiEyeLine className="mr-2" />
                        View Applicants
                      </Button>
                    </Link>

                    {collab.status === COLLAB_STATUS.ACTIVE && (
                      <Link
                        href={`/business/dashboard/collabs/${collab.id}/edit`}
                      >
                        <Button className="" size="sm" variant="outline">
                          <RiEditBoxLine className="mr-2" />
                          Edit Collab
                        </Button>
                      </Link>
                    )}
                    {collab.status === COLLAB_STATUS.ACTIVE && (
                      <Button
                        className=""
                        size="sm"
                        variant="destructive"
                        onClick={() => openCloseModal(collab.id)}
                      >
                        <RiCloseLine className="mr-2" />
                        Close Collab
                      </Button>
                    )}
                  </div>
                </div>

                // <Card key={collab.id} className="w-full shadow-none">
                //   <CardContent className="">
                //     <div className="flex flex-col md:flex-row justify-between gap-3">
                //       <div className="space-y-3">
                //         {/* Title and Status */}
                //         <div className="flex items-start gap-2">
                //           <h3 className="text-lg font-bold line-clamp-2">
                //             {toTitleCase(collab.title)}
                //           </h3>
                //           <Badge className="text-xs">{collab.status}</Badge>
                //         </div>
                //
                //         {/* Description */}
                //         <div className="flex items-start gap-2">
                //           <h3 className="text-sm line-clamp-2 text-muted-foreground">
                //             {collab.description}
                //           </h3>
                //         </div>
                //
                //         {/* Collab Details */}
                //         <div className="flex flex-wrap gap-3 items-center">
                //           {renderCollabTypeBadge(collab.collab_type)}
                //
                //           <span className="text-muted-foreground text-sm">
                //             {collab.collab_type !== COLLAB_TYPE.BARTER && (
                //               <span className="font-medium">
                //                 ₹
                //                 {collab?.amount
                //                   ? collab?.amount.toLocaleString()
                //                   : 0}
                //               </span>
                //             )}
                //           </span>
                //         </div>
                //
                //         {/* Posted Date and Applicants */}
                //         <div className="flex items-center gap-3 text-sm text-muted-foreground">
                //           <span>Posted {timeAgo(collab.created_at)}</span>
                //           <span>•</span>
                //           {/*<Badge
                //             variant={1 > 0 ? "primary" : "default"}
                //             className="text-xs"
                //           >
                //             {1} Applicant
                //             {2 !== 1 && "s"}
                //           </Badge>*/}
                //         </div>
                //       </div>
                //
                //       {/* Action Buttons for Desktop */}
                //       <div className="hidden md:flex flex-col gap-2 min-w-[180px]">
                //         <Link href={`/business/dashboard/collabs/${collab.id}`}>
                //           <Button
                //             className="w-full"
                //             size="sm"
                //             variant="default"
                //           >
                //             <RiEyeLine className="mr-2" />
                //             View Applicants
                //           </Button>
                //         </Link>
                //
                //         {collab.status === COLLAB_STATUS.ACTIVE && (
                //           <Link
                //             href={`/business/dashboard/collabs/${collab.id}/edit`}
                //           >
                //             <Button
                //               className="w-full"
                //               size="sm"
                //               variant="outline"
                //             >
                //               <RiEditBoxLine className="mr-2" />
                //               Edit Collab
                //             </Button>
                //           </Link>
                //         )}
                //         {collab.status === COLLAB_STATUS.ACTIVE && (
                //           <Button
                //             className="w-full"
                //             size="sm"
                //             variant="destructive"
                //             onClick={() => openCloseModal(collab.id)}
                //           >
                //             <RiCloseLine className="mr-2" />
                //             Close Collab
                //           </Button>
                //         )}
                //       </div>
                //     </div>
                //   </CardContent>
                //
                //   {/* Action Buttons for Mobile */}
                //   <CardFooter className="flex md:hidden gap-2 flex-wrap">
                //     <Link href={`/business/dashboard/collabs/${collab.id}`}>
                //       <Button className="w-full" size="sm" variant="default">
                //         <RiEyeLine className="mr-2" />
                //         View Applicants
                //       </Button>
                //     </Link>
                //
                //     {collab.status === COLLAB_STATUS.ACTIVE && (
                //       <Link
                //         href={`/business/dashboard/collabs/${collab.id}/edit`}
                //       >
                //         <Button className="w-full" size="sm" variant="outline">
                //           <RiEditBoxLine className="mr-2" />
                //           Edit Collab
                //         </Button>
                //       </Link>
                //     )}
                //     {collab.status === COLLAB_STATUS.ACTIVE && (
                //       <Button
                //         className="w-full"
                //         size="sm"
                //         variant="destructive"
                //         onClick={() => openCloseModal(collab.id)}
                //       >
                //         <RiCloseLine className="mr-2" />
                //         Close Collab
                //       </Button>
                //     )}
                //   </CardFooter>
                // </Card>
              ))}
            </div>
          ) : (
            <Card className="w-full border-none shadow-none">
              <CardContent className="py-12 flex flex-col items-center justify-center">
                <RiBriefcase3Line className="text-default-300 size-8" />
                <h3 className="font-medium mt-2">No collaborations found</h3>
                <p className="text-muted-foreground text-sm text-center max-w-md">
                  {searchQuery || statusFilter !== "ALL"
                    ? "No collaborations match your search criteria. Try adjusting your filters."
                    : "You haven't posted any collabs yet. Click below to create your first one."}
                </p>
                {searchQuery || statusFilter !== "ALL" ? (
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Link href="/business/dashboard/create">
                    <Button className="mt-6" variant="default">
                      <RiAddLine className="mr-2" />
                      Create New Collab
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
          <ConfirmationModal
            cancelText="Cancel"
            confirmText="Yes, Close Collab"
            isOpen={showCloseModal}
            message="Are you sure you want to close this collaboration? Closed collaborations will no longer accept new applications."
            title="Close Collaboration"
            onClose={() => setShowCloseModal(false)}
            onConfirm={confirmCloseCollab}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
