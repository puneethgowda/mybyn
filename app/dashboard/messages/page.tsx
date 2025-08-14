"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { Input } from "@heroui/input";
import { useQuery } from "@tanstack/react-query";
import { Message, Search } from "iconoir-react";

import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";
import { getAllChatRoomsOptions } from "@/utils/react-query/chat";
import { toTitleCase } from "@/utils/string";

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
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-base lg:text-xl font-bold">Messages</h1>
          <p className="text-default-500 text-xs md:text-sm">
            Communicate with your collaboration partners
          </p>
        </div>

        <Input
          className="w-full md:w-64"
          placeholder="Search messages..."
          radius="lg"
          size="sm"
          startContent={<Search className="size-5 text-default-600 " />}
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
      </div>

      {/* Chat List */}
      <div className="w-full">
        {loading ? (
          // Skeleton loaders
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full  bg-background/40">
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
        ) : !!filteredChatRooms && filteredChatRooms.length > 0 ? (
          <div className="space-y-2">
            {filteredChatRooms.map((thread) => (
              <Card
                key={thread.id}
                isPressable
                className={`w-full cursor-pointer hover:bg-content2/40 transition-colors border border-divider bg-background/40 ${
                  thread.unread ? "border-l-4 border-l-primary" : ""
                }`}
                onPress={() => navigateToChat(thread.id as string)}
              >
                <CardBody className="py-3 px-4">
                  <div className="flex gap-4 items-center">
                    <Avatar
                      className="bg-primary/10 text-primary"
                      radius="lg"
                      src={thread.collabs.business_profile.logo_url}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4
                            className={`font-medium text-foreground ${thread.unread ? "font-semibold" : ""}`}
                          >
                            {toTitleCase(thread.collabs.business_profile.name)}
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
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          // Empty state
          <Card className="w-full shadow-none">
            <CardBody className="py-12 flex flex-col items-center justify-center">
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
                color="primary"
                onPress={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                  } else {
                    router.push("/dashboard/discover");
                  }
                }}
              >
                {searchQuery ? "Clear Search" : "Discover Opportunities"}
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
