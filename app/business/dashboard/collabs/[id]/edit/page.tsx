"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@heroui/skeleton";
import { useQuery } from "@tanstack/react-query";

import {
  CreateCollabForm,
  FormData,
} from "@/components/business/CreateCollabForm";
import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { getSingleBusinessCollabsOptions } from "@/utils/react-query/business/collabs";

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

  if (isLoading || !collab) {
    return (
      <div className="max-w-3xl mx-auto px-0 md:px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>

          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-0 md:px-4 py-6">
      <div className="mb-8">
        <h1 className="text-base lg:text-xl font-bold">Edit Collaboration</h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Update the details of your collaboration opportunity
        </p>
      </div>

      <CreateCollabForm
        collabId={collabId}
        initialData={collab as Partial<FormData>}
        isEditing={true}
      />
    </div>
  );
}
