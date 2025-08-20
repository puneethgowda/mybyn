"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import * as React from "react";
import { RiChat1Line } from "@remixicon/react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { createClient } from "@/supabase/client";
import { getAllChatRoomsOptions } from "@/utils/react-query/business/chat";
import { getUserOptions } from "@/utils/react-query/user";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { toTitleCase } from "@/utils/string";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BusinessMessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: businessProfile } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );

  const businessId = useMemo(() => businessProfile?.id, [businessProfile]);

  const { data: chatRooms, isPending } = useQuery(
    getAllChatRoomsOptions(supabase, businessId as string),
  );

  const navigateToChat = (chatId: string) => {
    router.push(`/business/dashboard/messages/${chatId}`);
  };

  // Filter chats based on search query
  const filteredChats = (chatRooms || []).filter(
    (thread) =>
      thread.creator_profile.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      thread.collabs.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <div className="space-y-6 max-w-3xl">
          {/* Header */}
          <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-base lg:text-xl font-bold">Messages</h1>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Communicate with creators about your collaborations
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="w-full">
            <Input
              className="w-full"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Chat List */}
          <div className="w-full">
            {isPending ? (
              // Skeleton loaders
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="w-full border border-divider bg-background/40"
                  >
                    <CardContent className="py-3">
                      <div className="flex gap-4 items-center">
                        <Skeleton className="rounded-full w-12 h-12" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/3 rounded-lg" />
                          <Skeleton className="h-3 w-2/3 rounded-lg" />
                        </div>
                        <Skeleton className="h-3 w-12 rounded-lg" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredChats && filteredChats.length > 0 ? (
              <div className="space-y-2">
                {(filteredChats || []).map((room) => (
                  <Card
                    key={room.id}
                    className={`w-full cursor-pointer shadow-none  ${
                      room.unread ? "border-l-4 border-l-primary" : ""
                    }`}
                    onClick={() => navigateToChat(room.id)}
                  >
                    <CardContent className="">
                      <div className="flex gap-4 items-center">
                        <Avatar className="rounded-md h-10 w-10">
                          <AvatarImage
                            alt="business profile"
                            src={
                              room.creator_profile?.profile_pic_url as string
                            }
                          />
                          <AvatarFallback className="rounded-md">
                            {room.creator_profile.name}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4
                                className={`font-medium text-foreground ${
                                  room.unread ? "font-semibold" : ""
                                }`}
                              >
                                {toTitleCase(room.creator_profile.name)}{" "}
                                <Link
                                  href={`https://instagram.com/${room.creator_profile?.instagram_handle}`}
                                  target="_blank"
                                >
                                  <span className="text-muted-foreground text-xs">
                                    ({room.creator_profile?.instagram_handle})
                                  </span>
                                </Link>
                              </h4>

                              <p className="text-xs text-foreground/60">
                                {toTitleCase(room.collabs.title)}
                              </p>
                            </div>
                            {/*Last message at*/}
                            {/*<div className="flex items-center">*/}
                            {/*  <span*/}
                            {/*    className={`text-xs ${room.unread ? "text-primary font-medium" : "text-foreground/60"}`}*/}
                            {/*  >*/}
                            {/*    {timeAgo(room.created_at)}*/}
                            {/*  </span>*/}
                            {/*</div>*/}
                          </div>
                          {/*Last message*/}
                          {/*<p*/}
                          {/*  className={`text-sm mt-1 truncate ${room.unread ? "text-foreground font-medium" : "text-foreground/70"}`}*/}
                          {/*>*/}
                          {/*  {room.created_at}*/}
                          {/*</p>*/}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Empty state
              <Card className="w-full shadow-none">
                <CardContent className="py-12 flex flex-col items-center justify-center">
                  <RiChat1Line className="text-default-300" />
                  <h3 className="font-medium mt-2">No conversations found</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery
                      ? "No messages match your search. Try different keywords."
                      : "You haven't started any conversations with influencers yet."}
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    variant="default"
                    onClick={() => {
                      if (searchQuery) {
                        setSearchQuery("");
                      } else {
                        router.push("/business/dashboard/collabs");
                      }
                    }}
                  >
                    {searchQuery ? "Clear Search" : "View Your Collabs"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
