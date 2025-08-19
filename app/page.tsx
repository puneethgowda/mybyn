import Link from "next/link";
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/magicui/marquee";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import LayoutSkeleton from "@/components/layout-skeleton";

const TEXTS = ["CREATORS", "BUSINESSES", "INFLUENCE"];
const features = [
  {
    Icon: FileTextIcon,
    name: "Post a collab in minutes",
    description: "Set requirements, budget, or barter offers.",
    href: "/",
    cta: "Learn more",
    background: (
      <img alt="" className="absolute -right-20 -top-20 opacity-60" />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Built-in chat",
    description: "Connect instantly after acceptance.",

    href: "/",
    cta: "Learn more",
    background: (
      <img alt="" className="absolute -right-20 -top-20 opacity-60" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "No long waits",
    description: "Apply for collab and get accepted quickly",
    href: "/",
    cta: "Learn more",
    background: (
      <img alt="" className="absolute -right-20 -top-20 opacity-60" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Collab discovery you’ll love",
    description: "Find opportunities that fit your style.",
    href: "/",
    cta: "Learn more",
    background: (
      <img alt="" className="absolute -right-20 -top-20 opacity-60" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Instant notifications",
    description: "Never miss a new campaign.",
    href: "/",
    cta: "Learn more",
    background: (
      <img alt="" className="absolute -right-20 -top-20 opacity-60" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export default async function Home() {
  // const supabase = await createClient();
  // const { data, error } = await supabase.auth.getUser();
  //
  // if (data && !error) {
  //   redirect("/dashboard");
  // }

  return (
    <LayoutSkeleton>
      <section className="flex flex-col  items-center gap-20 sm:gap-20 xl:gap-40 py-8 md:py-10">
        {/* Hero Section */}
        <section className="px-6 mx-auto max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-base font-semibold tracking-wider text-primary uppercase">
                Built for collabs
              </p>
              <h1 className="mt-2 text-3xl font-medium font-mosans lg:mt-4 sm:text-5xl xl:text-8xl">
                Where Creators &amp; Businesses Connect
              </h1>
              <p className="mt-2 text-base  lg:mt-4 sm:text-xl">
                Grow your brand. Grow your influence. Grow together
              </p>
              {/*<p className="mt-4 text-base  lg:mt-8 sm:text-xl">*/}
              {/*  Discover the right partners. Create bigger impact. Together.*/}
              {/*</p>*/}

              <Link href="/login">
                <Button className="mt-8" color="primary" size="lg">
                  Join for free
                  <svg
                    className="w-6 h-6 ml-8 -mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </Button>
              </Link>

              <p className="mt-5 text-muted-foreground">
                Already joined us?{" "}
                <Link
                  className="transition-all duration-200 hover:underline"
                  href="/login"
                  title=""
                >
                  Log in
                </Link>
              </p>
            </div>
            <div>
              <Image
                alt=""
                className="w-full"
                height={600}
                src="/assets/main-hero.png"
                width={600}
              />
            </div>
          </div>
        </section>
        {/* Marquee Section */}
        <section className="max-w-full">
          <Marquee
            pauseOnHover
            className="[--duration:20s] [--gap:2rem] sm:[--gap:4rem] [gap:var(--gap)]"
          >
            {TEXTS.map((text, index) => (
              <div
                key={index}
                className="flex items-center gap-[2rem] sm:gap-[4rem] text-default-300"
              >
                <div className="w-6 h-6 text-muted-foreground/50">
                  <svg
                    className="e-font-icon-svg e-fab-diaspora"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M251.64 354.55c-1.4 0-88 119.9-88.7 119.9S76.34 414 76 413.25s86.6-125.7 86.6-127.4c0-2.2-129.6-44-137.6-47.1-1.3-.5 31.4-101.8 31.7-102.1.6-.7 144.4 47 145.5 47 .4 0 .9-.6 1-1.3.4-2 1-148.6 1.7-149.6.8-1.2 104.5-.7 105.1-.3 1.5 1 3.5 156.1 6.1 156.1 1.4 0 138.7-47 139.3-46.3.8.9 31.9 102.2 31.5 102.6-.9.9-140.2 47.1-140.6 48.8-.3 1.4 82.8 122.1 82.5 122.9s-85.5 63.5-86.3 63.5c-1-.2-89-125.5-90.9-125.5z" />
                  </svg>
                </div>
                <div className="font-medium font-mosans text-muted-foreground/50 text-xl sm:text-3xl xl:text-6xl">
                  {text}
                </div>
              </div>
            ))}
          </Marquee>
        </section>

        {/* For Business */}
        <section className="px-6 mt-10 sm:mt-14 xl:mt-20 w-full mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-14">
          <div className="">
            <div className="relative bg-yellow-50 rounded-2xl h-80">
              <Image
                alt="brand"
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                height={350}
                src="/assets/brand.png"
                width={350}
              />
            </div>
          </div>
          <div className="">
            <h1 className="font-mosans font-medium text-2xl sm:text-2xl xl:text-5xl">
              For Businesses
            </h1>

            <p className="text-2xl sm:text-2xl xl:text-5xl mt-4  text-muted-foreground">
              Find the right creators, manage both paid and barter
              collaborations
            </p>
            <Button
              as={Link}
              className="mt-8"
              color="secondary"
              href="/business"
              size="lg"
            >
              Learn More
              <svg
                className="w-6 h-6 ml-8 -mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </Button>
          </div>
        </section>

        {/* For Creators */}
        <section className="px-6 mt-10 sm:mt-14 xl:mt-20 w-full mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-14">
          <div className="">
            <h1 className="font-mosans font-medium text-2xl sm:text-2xl xl:text-5xl">
              For Creators
            </h1>
            <p className="text-2xl sm:text-2xl xl:text-5xl mt-4 text-muted-foreground">
              Discover collabs from brands looking for creators. Apply today,
              collaborate today.
            </p>
            <Button
              as={Link}
              className="mt-8"
              color="secondary"
              href="/business"
              size="lg"
            >
              Learn More
              <svg
                className="w-6 h-6 ml-8 -mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </Button>
          </div>
          <div className="">
            <div className="relative bg-pink-200 rounded-2xl h-80">
              <Image
                alt="brand"
                className="absolute bottom-0"
                height={500}
                src="/assets/creator.png"
                width={500}
              />
            </div>
          </div>
        </section>

        {/* Explaination */}
        <section className="w-full mx-auto max-w-7xl">
          <h1 className="font-mosans font-medium text-2xl sm:text-2xl xl:text-5xl text-center mb-10 sm:mb-20">
            Collabs made simple for creators and businesses
          </h1>
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </section>

        {/* CTA */}
        <section className=" bg-yellow-300 w-full rounded-4xl">
          <div className="flex items-center justify-center flex-col py-20">
            <h1 className="font-mosans font-medium  text-2xl sm:text-2xl xl:text-5xl text-center">
              Meet the right partner
            </h1>
            <Button
              as={Link}
              className="mt-8"
              color="primary"
              href="/login"
              size="lg"
            >
              Join for free
              <svg
                className="w-6 h-6 ml-8 -mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </Button>{" "}
          </div>
        </section>
      </section>
    </LayoutSkeleton>
  );
}
