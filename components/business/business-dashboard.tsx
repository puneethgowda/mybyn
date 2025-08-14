"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Box3dPoint,
  DoubleCheck,
  Group,
  Plus,
  Suitcase,
  Xmark,
} from "iconoir-react";

import ApplicationStatsCard from "../dashboard/home/application-stats-card";

import { APPLICATION_STATUS, COLLAB_STATUS, COLLAB_TYPE } from "@/utils/enums";
import { createClient } from "@/supabase/client";
import { getBusinessDashboardDataOptions } from "@/utils/react-query/business/collabs";
import { timeAgo } from "@/utils/date";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { toTitleCase } from "@/utils/string";

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
          <Chip color="warning" size="sm" variant="flat">
            Pending
          </Chip>
        );
      case APPLICATION_STATUS.ACCEPTED:
        return (
          <Chip color="success" size="sm" variant="flat">
            Accepted
          </Chip>
        );
      case APPLICATION_STATUS.REJECTED:
        return (
          <Chip color="danger" size="sm" variant="flat">
            Rejected
          </Chip>
        );
      case COLLAB_STATUS.ACTIVE:
        return (
          <Chip color="success" size="sm" variant="flat">
            Active
          </Chip>
        );
      case "draft":
        return (
          <Chip color="warning" size="sm" variant="flat">
            Draft
          </Chip>
        );
      default:
        return (
          <Chip size="sm" variant="flat">
            {status}
          </Chip>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-primary-100/40 to-secondary-100/40 p-6 rounded-xl">
        <div>
          <h1 className="text-lg md:text-2xl font-bold">
            Welcome back,{" "}
            {businessProfile?.name?.toUpperCase() || "Business Owner"} 👋
          </h1>
          <p className="text-default-600 mt-1 text-xs md:text-base">
            Manage your collaborations and applications
          </p>
        </div>

        {/* Instagram Connection Status */}
        {/*{!stats.instagramConnected && (*/}
        {/*  <Button*/}
        {/*    as={Link}*/}
        {/*    className="flex items-center gap-2"*/}
        {/*    color="primary"*/}
        {/*    href="/dashboard/connect-instagram"*/}
        {/*  >*/}
        {/*    <Instagram />*/}
        {/*    Connect Instagram*/}
        {/*  </Button>*/}
        {/*)}*/}
      </div>

      {/* Profile Completion (if not complete) */}
      {stats.profileCompletion < 100 && (
        <Card>
          <CardBody className="gap-2">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
              <div className="flex-1 w-full">
                <p className="text-sm md:text-base text-default-500">
                  Profile Completion
                </p>
                <Progress
                  className="mt-2"
                  color={stats.profileCompletion < 70 ? "warning" : "success"}
                  value={stats.profileCompletion}
                />
                <p className="text-sm text-right">{stats.profileCompletion}%</p>
              </div>
              <Button as={Link} href="/dashboard/business-profile" size="sm">
                Complete Profile
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ApplicationStatsCard
          count={stats.activeCampaigns}
          icon={<Box3dPoint className="size-5 text-primary" />}
          title="Total Collabs Posted"
        />
        <ApplicationStatsCard
          count={stats.totalApplications}
          icon={<Group className="size-5 text-secondary" />}
          title="Interest Received"
        />

        <ApplicationStatsCard
          count={stats.acceptedCollabs}
          icon={<DoubleCheck className="size-5 text-success" />}
          title="Collabs Accepted"
        />

        <ApplicationStatsCard
          count={stats.rejectedCollabs}
          icon={<Xmark className="size-5 text-danger" />}
          title="Collabs Rejected"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-sm md:text-lg font-bold">
              <span className="mr-2">🧑‍💻</span>
              Recent Applications
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
            {isLoadingDashboard ? (
              <div className="flex justify-center p-4">Loading...</div>
            ) : recentApplications.length > 0 ? (
              <Table aria-label="Recent applications">
                <TableHeader>
                  <TableColumn>CREATOR</TableColumn>
                  <TableColumn>COLLAB</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTION</TableColumn>
                </TableHeader>
                <TableBody>
                  {recentApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            className="bg-primary/10 text-primary"
                            name={application.creator_profile.name.charAt(0)}
                            size="sm"
                            src={
                              application.creator_profile.profile_pic_url ||
                              undefined
                            }
                          />
                          <div>
                            <p className="font-medium">
                              {application.creator_profile.name}
                            </p>
                            <div className="flex items-center text-xs text-default-500">
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
                        <p className="text-xs text-default-500">
                          {timeAgo(application.created_at)}
                        </p>
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        <Button
                          as={Link}
                          href={`/dashboard/applications/${application.id}`}
                          size="sm"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Group className="size-12 text-default-500" />
                <h3 className="text-lg md:text-xl font-medium mt-4">
                  No applicants yet
                </h3>
                <p className="text-sm md:text-base text-default-500 mt-2 text-center">
                  Share your collab on Instagram to attract more influencers!
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Create New Collab */}
        <Card className="bg-linear-to-br from-primary-100/30 to-secondary-100/30">
          <CardBody className="flex flex-col items-center justify-center py-8 gap-2 md:gap-4">
            <div className="p-4 bg-background rounded-full">
              <Plus className="size-8 text-default-500" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-center">
              Create New Collab
            </h3>
            <p className="text-sm md:text-base text-center text-default-600">
              Post a new collaboration opportunity for influencers
            </p>
            <Button
              as={Link}
              className="mt-2"
              color="primary"
              href="/business/dashboard/create"
              size="lg"
            >
              Create Collab
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Your Active Collabs */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-sm md:text-lg font-bold">
            <span className="mr-2">💼</span>
            Your Active Collabs
          </h3>
          <Button
            as={Link}
            href="/dashboard/campaigns"
            size="sm"
            variant="light"
          >
            View All
          </Button>
        </CardHeader>
        <CardBody>
          {isLoadingDashboard ? (
            <div className="flex justify-center p-4">Loading...</div>
          ) : activeCollabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCollabs.map((collab) => (
                <Card key={collab.id} className="border border-divider">
                  <CardBody className="gap-3 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{collab.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Chip size="sm" variant="flat">
                            {COLLAB_TYPE[collab.collab_type]}
                          </Chip>
                        </div>
                      </div>
                      {renderStatusBadge(collab.status)}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-default-600">
                        <span className="font-medium">
                          {/*{collab.application_count}*/}0
                        </span>{" "}
                        Applications
                        {/*{collab.selected_count && collab.selected_count > 0 && (*/}
                        {/*  <span>*/}
                        {/*    ,{" "}*/}
                        {/*    <span className="font-medium">*/}
                        {/*      {collab.selected_count}*/}
                        {/*    </span>{" "}*/}
                        {/*    Selected*/}
                        {/*  </span>*/}
                        {/*)}*/}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {collab.status === COLLAB_STATUS.ACTIVE ? (
                        <>
                          <Button
                            as={Link}
                            className="flex-1"
                            href={`/dashboard/campaigns/${collab.id}`}
                            size="sm"
                          >
                            View Applicants
                          </Button>
                          <Button
                            as={Link}
                            className="flex-1"
                            href={`/dashboard/campaigns/${collab.id}/edit`}
                            size="sm"
                            variant="flat"
                          >
                            Edit
                          </Button>
                        </>
                      ) : (
                        <Button
                          as={Link}
                          className="w-full"
                          href={`/dashboard/campaigns/${collab.id}/edit`}
                          size="sm"
                        >
                          Edit Draft
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Suitcase className="size-12 text-default-500" />
              <h3 className="text-xl font-medium mt-4">No active collabs</h3>
              <p className="text-default-500 mt-2 text-center">
                Create your first collaboration to connect with influencers
              </p>
              <Button
                as={Link}
                className="mt-4"
                color="primary"
                href="/business/dashboard/create"
              >
                Create Collab
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
