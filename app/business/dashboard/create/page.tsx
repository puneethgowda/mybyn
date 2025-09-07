"use client";

import { CreateCollabForm } from "@/components/business/CreateCollabForm";

export default function CreateCollabPage() {
  return (
    <div className="flex flex-col px-4 md:px-6 lg:px-8 md:shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl  w-full bg-background pb-16 md:pb-4">
      <div className="container max-w-3xl mx-auto px-0 md:px-4 py-6">
        {/* Header */}
        <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-base lg:text-xl font-bold">
                {" "}
                Create New Collaboration
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm">
                Post an opportunity for influencers to collaborate with your
                business
              </p>
            </div>
          </div>
        </div>

        <CreateCollabForm />
      </div>
    </div>
  );
}
