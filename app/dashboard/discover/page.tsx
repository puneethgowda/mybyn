"use client";

import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  RiQuillPenAiLine,
  RiResetLeftLine,
  RiSearchLine,
} from "@remixicon/react";
import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CollabDetailsDrawer } from "@/components/dashboard/collab-details-drawer";
import { CollabWithBusinessProfile } from "@/types/collab";
import CollabCard from "@/components/dashboard/collab-card";
import { createClient } from "@/supabase/client";
import { getCollabsOptions } from "@/utils/react-query/collabs";
import { Constants, Database } from "@/supabase/database.types";
import { COLLAB_TYPE } from "@/utils/enums";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import AppPagination from "@/components/app-pagination";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FilterPanel,
  FilterPanelTrigger,
} from "@/components/dashboard/filter-panel";
import { Label } from "@/components/ui/label";
import PriceSlider from "@/components/price-slider";

export default function DiscoverPage() {
  const supabase = createClient();
  const {
    isOpen: isCollabDetailsOpen,
    onOpen: onCollabDetailsOpen,
    onClose: onCollabDetailsClose,
  } = useDisclosure();
  const [collabDetails, setCollabDetails] =
    useState<CollabWithBusinessProfile | null>(null);
  const [page, setPage] = useState<number>(1);

  // Filter states
  const [location, setLocation] = useState<string>("All");
  const [businessTypes, setBusinessTypes] = useState<
    Database["public"]["Enums"]["business_type"][]
  >([]);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 200000]);
  const [formats, setFormats] = useState<string[]>([]);
  const [collabType, setCollabType] = useState<
    Database["public"]["Enums"]["collab_type"] | "All"
  >("All");
  const [languages, setLanguages] = useState<
    Database["public"]["Enums"]["languages"][]
  >([]);

  const locationOptions: string[] = [
    "All",
    ...Constants.public.Enums.languages,
  ];

  const businessTypeOptions: string[] = [
    "All",
    ...Constants.public.Enums.business_type,
  ];

  const collabTypeOptions: {
    key: Database["public"]["Enums"]["collab_type"] | "All";
    label: string;
  }[] = [
    { key: "All", label: "All" },
    ...Object.entries(COLLAB_TYPE).map(([key, value]) => ({
      key: key as Database["public"]["Enums"]["collab_type"] | "All",
      label: value,
    })),
  ];
  const languageOptions = Constants.public.Enums.languages;

  // React Query hooks
  const { data: collabsData, isLoading: isCollabsLoading } = useQuery(
    getCollabsOptions(supabase, {
      location,
      businessTypes,
      amountRange,
      formats,
      collabType,
      languages,
      page,
    })
  );

  // Reset filters
  const resetFilters = () => {
    setLocation("All");
    setBusinessTypes([]);
    setAmountRange([0, 200000]);
    setFormats([]);
    setCollabType("All");
    setLanguages([]);
  };

  const handleCollabClick = (collab: CollabWithBusinessProfile) => {
    onCollabDetailsOpen();
    setCollabDetails(collab);
  };

  const collabs = collabsData?.collabs || [];
  const totalPages = Math.ceil((collabsData?.count || 0) / 9);
  const { isSm } = useBreakpoint();

  const id = useId();

  return (
    <>
      <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
        <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-1 flex-col lg:gap-6 py-4 lg:py-6 md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-base lg:text-xl font-bold">
                  Discover Collaborations
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Find the perfect opportunities to grow your influence
                </p>
              </div>
              <div className="flex gap-2">
                <FilterPanelTrigger />
              </div>
            </div>

            {/* Collaboration Cards Grid */}
            {true ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="w-full p-0 shadow-none">
                      <CardContent className="gap-3 p-0">
                        <Skeleton className="rounded-lg w-full h-48" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : collabs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collabs.map((collab) => (
                  <CollabCard
                    key={collab.id}
                    collab={collab}
                    handleClick={() => handleCollabClick(collab)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <RiSearchLine className="size-12 md:size-16" />
                <h3 className="text-base md:text-xl font-medium mt-4">
                  No collaborations found
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                  Try adjusting your filters or search query
                </p>
                <Button className="mt-4" color="primary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!isCollabsLoading && collabs.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <AppPagination
                  currentPage={1}
                  totalPages={100}
                  onChange={setPage}
                />
              </div>
            )}

            <CollabDetailsDrawer
              collabDetails={collabDetails}
              isOpen={isCollabDetailsOpen}
              onClose={onCollabDetailsClose}
            />
          </div>
        </div>
      </ScrollArea>
      <FilterPanel>
        <>
          {/* Sidebar header */}
          <div className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RiQuillPenAiLine
                aria-hidden="true"
                className="text-muted-foreground/70"
                size={20}
              />
              <h2 className="text-sm font-medium">My preferences</h2>
            </div>
            <Button size="sm" onClick={resetFilters}>
              <RiResetLeftLine />
            </Button>
          </div>

          {/* Sidebar content */}
          <div className="-mt-px">
            {/* Content group */}
            <div className="py-5 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
              <h3 className="text-xs font-medium uppercase text-muted-foreground/80 mb-4">
                Chat presets
              </h3>
              <div className="space-y-3">
                {/* Locations */}
                <div className="flex items-center justify-between gap-2">
                  <Label className="font-normal" htmlFor={`${id}-location`}>
                    Locations
                  </Label>

                  <Select
                    value={location}
                    onValueChange={(value) => setLocation(value)}
                  >
                    <SelectTrigger
                      className="bg-background w-auto max-w-full h-7 py-1 px-2 gap-1 [&_svg]:-me-1 border-none"
                      id={`${id}-location`}
                    >
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent
                      align="end"
                      className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
                    >
                      {locationOptions.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Business Type */}
                <div className="flex items-center justify-between gap-2">
                  <Label
                    className="font-normal"
                    htmlFor={`${id}-business-type`}
                  >
                    Business Type
                  </Label>

                  <Select
                    value={businessTypes[0] ?? "All"}
                    onValueChange={(value) =>
                      setBusinessTypes(
                        value === "All"
                          ? []
                          : [
                              value as Database["public"]["Enums"]["business_type"],
                            ]
                      )
                    }
                  >
                    <SelectTrigger
                      className="bg-background w-auto max-w-full h-7 py-1 px-2 gap-1 border-none"
                      id={`${id}-business-type`}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {businessTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Collab Type */}
                <div className="flex items-center justify-between gap-2">
                  <Label className="font-normal" htmlFor={`${id}-collab-type`}>
                    Collab Type
                  </Label>

                  <Select
                    value={collabType}
                    onValueChange={(value) =>
                      setCollabType(
                        value as
                          | Database["public"]["Enums"]["collab_type"]
                          | "All"
                      )
                    }
                  >
                    <SelectTrigger
                      className="bg-background w-auto max-w-full h-7 py-1 px-2 gap-1 border-none"
                      id={`${id}-collab-type`}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {collabTypeOptions.map((type) => (
                        <SelectItem key={type.key} value={type.key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Content group */}
            <div className="py-5 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
              <h3 className="text-xs font-medium uppercase text-muted-foreground/80 mb-4">
                Configurations
              </h3>
              <div className="space-y-3">
                <PriceSlider
                  maxValue={amountRange[1]}
                  minValue={amountRange[0]}
                  step={500}
                  onChange={(value) =>
                    setAmountRange(value as [number, number])
                  }
                />

                {/*<Slider*/}
                {/*  className="max-w-md"*/}
                {/*  formatOptions={{ style: "currency", currency: "INR" }}*/}
                {/*  label="Range"*/}
                {/*  maxValue={10000}*/}
                {/*  minValue={0}*/}
                {/*  showSteps={true}*/}
                {/*  showTooltip={true}*/}
                {/*  step={500}*/}
                {/*  value={amountRange}*/}
                {/*  onChange={(value) =>*/}
                {/*    setAmountRange(value as [number, number])*/}
                {/*  }*/}
                {/*/>*/}
              </div>
            </div>
          </div>
        </>
      </FilterPanel>
    </>
  );
}
