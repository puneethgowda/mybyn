"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { CheckSquare, Instagram, SendMail, XmarkSquare } from "iconoir-react";

import { APPLICATION_STATUS } from "@/utils/enums";
import { timeAgo } from "@/utils/date";
import { createClient } from "@/supabase/client";
import {
  getCreatorRecentApplicationsOptions,
  getCreatorStatsOptions,
} from "@/utils/react-query/creator";
import {
  getCreatorProfileOptions,
  getUserOptions,
} from "@/utils/react-query/user";
import ApplicationStatsCard from "@/components/dashboard/home/application-stats-card";
import { toTitleCase } from "@/utils/string";
import { handleConnectInstagram } from "@/utils/instagram-connect";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { Referral } from "@/components/referral";

export function CreatorDashboard({ userId }: { userId: string }) {
  const supabase = createClient();

  const [stats, setStats] = useState({
    applicationsSent: 0,
    applicationsAccepted: 0,
    applicationsRejected: 0,
    profileCompletion: 0,
  });

  const { isSm } = useBreakpoint();

  const { data: creatorStats } = useSuspenseQuery(
    getCreatorStatsOptions(supabase, userId),
  );
  const {
    data: { user },
  } = useSuspenseQuery(getUserOptions(supabase));

  const { data: creatorProfile } = useQuery(
    getCreatorProfileOptions(supabase, user?.id as string),
  );

  const { data: recentApplications } = useSuspenseQuery(
    getCreatorRecentApplicationsOptions(supabase, userId),
  );

  useEffect(() => {
    const applicationStatus: Record<string, number> = {};
    let applicationsSent: number = 0;

    creatorStats?.data?.forEach((each) => {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-primary-100/40 to-secondary-100/40 p-6 rounded-xl">
        <div>
          <h1 className="text-lg md:text-2xl font-bold">
            Hey {user?.user_metadata?.name} 👋
          </h1>
          <p className="text-default-600 mt-1 text-xs md:text-base">
            Welcome to your creators dashboard
          </p>
        </div>

        {/* Instagram Connection Status */}
        {!creatorProfile?.instagram_handle && (
          <Button
            className="flex items-center gap-2"
            color="primary"
            onPress={handleConnectInstagram}
          >
            <Instagram />
            Connect Instagram
          </Button>
        )}
      </div>

      {/* 📊 Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ApplicationStatsCard
          count={stats.applicationsSent}
          icon={<SendMail className="text-primary" />}
          title="Applications Sent"
        />
        <ApplicationStatsCard
          count={stats.applicationsAccepted}
          icon={<CheckSquare className="text-green-500" />}
          title="Applications Accepted"
        />
        <ApplicationStatsCard
          count={stats.applicationsRejected}
          icon={<XmarkSquare className="text-danger" />}
          title="Applications Rejected"
        />
      </div>

      {/* Referral Block */}
      <Referral variant="dashboard" />

      {/* ⏱ Recent Applications */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-sm md:text-lg font-bold">
            ⏱ Recent Applications
          </h3>
          <Button
            as={Link}
            href="/dashboard/applications"
            size="sm"
            variant="light"
          >
            View All
          </Button>
        </CardHeader>
        <CardBody>
          {recentApplications && recentApplications.length > 0 ? (
            <ScrollShadow className="w-full" orientation="horizontal">
              <div className="flex gap-4 pb-4 overflow-x-auto min-w-full">
                {recentApplications.map((application) => (
                  <Card
                    key={application.id}
                    className="min-w-[260px] max-w-[260px] border border-divider"
                  >
                    <CardBody className="gap-2 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm md:text-base font-semibold  line-clamp-2">
                            {toTitleCase(
                              application.collabs.business_profile.name,
                            )}
                          </h4>
                          <p className="text-xs md:text-sm text-default-500  line-clamp-2">
                            {toTitleCase(application.collabs.title)}
                          </p>
                        </div>
                        <Chip
                          color={
                            application.status === APPLICATION_STATUS.ACCEPTED
                              ? "success"
                              : application.status ===
                                  APPLICATION_STATUS.REJECTED
                                ? "danger"
                                : "warning"
                          }
                          size="sm"
                          variant="flat"
                        >
                          {application.status}
                        </Chip>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-medium">
                          ₹{application.collabs.amount}
                        </p>
                        <p className="text-xs text-default-400">
                          {timeAgo(application.created_at)}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ScrollShadow>
          ) : (
            <div className="flex flex-col items-center justify-center pb-2">
              <h4 className="text-base md:text-xl font-medium mb-2">
                No applications yet
              </h4>
              <p className="text-default-500 text-xs md:text-sm text-center max-w-md mb-6">
                You haven&#39;t applied to any collaborations yet. Explore
                opportunities and start applying!
              </p>
              <Button
                as={Link}
                color="primary"
                href="/dashboard/discover"
                size={isSm ? "sm" : "md"}
              >
                Discover Opportunities
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* 🔥 Recommended Collabs */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-sm md:text-lg font-bold">
            🔥 Recommended Collaborations
          </h3>
          <Button
            as={Link}
            href="/dashboard/discover"
            size="sm"
            variant="light"
          >
            Browse All
          </Button>
        </CardHeader>
        <CardBody>
          {recommendedCollabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/*// @ts-ignore*/}
              {recommendedCollabs.map((collab) => (
                <Card key={collab.id} className="border border-divider">
                  <CardBody className="gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        className="bg-primary/20 text-primary"
                        name={collab.logo}
                        size="md"
                      />
                      <div>
                        <h4 className="font-semibold">{collab.businessName}</h4>
                        <p className="text-xs text-default-500">
                          {collab.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Chip size="sm" variant="flat">
                        {collab.budget}
                      </Chip>
                      <Chip size="sm" variant="flat">
                        {collab.category}
                      </Chip>
                    </div>
                    <div className="mt-2">
                      {collab.applied ? (
                        <Chip
                          className="w-full justify-center"
                          color={
                            collab.status === "Accepted"
                              ? "success"
                              : collab.status === "Rejected"
                                ? "danger"
                                : "warning"
                          }
                          variant="flat"
                        >
                          {collab.status || "Applied"}
                        </Chip>
                      ) : (
                        <Button
                          as={Link}
                          className="w-full"
                          href={`/dashboard/opportunities/${collab.id}`}
                          size="sm"
                        >
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pb-2">
              <h4 className="text-base md:text-xl  font-medium mb-2">
                No recommendations yet
              </h4>
              <p className="text-default-500 text-xs md:text-sm text-center max-w-md mb-6">
                We&#39;re working on finding the perfect collaborations for you.
                Complete your profile to get better recommendations.
              </p>
              <div className="flex gap-3">
                <Button
                  as={Link}
                  href="/dashboard/profile"
                  size={isSm ? "sm" : "md"}
                  variant="flat"
                >
                  Complete Profile
                </Button>
                <Button
                  as={Link}
                  color="primary"
                  href="/dashboard/discover"
                  size={isSm ? "sm" : "md"}
                >
                  Browse Opportunities
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
