"use client";
import { RiInstagramLine } from "@remixicon/react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const InstagramConnectError = () => {
  const params = useParams();
  const connectStatus = params.status as string;
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="h-full w-full flex justify-center items-center flex-col space-y-4">
      <RiInstagramLine className="size-16" />
      <h1
        className={`font-bold ${
          connectStatus === "success" ? "text-green-500" : "text-red-500"
        }`}
      >
        {connectStatus === "success"
          ? "Instagram account connected successfully."
          : "Failed to connect to Instagram. Please try again."}
      </h1>
      <p>{message}</p>
      <Link href="/dashboard">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
};

export default InstagramConnectError;
