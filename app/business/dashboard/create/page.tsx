"use client";

import { CreateCollabForm } from "@/components/business/CreateCollabForm";

export default function CreateCollabPage() {
  return (
    <div className="max-w-3xl mx-auto px-0 md:px-4 py-6">
      <div className="mb-8">
        <h1 className="text-base lg:text-xl font-bold">
          Create New Collaboration
        </h1>
        <p className="text-default-500 text-xs md:text-sm">
          Post an opportunity for influencers to collaborate with your business
        </p>
      </div>

      <CreateCollabForm />
    </div>
  );
}
