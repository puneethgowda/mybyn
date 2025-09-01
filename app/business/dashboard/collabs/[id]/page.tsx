"use client";

import { useQuery } from "@tanstack/react-query";
import { Edit, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import ApplicantsDataTable from "@/components/business/applicants-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/supabase/client";
import { formatDateForDisplay, timeAgo } from "@/utils/date";
import { COLLAB_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { formatNumber } from "@/utils/number";
import {
  getSingleBusinessCollabsOptions,
  useUpdateCollabStatusMutation,
} from "@/utils/react-query/business/collabs";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { getUserOptions } from "@/utils/react-query/user";
import { toTitleCase } from "@/utils/string";

export default function CollabDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const collabId = params.id as string;
  const supabase = createClient();

  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);

  // Confirmation modal state for close collab
  const [showCloseModal, setShowCloseModal] = useState<boolean>(false);

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: businessProfile } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string)
  );

  const businessId = useMemo(() => businessProfile?.id, [businessProfile]);

  const { data: collab, isPending } = useQuery(
    getSingleBusinessCollabsOptions(supabase, businessId as string, collabId)
  );

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

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case COLLAB_STATUS.ACTIVE:
        return <Badge className="bg-green-500">Active</Badge>;
      case COLLAB_STATUS.CLOSED:
        return <Badge variant="destructive">Closed</Badge>;
      default:
        return null;
    }
  };

  if (isPending) {
    return (
      <ScrollArea className="flex-1 w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
        <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
          <div className="space-y-6  px-0 md:px-4 py-6">
            <Card className="shadow-none">
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              </CardContent>
            </Card>
            <Skeleton className="h-10 w-full lg:w-md rounded-lg" />
            <Card className="shadow-none">
              <CardContent>
                <Skeleton className="h-32 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (!collab) {
    return (
      <ScrollArea className="flex-1 w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
        <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="font-semibold">Collaboration not found</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              The collaboration you&#39;re looking for doesn&#39;t exist or has
              been removed.
            </p>
            <Button asChild className="mt-6" variant="default">
              <Link href="/business/dashboard/collabs">
                Back to Collaborations
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <div className="space-y-8 px-0 md:px-4 py-6">
          {/* Collab Details */}
          <Card className="mb-4 shadow-none">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2">
              <div>
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  {toTitleCase(collab.title)}
                  {renderStatusBadge(collab.status)}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Posted {formatDateForDisplay(collab.created_at)} (
                  {timeAgo(collab.created_at)})
                </p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/business/dashboard/collabs/${collab.id}/edit`}>
                    <Edit className="mr-1 size-4" />
                    Edit
                  </Link>
                </Button>
                {collab.status === COLLAB_STATUS.ACTIVE && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedCollabId(collab.id);
                      setShowCloseModal(true);
                    }}
                  >
                    <X className="mr-1 size-4" />
                    Close Collab
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-1">
                    Collab Type
                  </h3>
                  <p className="font-semibold">
                    {COLLAB_TYPE[collab?.collab_type]}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-1">
                    Platform
                  </h3>
                  <p className="font-semibold">
                    {toTitleCase(collab.platform ?? "")}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-1">
                    Min Followers/Subscribers
                  </h3>
                  <p className="font-semibold">
                    {formatNumber(collab.min_followers)}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-1">
                    {collab.collab_type === COLLAB_TYPE.BARTER
                      ? "Value"
                      : "Amount Offered"}
                  </h3>
                  <p className="font-semibold">
                    {collab.collab_type === COLLAB_TYPE.BARTER
                      ? "Product Exchange"
                      : collab.amount
                        ? `₹${collab.amount.toLocaleString()}`
                        : "-"}
                  </p>
                </div>
              </div>
              <div className="mt-4 lg:mt-6">
                <h3 className="text-xs font-medium text-muted-foreground mb-1">
                  Description
                </h3>
                <p className="text-foreground">{collab.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Applicants Table */}
          {businessId && (
            <ApplicantsDataTable
              businessId={businessId as string}
              collabId={collabId}
            />
          )}

          {/* Close Collab Confirmation Modal */}
          <Dialog
            open={showCloseModal}
            onOpenChange={open => !open && setShowCloseModal(false)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Close Collaboration</DialogTitle>
                <DialogDescription>
                  Are you sure you want to close this collaboration? Closed
                  collaborations will no longer accept new applications.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCloseModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmCloseCollab}>
                  Yes, Close Collab
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ScrollArea>
  );
}
