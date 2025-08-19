"use client";
import React from "react";
import { Button } from "@heroui/button";
import { Instagram } from "iconoir-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const InstagramConnectError = () => {
  const params = useParams();
  const connectStatus = params.status as string;
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="h-full w-full flex justify-center items-center flex-col space-y-4">
      <Instagram className="size-16" />
      <h1
        className={`font-bold ${
          connectStatus === "success" ? "text-success" : "text-danger"
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
