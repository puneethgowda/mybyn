"use client";

import {
  RiCalendarLine,
  RiInstagramLine,
  RiWalletLine,
} from "@remixicon/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StatsGrid } from "../stats-grid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { createClient } from "@/supabase/client";
import { timeAgo } from "@/utils/date";
import { APPLICATION_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { handleConnectInstagram } from "@/utils/instagram-connect";
import {
  getCreatorRecentApplicationsOptions,
  getCreatorStatsOptions,
} from "@/utils/react-query/creator";
import {
  getCreatorProfileOptions,
  getUserOptions,
} from "@/utils/react-query/user";
import { toTitleCase } from "@/utils/string";

export function CreatorDashboard({ userId }: { userId: string }) {
  const supabase = createClient();

  const [stats, setStats] = useState({
    applicationsSent: 0,
    applicationsAccepted: 0,
    applicationsRejected: 0,
    profileCompletion: 0,
  });

  const { isSm: _isSm } = useBreakpoint();

  const { data: creatorStats } = useSuspenseQuery(
    getCreatorStatsOptions(supabase, userId)
  );
  const {
    data: { user },
  } = useSuspenseQuery(getUserOptions(supabase));

  const { data: creatorProfile } = useQuery(
    getCreatorProfileOptions(supabase, user?.id as string)
  );

  const { data: recentApplications } = useSuspenseQuery(
    getCreatorRecentApplicationsOptions(supabase, userId)
  );

  useEffect(() => {
    const applicationStatus: Record<string, number> = {};
    let applicationsSent: number = 0;

    creatorStats?.data?.forEach(each => {
      applicationStatus[each.status] = each.count;
      applicationsSent += each.count;
    });

    setStats({
      applicationsSent: applicationsSent,
      applicationsAccepted: applicationStatus[APPLICATION_STATUS.ACCEPTED] || 0,
      applicationsRejected: applicationStatus[APPLICATION_STATUS.REJECTED] || 0,
      profileCompletion: 70,
    });
  }, [creatorStats]);

  const recommendedCollabs: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
        {/* Page intro */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">
              Hey {user?.user_metadata?.name} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome to your creators dashboard
            </p>
          </div>
          {/* Instagram Connection Status */}
          {!creatorProfile?.instagram_handle && (
            <Button onClick={handleConnectInstagram}>
              <RiInstagramLine />
              Connect Instagram
            </Button>
          )}
        </div>
      </div>

      {/* Numbers */}
      <StatsGrid
        stats={[
          {
            title: "Requests Sent",
            value: stats.applicationsSent.toString(),
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
            title: "Requests Accepted",
            value: stats.applicationsAccepted.toString(),
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
            title: "Requests Rejected",
            value: stats.applicationsRejected.toString(),
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

      {/* ⏱ Recent Applications */}
      <Card className="shadow-none">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Recent Applications</h3>
          </div>

          <Link href="/dashboard/applications">
            <Button size="sm" variant="link">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentApplications && recentApplications.length > 0 ? (
            <div className="space-y-2">
              {recentApplications.map(application => (
                <div
                  key={application.id}
                  className="group hover:bg-accent/50 flex flex-col items-start gap-4 rounded-lg p-4 transition-colors sm:flex-row sm:items-center"
                >
                  <div className="flex w-full items-center gap-4 sm:w-auto">
                    <div className="relative">
                      <Image
                        alt="Alex Johnson"
                        className="rounded-full h-10 w-10"
                        height={40}
                        src={application.collabs.business_profile.logo_url}
                        width={40}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-sm font-medium">
                          {toTitleCase(application.collabs.title)}
                        </h4>
                        <Badge variant="secondary">{application.status}</Badge>
                      </div>
                      <div className="text-muted-foreground mt-1 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center gap-1">
                          <span className="truncate">
                            {toTitleCase(
                              application.collabs.business_profile.name
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RiWalletLine size={12} />
                          <span>
                            {COLLAB_TYPE[application.collabs.collab_type]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <RiCalendarLine size={12} />
                      <span>{timeAgo(application.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pb-2">
              <h4 className="font-semibold">No applications yet</h4>
              <p className="text-center text-sm text-muted-foreground max-w-sm mb-4">
                You haven&#39;t applied to any collaborations yet. Explore
                opportunities and start applying!
              </p>
              <Link href="/dashboard/discover">
                <Button size="sm">Discover Opportunities</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔥 Recommended Collabs */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="font-semibold">Recent Applications</h3>
          <Link href="/dashboard/discover">
            <Button size="sm" variant="link">
              Browse All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recommendedCollabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/*{recommendedCollabs.map((collab) => (*/}
              {/* <></>*/}
              {/*))}*/}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pb-2">
              <h4 className="font-semibold">No recommendations yet</h4>
              <p className="text-center text-sm text-muted-foreground max-w-sm mb-4">
                We&#39;re working on finding the perfect collaborations for you.
                Complete your profile to get better recommendations.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/discover">
                  <Button size="sm">Discover Opportunities</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
