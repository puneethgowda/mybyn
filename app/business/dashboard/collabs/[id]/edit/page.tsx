"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  CreateCollabForm,
  FormData,
} from "@/components/business/CreateCollabForm";
import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { getSingleBusinessCollabsOptions } from "@/utils/react-query/business/collabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EditCollabPage() {
  const params = useParams();
  const collabId = params.id as string;
  const supabase = createClient();

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: businessProfile } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );
  const businessId = useMemo(() => businessProfile?.id, [businessProfile]);

  const { data: collab, isLoading } = useQuery(
    getSingleBusinessCollabsOptions(supabase, businessId as string, collabId),
  );

  if (isLoading) {
    return (
      <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
        <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
          <div className="container max-w-3xl mx-auto px-0 md:px-4 py-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>

              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <div className="container max-w-3xl mx-auto px-0 md:px-4 py-6">
          {/* Header */}
          <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-base lg:text-xl font-bold">
                  Edit Collaboration
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Update the details of your collaboration
                </p>
              </div>
            </div>
          </div>

          <CreateCollabForm
            collabId={collabId}
            initialData={collab as Partial<FormData>}
            isEditing={true}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
