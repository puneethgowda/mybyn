"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { useDisclosure } from "@heroui/modal";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { Skeleton } from "@heroui/skeleton";
import { Divider } from "@heroui/divider";
import { Filter, Search } from "iconoir-react";

import { CollabDetailsDrawer } from "@/components/dashboard/collab-details-drawer";
import { CollabWithBusinessProfile } from "@/types/collab";
import CollabCard from "@/components/dashboard/collab-card";
import { createClient } from "@/supabase/client";
import { getCollabsOptions } from "@/utils/react-query/collabs";
import { Constants, Database } from "@/supabase/database.types";
import { COLLAB_TYPE } from "@/utils/enums";
import { useBreakpoint } from "@/hooks/use-breakpoint";

export default function DiscoverPage() {
  const supabase = createClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 10000]);
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
  const businessTypeOptions = Constants.public.Enums.business_type;

  const collabTypeOptions: {
    key: Database["public"]["Enums"]["collab_type"] | "All";
    label: string;
  }[] = Object.entries(COLLAB_TYPE).map(([key, value]) => ({
    key: key as Database["public"]["Enums"]["collab_type"] | "All",
    label: value,
  }));
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
    }),
  );

  // Reset filters
  const resetFilters = () => {
    setLocation("All");
    setBusinessTypes([]);
    setAmountRange([0, 10000]);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-base lg:text-xl font-bold">
            Discover Collaborations
          </h1>
          <p className="text-default-500 text-xs md:text-sm">
            Find the perfect opportunities to grow your influence
          </p>
        </div>
        <div className="flex gap-2">
          <Button startContent={<Filter />} variant="bordered" onPress={onOpen}>
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Drawer */}
      <Drawer
        isOpen={isOpen}
        placement={isSm ? "bottom" : "right"}
        size={isSm ? "xl" : "sm"}
        onClose={onClose}
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerBody>
                <div className="px-2 py-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Filters</h3>
                    <Button size="sm" variant="light" onPress={resetFilters}>
                      Reset All
                    </Button>
                  </div>

                  <Divider />

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Location</h4>
                    <Select
                      placeholder="Select location"
                      selectedKeys={new Set([location])}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;

                        if (selected) setLocation(selected);
                      }}
                    >
                      {locationOptions.map((loc) => (
                        <SelectItem key={loc}>{loc}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Business Type Filter */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Business Type</h4>
                    <div className="flex flex-wrap gap-2">
                      {businessTypeOptions.map((type) => (
                        <Chip
                          key={type}
                          className="cursor-pointer"
                          color={
                            businessTypes.includes(type) ? "primary" : "default"
                          }
                          variant={
                            businessTypes.includes(type) ? "solid" : "flat"
                          }
                          onClick={() => {
                            if (businessTypes.includes(type)) {
                              setBusinessTypes(
                                businessTypes.filter((t) => t !== type),
                              );
                            } else {
                              setBusinessTypes([...businessTypes, type]);
                            }
                          }}
                        >
                          {type}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Amount Offered Filter */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Amount Offered</h4>
                    <Slider
                      className="max-w-md"
                      formatOptions={{ style: "currency", currency: "INR" }}
                      label="Range"
                      maxValue={10000}
                      minValue={0}
                      showSteps={true}
                      showTooltip={true}
                      step={500}
                      value={amountRange}
                      onChange={(value) =>
                        setAmountRange(value as [number, number])
                      }
                    />
                  </div>

                  {/* Collab Type Filter */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Collaboration Type</h4>
                    <div className="flex flex-wrap gap-2">
                      {collabTypeOptions.map(({ label, key }) => (
                        <Chip
                          key={key}
                          className="cursor-pointer"
                          color={collabType === key ? "primary" : "default"}
                          variant={collabType === key ? "solid" : "flat"}
                          onClick={() => setCollabType(key)}
                        >
                          {label}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Language Preference Filter */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Language Preference</h4>
                    <div className="flex flex-wrap gap-2">
                      {languageOptions.map((lang) => (
                        <Chip
                          key={lang}
                          className="cursor-pointer"
                          color={
                            languages.includes(lang) ? "primary" : "default"
                          }
                          variant={languages.includes(lang) ? "solid" : "flat"}
                          onClick={() => {
                            if (languages.includes(lang)) {
                              setLanguages(languages.filter((l) => l !== lang));
                            } else {
                              setLanguages([...languages, lang]);
                            }
                          }}
                        >
                          {lang}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Collaboration Cards Grid */}
      {isCollabsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="w-full">
                <CardBody className="gap-3 p-0">
                  <Skeleton className="rounded-lg w-full h-48" />
                </CardBody>
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
          <Search className="size-12 md:size-16" />
          <h3 className="text-base md:text-xl font-medium mt-4">
            No collaborations found
          </h3>
          <p className="text-sm md:text-base text-default-500 mt-2">
            Try adjusting your filters or search query
          </p>
          <Button
            className="mt-4"
            color="primary"
            variant="flat"
            onPress={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {!isCollabsLoading && collabs.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            initialPage={1}
            page={page}
            total={totalPages}
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
  );
}
