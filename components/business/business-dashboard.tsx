"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RiBriefcase3Line, RiFileAddLine, RiGroupLine } from "@remixicon/react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { APPLICATION_STATUS, COLLAB_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { createClient } from "@/supabase/client";
import { getBusinessDashboardDataOptions } from "@/utils/react-query/business/collabs";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { StatsGrid } from "@/components/stats-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toTitleCase } from "@/utils/string";
import { timeAgo } from "@/utils/date";

export function BusinessDashboard({
  businessId,
  userId,
}: {
  businessId: string;
  userId: string;
}) {
  const supabase = createClient();

  const { data: dashboardData, isLoading: isLoadingDashboard } =
    useSuspenseQuery(
      getBusinessDashboardDataOptions(supabase, businessId as string),
    );
  const { data: businessProfile } = useSuspenseQuery(
    getBusinessProfileOptions(supabase, userId as string),
  );

  const stats = dashboardData?.stats || {
    activeCampaigns: 0,
    totalApplications: 0,
    acceptedCollabs: 0,
    rejectedCollabs: 0,
    profileCompletion: 0,
    instagramConnected: false,
  };

  const recentApplications = dashboardData?.recentApplications || [];
  const activeCollabs = dashboardData?.activeCollabs || [];

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return (
          <Badge color="warning" variant="outline">
            Pending
          </Badge>
        );
      case APPLICATION_STATUS.ACCEPTED:
        return (
          <Badge color="success" variant="outline">
            Accepted
          </Badge>
        );
      case APPLICATION_STATUS.REJECTED:
        return (
          <Badge color="danger" variant="outline">
            Rejected
          </Badge>
        );
      case COLLAB_STATUS.ACTIVE:
        return (
          <Badge color="success" variant="outline">
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge color="warning" variant="outline">
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
        {/* Page intro */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">
              Welcome back,{" "}
              {businessProfile?.name?.toUpperCase() || "Business Owner"} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your collaborations and applications
            </p>
          </div>
        </div>
      </div>

      {/* Numbers */}
      <StatsGrid
        stats={[
          {
            title: "Collabs Posted",
            value: stats.activeCampaigns.toString(),
            icon: (
              <svg
                fill="currentColor"
                height={20}
                width={20}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 0v2.013a8.001 8.001 0 1 0 5.905 14.258l1.424 1.422A9.958 9.958 0 0 1 10 19.951c-5.523 0-10-4.478-10-10C0 4.765 3.947.5 9 0Zm10.95 10.95a9.954 9.954 0 0 1-2.207 5.329l-1.423-1.423a7.96 7.96 0 0 0 1.618-3.905h2.013ZM11.002 0c4.724.47 8.48 4.227 8.95 8.95h-2.013a8.004 8.004 0 0 0-6.937-6.937V0Z" />
              </svg>
            ),
          },
          {
            title: "Interest Received",
            value: stats.totalApplications.toString(),
            // change: {
            //   value: "+42%",
            //   trend: "up",
            // },
            icon: (
              <svg
                fill="currentColor"
                height={19}
                width={18}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 9.5c0 .313.461.858 1.53 1.393C4.914 11.585 6.877 12 9 12c2.123 0 4.086-.415 5.47-1.107C15.538 10.358 16 9.813 16 9.5V7.329C14.35 8.349 11.827 9 9 9s-5.35-.652-7-1.671V9.5Zm14 2.829C14.35 13.349 11.827 14 9 14s-5.35-.652-7-1.671V14.5c0 .313.461.858 1.53 1.393C4.914 16.585 6.877 17 9 17c2.123 0 4.086-.415 5.47-1.107 1.069-.535 1.53-1.08 1.53-1.393v-2.171ZM0 14.5v-10C0 2.015 4.03 0 9 0s9 2.015 9 4.5v10c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5ZM9 7c2.123 0 4.086-.415 5.47-1.107C15.538 5.358 16 4.813 16 4.5c0-.313-.461-.858-1.53-1.393C13.085 2.415 11.123 2 9 2c-2.123 0-4.086.415-5.47 1.107C2.461 3.642 2 4.187 2 4.5c0 .313.461.858 1.53 1.393C4.914 6.585 6.877 7 9 7Z" />
              </svg>
            ),
          },
          {
            title: "Collabs Accepted",
            value: stats.acceptedCollabs.toString(),
            icon: (
              <svg
                fill="currentColor"
                height={20}
                width={20}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.833 3.337a.596.596 0 0 1 .763.067.59.59 0 0 1 .063.76c-2.18 3.046-3.38 4.678-3.598 4.897a1.5 1.5 0 0 1-2.122-2.122c.374-.373 2.005-1.574 4.894-3.602ZM15.5 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-11 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm2.318-3.596a1 1 0 1 1-1.414 1.414 1 1 0 0 1 1.414-1.414ZM10 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
              </svg>
            ),
          },
          {
            title: "Collabs Rejected",
            value: stats.rejectedCollabs.toString(),
            icon: (
              <svg
                fill="currentColor"
                height={20}
                width={20}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.833 3.337a.596.596 0 0 1 .763.067.59.59 0 0 1 .063.76c-2.18 3.046-3.38 4.678-3.598 4.897a1.5 1.5 0 0 1-2.122-2.122c.374-.373 2.005-1.574 4.894-3.602ZM15.5 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-11 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm2.318-3.596a1 1 0 1 1-1.414 1.414 1 1 0 0 1 1.414-1.414ZM10 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
              </svg>
            ),
          },
        ]}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2 shadow-none">
          <CardHeader className="flex justify-between items-center">
            <h3 className="font-bold">Recent Applications</h3>
            <Link href="/business/dashboard/collabs">
              <Button size="sm" variant="link">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="">
            {isLoadingDashboard ? (
              <div className="flex justify-center p-4">Loading...</div>
            ) : recentApplications.length > 0 ? (
              <div className="bg-background overflow-hidden">
                <Table className="border-none">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-11">Creator</TableHead>
                      <TableHead className="h-11">Collab</TableHead>
                      <TableHead className="h-11">Status</TableHead>
                      <TableHead className="h-11 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="rounded-md h-10 w-10">
                              <AvatarImage
                                alt="application profile"
                                src={
                                  application.creator_profile
                                    .profile_pic_url as string
                                }
                              />
                              <AvatarFallback className=" rounded-md">
                                {application.creator_profile.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {application.creator_profile.name}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>
                                  {application.creator_profile.instagram_handle}
                                </span>
                                <span className="mx-1">•</span>
                                <span className="hidden md:block">
                                  {application.creator_profile?.followers_count?.toLocaleString()}{" "}
                                  followers
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {toTitleCase(application.collab.title)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {timeAgo(application.created_at)}
                          </p>
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(application.status)}
                        </TableCell>
                        <TableCell className=" text-right">
                          <Link
                            href={`/business/dashboard/collabs/${application.collab.id}`}
                          >
                            <Button size="sm" variant="link">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // <Table aria-label="Recent applications">
              //   <TableHeader>
              //     <TableColumn>CREATOR</TableColumn>
              //     <TableColumn>COLLAB</TableColumn>
              //     <TableColumn>STATUS</TableColumn>
              //     <TableColumn>ACTION</TableColumn>
              //   </TableHeader>
              //   <TableBody>
              //     {recentApplications.map((application) => (
              //       <TableRow key={application.id}>
              //         <TableCell>
              //           <div className="flex items-center gap-3">
              //             <Avatar
              //               className="bg-primary/10 text-primary"
              //               name={application.creator_profile.name.charAt(0)}
              //               size="sm"
              //               src={
              //                 application.creator_profile.profile_pic_url ||
              //                 undefined
              //               }
              //             />
              //             <div>
              //               <p className="font-medium">
              //                 {application.creator_profile.name}
              //               </p>
              //               <div className="flex items-center text-xs text-muted-foreground">
              //                 <span>
              //                   {application.creator_profile.instagram_handle}
              //                 </span>
              //                 <span className="mx-1">•</span>
              //                 <span className="hidden md:block">
              //                   {application.creator_profile?.followers_count?.toLocaleString()}{" "}
              //                   followers
              //                 </span>
              //               </div>
              //             </div>
              //           </div>
              //         </TableCell>
              //         <TableCell>
              //           <p className="font-medium">
              //             {toTitleCase(application.collab.title)}
              //           </p>
              //           <p className="text-xs text-muted-foreground">
              //             {timeAgo(application.created_at)}
              //           </p>
              //         </TableCell>
              //         <TableCell>
              //           {renderStatusBadge(application.status)}
              //         </TableCell>
              //         <TableCell>
              //           <Link
              //             href={`/dashboard/applications/${application.id}`}
              //           >
              //             <Button size="sm" variant="link">
              //               View
              //             </Button>
              //           </Link>
              //         </TableCell>
              //       </TableRow>
              //     ))}
              //   </TableBody>
              // </Table>
              <div className="flex flex-col items-center justify-center py-8">
                <RiGroupLine className="size-8 text-muted-foreground" />
                <h3 className="font-medium mt-2">No applicants yet</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Share your collab on Instagram to attract more influencers!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create New Collab */}
        <Card className="shadow-none bg-linear-to-br from-primary-100/30 to-secondary-100/30">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="p-4 bg-background rounded-full">
              <RiFileAddLine className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-center">Create New Collab</h3>
            <p className="text-sm text-center text-muted-foreground">
              Post a new collaboration opportunity for influencers
            </p>
            <Link href="/business/dashboard/create">
              <Button className="mt-2" size="sm">
                Create Collab
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Your Active Collabs */}
      <Card className="shadow-none">
        <CardHeader className="flex justify-between items-center">
          <h3 className="font-bold">Your Active Collabs</h3>
          <Link href="/dashboard/campaigns">
            <Button size="sm" variant="link">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoadingDashboard ? (
            <div className="flex justify-center p-4">Loading...</div>
          ) : activeCollabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCollabs.map((collab) => (
                <Card
                  key={collab.id}
                  className="border border-divider shadow-none"
                >
                  <CardContent className="">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{collab.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {COLLAB_TYPE[collab.collab_type]}
                          </Badge>
                        </div>
                      </div>
                      {renderStatusBadge(collab.status)}
                    </div>
                    {/*<div className="mt-2">*/}
                    {/*  <p className="text-sm text-muted-foreground">*/}
                    {/*    <span className="font-medium">*/}
                    {/*      /!*{collab.application_count}*!/0*/}
                    {/*    </span>{" "}*/}
                    {/*    Applications*/}
                    {/*    /!*{collab.selected_count && collab.selected_count > 0 && (*!/*/}
                    {/*    /!*  <span>*!/*/}
                    {/*    /!*    ,{" "}*!/*/}
                    {/*    /!*    <span className="font-medium">*!/*/}
                    {/*    /!*      {collab.selected_count}*!/*/}
                    {/*    /!*    </span>{" "}*!/*/}
                    {/*    /!*    Selected*!/*/}
                    {/*    /!*  </span>*!/*/}
                    {/*    /!*)}*!/*/}
                    {/*  </p>*/}
                    {/*</div>*/}
                    <div className="flex gap-2 mt-2">
                      {collab.status === COLLAB_STATUS.ACTIVE ? (
                        <>
                          <Link href={`/business/dashboard/collabs`}>
                            <Button
                              className="flex-1"
                              size="sm"
                              variant="outline"
                            >
                              View Applicants
                            </Button>
                          </Link>

                          <Link href={`/dashboard/campaigns/${collab.id}/edit`}>
                            <Button
                              className="flex-1"
                              size="sm"
                              variant="secondary"
                            >
                              Edit
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Link href={`/dashboard/campaigns/${collab.id}/edit`}>
                          <Button
                            className="w-full"
                            size="sm"
                            variant="secondary"
                          >
                            Edit Draft
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <RiBriefcase3Line className="size-8 text-muted-foreground" />
              <h3 className="font-medium mt-2">No active collabs</h3>
              <p className="text-sm text-muted-foreground text-center">
                Create your first collaboration to connect with influencers
              </p>

              <Link href="/business/dashboard/create">
                <Button className="mt-4" size="sm">
                  Create Collab
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
