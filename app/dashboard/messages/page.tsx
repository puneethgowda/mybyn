"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Message } from "iconoir-react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";
import { getAllChatRoomsOptions } from "@/utils/react-query/chat";
import { toTitleCase } from "@/utils/string";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isLoading: loading } = useQuery(getUserOptions(supabase));
  const user = data?.user;

  const { data: chatRooms } = useQuery(
    getAllChatRoomsOptions(supabase, user?.id as string),
  );

  const navigateToChat = (chatId: string) => {
    router.push(`/dashboard/messages/${chatId}`);
  };

  // Filter chats based on search query
  const filteredChatRooms = (chatRooms || []).filter(
    (thread) =>
      thread.collabs.business_profile.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      thread.collabs.title.toLowerCase().includes(searchQuery.toLowerCase()),
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Chat List */}
          <div className="w-full">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
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
                {filteredChatRooms.map((thread) => (
                  <Card
                    key={thread.id}
                    className={`w-full cursor-pointer shadow-none p-0 hover:bg-content2/40 transition-colors border border-divider bg-background/40 ${
                      thread.unread ? "border-l-4 border-l-primary" : ""
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
                                className={`font-medium text-foreground ${thread.unread ? "font-semibold" : ""}`}
                              >
                                {toTitleCase(
                                  thread.collabs.business_profile.name,
                                )}
                              </h4>
                              <p className="text-xs text-foreground/60">
                                {toTitleCase(thread.collabs.title)}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`text-xs ${thread.unread ? "text-primary font-medium" : "text-foreground/60"}`}
                              >
                                {/*{timeAgo(thread.created_at)}*/}
                              </span>
                            </div>
                          </div>
                          <p
                            className={`text-sm mt-1 truncate ${thread.unread ? "text-foreground font-medium" : "text-foreground/70"}`}
                          >
                            {/*{thread.last_message}*/}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="w-full shadow-none">
                <CardContent className="py-12 flex flex-col items-center justify-center">
                  <Message className="size-10" />
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
