"use client";

import { RiChat1Line } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCallback, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/supabase/client";
import { getRelativeTime } from "@/utils/date";
import { useInfiniteChatRooms } from "@/utils/react-query/chat";
import { getUserOptions } from "@/utils/react-query/user";
import { toTitleCase } from "@/utils/string";

export default function MessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isLoading: loading } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const {
    data: chatRoomsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingChatRooms,
  } = useInfiniteChatRooms(supabase, user?.id as string);

  const navigateToChat = (chatId: string) => {
    router.push(`/dashboard/messages/${chatId}`);
  };

  // Flatten all chat rooms from all pages
  const allChatRooms =
    chatRoomsData?.pages.flatMap((page: any) => page.data) || [];

  // Filter chats based on search query
  const filteredChatRooms = allChatRooms.filter(
    thread =>
      thread.collabs.business_profile.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      thread.collabs.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const isUnRead = useCallback(
    (unread: boolean, senderId: string) => {
      debugger;

      return unread && senderId !== user?.id;
    },
    [user]
  );

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <div className="space-y-6 max-w-3xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-1 flex-col lg:gap-6 py-4 lg:py-6 md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-base lg:text-xl font-bold">Messages</h1>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Communicate with your collaboration partners
                </p>
              </div>
            </div>

            <Input
              className="w-full md:w-64"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Chat List */}
          <div className="w-full" onScroll={handleScroll}>
            {loading || isLoadingChatRooms ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Card
                    key={i}
                    className="w-full shadow-none p-0 bg-background/40"
                  >
                    <CardContent className="py-3">
                      <div className="flex gap-4 items-center">
                        <Skeleton className="rounded-md w-10 h-10" />
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
            ) : !!filteredChatRooms && filteredChatRooms.length > 0 ? (
              <div className="space-y-2">
                {filteredChatRooms.map(thread => (
                  <Card
                    key={thread.id}
                    className={`w-full cursor-pointer shadow-none p-0 hover:bg-content2/40 transition-colors border border-divider bg-background/40 ${
                      isUnRead(thread.unread, thread.last_message_sender_id)
                        ? "border-l-4 border-l-primary"
                        : ""
                    }`}
                    onClick={() => navigateToChat(thread.id as string)}
                  >
                    <CardContent className="py-3 px-4">
                      <div className="flex gap-4 items-center">
                        <Avatar className="rounded-md h-10 w-10">
                          <AvatarImage
                            alt="business profile"
                            src={thread.collabs.business_profile.logo_url}
                          />
                          <AvatarFallback className=" rounded-md">
                            {thread.collabs.business_profile.name}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4
                                className={`font-medium text-foreground ${
                                  isUnRead(
                                    thread.unread,
                                    thread.last_message_sender_id
                                  )
                                    ? "font-semibold"
                                    : ""
                                }`}
                              >
                                {toTitleCase(
                                  thread.collabs.business_profile.name
                                )}
                              </h4>
                              <p className="text-xs text-foreground/60">
                                {toTitleCase(thread.collabs.title)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {isUnRead(
                                thread.unread,
                                thread.last_message_sender_id
                              ) && (
                                <Badge
                                  className="text-xs px-1 py-0"
                                  variant="default"
                                >
                                  New
                                </Badge>
                              )}
                              <span
                                className={`text-xs ${
                                  isUnRead(
                                    thread.unread,
                                    thread.last_message_sender_id
                                  )
                                    ? "text-primary font-medium"
                                    : "text-foreground/60"
                                }`}
                              >
                                {thread.last_message_at
                                  ? getRelativeTime(thread.last_message_at)
                                  : ""}
                              </span>
                            </div>
                          </div>
                          <p
                            className={`text-sm mt-1 truncate ${
                              isUnRead(
                                thread.unread,
                                thread.last_message_sender_id
                              )
                                ? "text-foreground font-medium"
                                : "text-foreground/70"
                            }`}
                          >
                            {thread.last_message || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Load more indicator */}
                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <Skeleton className="h-4 w-32 rounded-lg" />
                  </div>
                )}
              </div>
            ) : (
              <Card className="w-full shadow-none">
                <CardContent className="py-12 flex flex-col items-center justify-center">
                  <RiChat1Line className="size-10" />
                  <h3 className="text-lg md:text-xl font-medium mt-4">
                    No conversations found
                  </h3>
                  <p className="text-sm md:text-base text-foreground/60 mt-2 text-center">
                    {searchQuery
                      ? "No messages match your search. Try different keywords."
                      : "You have no active collabs yet. Apply to opportunities to start chatting!"}
                  </p>
                  <Button
                    className="mt-4"
                    variant="default"
                    onClick={() => {
                      if (searchQuery) {
                        setSearchQuery("");
                      } else {
                        router.push("/dashboard/discover");
                      }
                    }}
                  >
                    {searchQuery ? "Clear Search" : "Discover Opportunities"}
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
