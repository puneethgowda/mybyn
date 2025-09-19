"use client";

import {
  RiErrorWarningLine,
  RiInstagramLine,
  RiLogoutCircleLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/supabase/client";
import { handleConnectInstagram } from "@/utils/instagram-connect";
import {
  getCreatorProfileOptions,
  getUserOptions,
} from "@/utils/react-query/user";

export default function InfluencerProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const { data: userData } = useQuery(getUserOptions(supabase));
  const user = userData?.user;

  const { data: creatorProfile } = useQuery(
    getCreatorProfileOptions(supabase, user?.id as string)
  );

  const instagramConnected = !!creatorProfile?.instagram_handle;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col px-4 md:px-6 lg:px-8 md:shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl  w-full bg-background pb-16 md:pb-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-1 flex-col lg:gap-6 py-4 lg:py-6 md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-base lg:text-xl font-bold">Profile</h1>
              <p className="text-muted-foreground text-xs md:text-sm">
                Manage your profile information and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="space-y-6">
            {!instagramConnected && (
              <Card className="shadow-none">
                <CardContent className="flex flex-col md:flex-row items-center flex-wrap sm:flex-wrap justify-between grow gap-2 rtl:[background-position:-30%_41%] [background-position:121%_41%]">
                  <div className="flex flex-col md:flex-row  items-center gap-4">
                    <div className="relative size-8 md:size-12 shrink-0">
                      {/* Shield SVG */}
                      <svg
                        className="w-full h-full stroke-orange-200 dark:stroke-orange-950 fill-orange-50 dark:fill-orange-950/30"
                        fill="none"
                        height="48"
                        viewBox="0 0 44 48"
                        width="44"
                      >
                        <path d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506 18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937 39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z" />
                        <path
                          d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506 14.3196 43.1506 18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919 47.1572 19.8081 47.1572 16.25 45.1029L6.59937 39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365 14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z"
                          stroke=""
                        />
                      </svg>
                      {/* Alert Icon */}
                      <div className="absolute leading-none start-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rtl:translate-x-2/4">
                        <RiErrorWarningLine className="text-orange-400 size-4 md:size-6" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start justify-center md:justify-start gap-1.5">
                      <p className="font-bold">
                        Connect your instagram account
                      </p>
                      <div className="text-center text-sm text-muted-foreground">
                        Connect your Instagram to apply. It helps brands trust
                        your profile and speeds up collaboration.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      className="h-8.5 rounded-md px-3 gap-1.5 text-[0.8125rem]"
                      variant="default"
                      onClick={handleConnectInstagram}
                    >
                      <RiInstagramLine />
                      Connect Instagram
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {instagramConnected && (
              <Card className="shadow-none bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-row  items-center gap-4">
                      <Avatar className="rounded-md size-12">
                        <AvatarImage
                          alt="Instagram profile"
                          src={creatorProfile?.profile_pic_url ?? ""}
                        />
                        <AvatarFallback className=" rounded-md">
                          {creatorProfile?.instagram_handle}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <p className="font-bold text-white">
                          {creatorProfile?.name}{" "}
                        </p>
                        <div className="flex gap-2 text-sm text-white/60">
                          <span>{creatorProfile?.instagram_handle}</span>{" "}
                          <span>
                            {creatorProfile?.followers_count?.toLocaleString()}{" "}
                            followers
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      color={instagramConnected ? "default" : "primary"}
                      variant={instagramConnected ? "default" : "default"}
                      onClick={handleConnectInstagram}
                    >
                      {instagramConnected ? "Reconnect" : "Connect Instagram"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-none">
              <CardHeader>
                <h2 className="font-semibold">Basic Information</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-row items-center gap-4">
                  <Avatar className="rounded-md w-24 h-24 ">
                    <AvatarImage
                      alt="Creator profile"
                      src={user?.user_metadata?.avatar_url}
                    />
                    <AvatarFallback className=" rounded-md">
                      user?.user_metadata?.name
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-4 w-full">
                    <Input disabled value={user?.user_metadata?.name || ""} />

                    <Input
                      disabled
                      type="email"
                      value={user?.user_metadata?.email || ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <h2 className="font-semibold">Account Actions</h2>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full md:w-auto gap-2"
                  variant="outline"
                  onClick={handleLogout}
                >
                  <RiLogoutCircleLine size={16} />
                  Log out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
