"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Edit, EyeSolid, Plus, Search, Suitcase, Xmark } from "iconoir-react";

import { createClient } from "@/supabase/client";
import { COLLAB_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { timeAgo } from "@/utils/date";
import { ConfirmationModal } from "@/components/business/ConfirmationModal";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { getUserOptions } from "@/utils/react-query/user";
import {
  getAllBusinessCollabsOptions,
  useUpdateCollabStatusMutation,
} from "@/utils/react-query/business/collabs";
import { Database } from "@/supabase/database.types";
import { toTitleCase } from "@/utils/string";

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
    switch (type) {
      case "PAID":
        return (
          <Chip color="success" size="sm" variant="flat">
            {COLLAB_TYPE[type]}
          </Chip>
        );
      case "BARTER":
        return (
          <Chip color="secondary" size="sm" variant="flat">
            {COLLAB_TYPE[type]}
          </Chip>
        );
      case "PRODUCT_CASH":
        return (
          <Chip color="primary" size="sm" variant="flat">
            {COLLAB_TYPE[type]}
          </Chip>
        );
      default:
        return (
          <Chip size="sm" variant="flat">
            {type}
          </Chip>
        );
    }
  };

  // Handle share collab
  const handleShareCollab = (id: string) => {
    alert(`Share link for collab #${id} copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-base lg:text-xl font-bold">
            Your Collaborations
          </h1>
          <p className="text-default-500 text-xs md:text-sm">
            Manage all your collaboration opportunities
          </p>
        </div>
        <Button
          as={Link}
          color="primary"
          href="/business/dashboard/create"
          startContent={<Plus />}
        >
          Create New Collab
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          className="w-full md:w-64"
          placeholder="Search collabs..."
          startContent={<Search className="text-default-400 size-5" />}
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <div className="flex flex-wrap gap-3 flex-1 justify-start md:justify-end">
          <Select
            className="w-full md:w-32"
            placeholder="Status"
            selectedKeys={[statusFilter]}
            size="sm"
            onChange={(e) =>
              setStatusFilter(e.target.value as "ACTIVE" | "CLOSED" | "ALL")
            }
          >
            <SelectItem key="ALL">All Status</SelectItem>
            <SelectItem key="ACTIVE">Open</SelectItem>
            <SelectItem key="CLOSED">Closed</SelectItem>
          </Select>

          <Select
            className="w-full md:w-40"
            placeholder="Sort by"
            selectedKeys={[sortBy]}
            size="sm"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <SelectItem key="recent">Most Recent</SelectItem>
            <SelectItem key="applicants">Most Applicants</SelectItem>
          </Select>
        </div>
      </div>

      {/* Collab Listings */}
      {isPending ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardBody className="p-5">
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

                    {/* Posted Date and Applicants skeleton */}
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-32 rounded-lg" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </div>
                  </div>

                  {/* Action Buttons skeleton for Desktop */}
                  <div className="hidden md:flex flex-col gap-2 min-w-[180px]">
                    <Skeleton className="h-8 w-full rounded-lg" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              </CardBody>

              {/* Action Buttons skeleton for Mobile */}
              <CardFooter className="flex md:hidden gap-2 flex-wrap">
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCollabs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredCollabs.map((collab) => (
            <Card key={collab.id} className="w-full">
              <CardBody className="p-5">
                <div className="flex flex-col md:flex-row justify-between gap-3">
                  <div className="space-y-3">
                    {/* Title and Status */}
                    <div className="flex items-start gap-2">
                      <h3 className="text-lg font-bold line-clamp-2">
                        {toTitleCase(collab.title)}
                      </h3>
                      <Chip color="success" size="sm" variant="flat">
                        {collab.status}
                      </Chip>
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-2">
                      <h3 className="text-sm line-clamp-2 text-default-500">
                        {collab.description}
                      </h3>
                    </div>

                    {/* Collab Details */}
                    <div className="flex flex-wrap gap-3 items-center">
                      {renderCollabTypeBadge(collab.collab_type)}

                      <span className="text-default-600 text-sm">
                        {collab.collab_type !== COLLAB_TYPE.BARTER && (
                          <span className="font-medium">
                            ₹
                            {collab?.amount
                              ? collab?.amount.toLocaleString()
                              : 0}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Posted Date and Applicants */}
                    <div className="flex items-center gap-3 text-sm text-default-500">
                      <span>Posted {timeAgo(collab.created_at)}</span>
                      <span>•</span>
                      {/*<Chip*/}
                      {/*  color={1 > 0 ? "primary" : "default"}*/}
                      {/*  size="sm"*/}
                      {/*  variant="flat"*/}
                      {/*>*/}
                      {/*  {1} Applicant*/}
                      {/*  {2 !== 1 && "s"}*/}
                      {/*</Chip>*/}
                    </div>
                  </div>

                  {/* Action Buttons for Desktop */}
                  <div className="hidden md:flex flex-col gap-2 min-w-[180px]">
                    <Button
                      as={Link}
                      className="w-full"
                      href={`/business/dashboard/collabs/${collab.id}`}
                      size="sm"
                      startContent={<EyeSolid />}
                    >
                      View Applicants
                    </Button>
                    {collab.status === COLLAB_STATUS.ACTIVE && (
                      <Button
                        as={Link}
                        className="w-full"
                        href={`/business/dashboard/collabs/${collab.id}/edit`}
                        size="sm"
                        startContent={<Edit />}
                        variant="flat"
                      >
                        Edit Collab
                      </Button>
                    )}
                    {collab.status === COLLAB_STATUS.ACTIVE && (
                      <Button
                        className="w-full"
                        color="danger"
                        size="sm"
                        startContent={<Xmark />}
                        variant="flat"
                        onPress={() => openCloseModal(collab.id)}
                      >
                        Close Collab
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>

              {/* Action Buttons for Mobile */}
              <CardFooter className="flex md:hidden gap-2 flex-wrap">
                <Button
                  as={Link}
                  className="flex-1"
                  href={`/business/dashboard/collabs/${collab.id}`}
                  size="sm"
                >
                  View Applicants
                </Button>
                {collab.status === COLLAB_STATUS.ACTIVE && (
                  <Button
                    as={Link}
                    className="flex-1"
                    href={`/business/dashboard/collabs/${collab.id}/edit`}
                    size="sm"
                    startContent={<Edit />}
                    variant="flat"
                  >
                    Edit Collab
                  </Button>
                )}
                {collab.status === COLLAB_STATUS.ACTIVE && (
                  <Button
                    className="flex-1"
                    color="danger"
                    size="sm"
                    startContent={<Xmark />}
                    variant="flat"
                    onPress={() => openCloseModal(collab.id)}
                  >
                    Close Collab
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="w-full">
          <CardBody className="py-12 flex flex-col items-center justify-center">
            <Suitcase className="text-default-300 size-12" />
            <h3 className="text-xl font-medium mt-6">
              No collaborations found
            </h3>
            <p className="text-default-500 mt-2 text-center max-w-md">
              {searchQuery || statusFilter !== "ALL"
                ? "No collaborations match your search criteria. Try adjusting your filters."
                : "You haven't posted any collabs yet. Click below to create your first one."}
            </p>
            {searchQuery || statusFilter !== "ALL" ? (
              <Button
                className="mt-6"
                color="primary"
                variant="flat"
                onPress={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                as={Link}
                className="mt-6"
                color="primary"
                href="/business/dashboard/create"
                startContent={<Plus />}
              >
                Create New Collab
              </Button>
            )}
          </CardBody>
        </Card>
      )}
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
    </div>
  );
}
