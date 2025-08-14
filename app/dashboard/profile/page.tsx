"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/supabase/client";
import {
  getCreatorProfileOptions,
  getUserOptions,
} from "@/utils/react-query/user";
import { handleConnectInstagram } from "@/utils/instagram-connect";
import { Referral } from "@/components/referral";

export default function InfluencerProfilePage() {
  const supabase = createClient();

  const { data: userData } = useQuery(getUserOptions(supabase));
  const user = userData?.user;

  const { data: creatorProfile } = useQuery(
    getCreatorProfileOptions(supabase, user?.id as string),
  );

  const instagramConnected = !!creatorProfile?.instagram_handle;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-base lg:text-xl font-bold">Influencer Profile</h1>
          <p className="text-default-500 text-xs md:text-sm">
            Manage your profile information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-base md:text-lg font-semibold">
                Instagram Connection
              </h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm md:text-base font-medium">
                    {instagramConnected ? "Connected" : "Not Connected"}
                  </p>
                  {instagramConnected && (
                    <p className="text-default-500 text-sm">
                      {creatorProfile?.instagram_handle} •{" "}
                      {creatorProfile?.followers_count?.toLocaleString()}{" "}
                      followers
                    </p>
                  )}
                </div>
                <Button
                  color={instagramConnected ? "default" : "primary"}
                  variant={instagramConnected ? "flat" : "solid"}
                  onPress={handleConnectInstagram}
                >
                  {instagramConnected ? "Reconnect" : "Connect Instagram"}
                </Button>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-base md:text-lg font-semibold">
                Basic Information
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  className="w-24 h-24 text-2xl bg-primary/10 text-primary"
                  src={user?.user_metadata?.avatar_url}
                />
              </div>

              <Input
                disabled
                label="Full Name"
                value={user?.user_metadata?.name || ""}
              />

              <Input
                disabled
                label="Email"
                type="email"
                value={user?.user_metadata?.email || ""}
              />

              <Input
                disabled
                label="Phone"
                type="tel"
                value={user?.user_metadata?.phone || ""}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <Referral variant="profile" />
    </div>
  );
}
