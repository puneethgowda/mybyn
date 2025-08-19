"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Chip } from "@heroui/chip";

import { title, subtitle } from "@/components/primitives";

// Mock data for demonstration
const MOCK_LISTINGS = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    title: `${
      ["Fashion", "Tech", "Beauty", "Fitness", "Food"][i % 5]
    } Campaign Opportunity`,
    description:
      "Looking for creative influencers to showcase our products to their audience in an authentic way.",
    company: `${
      ["StyleBrand", "TechGrowth", "GlowBeauty", "FitLife", "TastyEats"][i % 5]
    } Inc.`,
    budget: `$${(i + 1) * 500}`,
    category: ["Fashion", "Tech", "Beauty", "Fitness", "Food"][i % 5],
    type: ["Post", "Story", "Reel", "Video", "Collaboration"][i % 5],
  }));

const categories = ["All", "Fashion", "Tech", "Beauty", "Fitness", "Food"];
const types = ["All", "Post", "Story", "Reel", "Video", "Collaboration"];

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Filter listings based on search and filters
  const filteredListings = MOCK_LISTINGS.filter((listing) => {
    const matchesSearch =
      search === "" ||
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.description.toLowerCase().includes(search.toLowerCase()) ||
      listing.company.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || listing.category === category;
    const matchesType = type === "All" || listing.type === type;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Paginate results
  const paginatedListings = filteredListings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <section className="flex flex-col gap-8 py-8">
      <div className="text-center">
        <h1 className={title()}>Discover Opportunities</h1>
        <p className={subtitle({ class: "mt-2" })}>
          Find the perfect collaboration for your brand or profile
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Input
          className="flex-1"
          placeholder="Search opportunities..."
          startContent={
            <svg
              className="w-5 h-5 text-default-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-4">
          <Select
            className="w-40"
            placeholder="Category"
            selectedKeys={[category]}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <SelectItem key={cat}>{cat}</SelectItem>
            ))}
          </Select>
          <Select
            className="w-40"
            placeholder="Type"
            selectedKeys={[type]}
            onChange={(e) => setType(e.target.value)}
          >
            {types.map((t) => (
              <SelectItem key={t}>{t}</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {paginatedListings.map((listing) => (
          <Card key={listing.id} className="h-full">
            <CardBody className="gap-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{listing.title}</h3>
                <Chip color="primary" size="sm" variant="flat">
                  {listing.budget}
                </Chip>
              </div>
              <p className="text-muted-foreground">{listing.description}</p>
              <div className="flex gap-2 mt-2">
                <Chip size="sm" variant="flat">
                  {listing.category}
                </Chip>
                <Chip size="sm" variant="flat">
                  {listing.type}
                </Chip>
              </div>
              <p className="text-sm font-medium mt-2">{listing.company}</p>
            </CardBody>
            <CardFooter>
              <Button className="w-full" color="primary">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No results */}
      {paginatedListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl">
            No opportunities found matching your criteria
          </p>
          <Button
            className="mt-4"
            color="primary"
            variant="light"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setType("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {filteredListings.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            initialPage={1}
            page={page}
            total={Math.ceil(filteredListings.length / itemsPerPage)}
            onChange={setPage}
          />
        </div>
      )}
    </section>
  );
}
