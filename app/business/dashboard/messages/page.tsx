"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { Input } from "@heroui/input";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Message, Search } from "iconoir-react";

import { createClient } from "@/supabase/client";
import { getAllChatRoomsOptions } from "@/utils/react-query/business/chat";
import { getUserOptions } from "@/utils/react-query/user";
import { getBusinessProfileOptions } from "@/utils/react-query/business/profile";
import { toTitleCase } from "@/utils/string";

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
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-base lg:text-xl font-bold">Creators Messages</h1>
          <p className="text-default-500 text-xs md:text-sm">
            Communicate with creators about your collaborations
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="w-full">
        <Input
          placeholder="Search messages..."
          startContent={<Search className="text-default-400" />}
          value={searchQuery}
          onValueChange={setSearchQuery}
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
                <CardBody className="py-3">
                  <div className="flex gap-4 items-center">
                    <Skeleton className="rounded-full w-12 h-12" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3 rounded-lg" />
                      <Skeleton className="h-3 w-2/3 rounded-lg" />
                    </div>
                    <Skeleton className="h-3 w-12 rounded-lg" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : filteredChats && filteredChats.length > 0 ? (
          <div className="space-y-2">
            {(filteredChats || []).map((room) => (
              <Card
                key={room.id}
                isPressable
                className={`w-full cursor-pointer hover:bg-content2/40 transition-colors border border-divider bg-background/40 ${
                  room.unread ? "border-l-4 border-l-primary" : ""
                }`}
                onPress={() => navigateToChat(room.id)}
              >
                <CardBody className="py-3 px-4">
                  <div className="flex gap-4 items-center">
                    <Avatar
                      className="bg-primary/10 text-primary"
                      radius="lg"
                      src={room.creator_profile?.profile_pic_url as string}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4
                            className={`font-medium text-foreground ${room.unread ? "font-semibold" : ""}`}
                          >
                            {toTitleCase(room.creator_profile.name)}{" "}
                            <Link
                              href={`https://instagram.com/${room.creator_profile?.instagram_handle}`}
                              target="_blank"
                            >
                              <span className="text-default-500 text-xs">
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
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          // Empty state
          <Card className="w-full border border-divider bg-background/40">
            <CardBody className="py-12 flex flex-col items-center justify-center">
              <Message className="text-default-300" />
              <h3 className="text-xl font-medium mt-4">
                No conversations found
              </h3>
              <p className="text-foreground/60 mt-2 text-center">
                {searchQuery
                  ? "No messages match your search. Try different keywords."
                  : "You haven't started any conversations with influencers yet."}
              </p>
              <Button
                className="mt-4"
                color="primary"
                onPress={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                  } else {
                    router.push("/business/dashboard/collabs");
                  }
                }}
              >
                {searchQuery ? "Clear Search" : "View Your Collabs"}
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
