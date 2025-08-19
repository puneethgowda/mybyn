import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/magicui/marquee";
import { WobbleCard } from "@/components/magicui/wobble-card";
import LayoutSkeleton from "@/components/layout-skeleton";

const TEXTS = ["VERIFIED", "COLLABORATE", "GROWTH", "TRUSTED"];
const campaignSteps = [
  {
    title: "POST A CAMPAIGN",
    description: "Share your goals, budget, and requirements.",
  },
  {
    title: "GET CREATOR APPLICATIONS",
    description: "Choose the perfect fit for your brand.",
  },
  {
    title: "COLLABORATE & LAUNCH",
    description: "Chat, align, and go live—seamlessly.",
  },
];

export default function ForBusinessPage() {
  return (
    <LayoutSkeleton>
      <section className="flex flex-col  items-center gap-20 sm:gap-20 xl:gap-40 py-8 md:py-10">
        {/* Hero Section */}
        <section className="px-6 mx-auto max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-base font-semibold tracking-wider text-primary uppercase">
                Built for Businesses
              </p>
              <h1 className="mt-2 text-3xl font-medium font-mosans lg:mt-4 sm:text-5xl xl:text-8xl">
                Grow Your Business with Influencer Marketing
              </h1>
              <p className="mt-2 text-base  lg:mt-4 sm:text-xl">
                Partner with the right creators to grow smarter and faster
              </p>
              {/*<p className="mt-4 text-base  lg:mt-8 sm:text-xl">*/}
              {/*  Discover the right partners. Create bigger impact. Together.*/}
              {/*</p>*/}

              <Link href="/login">
                <Button className="mt-8" color="primary" size="lg">
                  Post a collab
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
                Are you a business?{" "}
                <Link
                  className="transition-all duration-200 hover:underline"
                  href="/login"
                  title=""
                >
                  Join Kollabit
                </Link>
              </p>
            </div>
            <div>
              <Image
                alt=""
                className="w-full"
                height={600}
                src="/assets/brand-hero.png"
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
                <div className="w-6 h-6">
                  <svg
                    className="e-font-icon-svg e-fab-diaspora"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M251.64 354.55c-1.4 0-88 119.9-88.7 119.9S76.34 414 76 413.25s86.6-125.7 86.6-127.4c0-2.2-129.6-44-137.6-47.1-1.3-.5 31.4-101.8 31.7-102.1.6-.7 144.4 47 145.5 47 .4 0 .9-.6 1-1.3.4-2 1-148.6 1.7-149.6.8-1.2 104.5-.7 105.1-.3 1.5 1 3.5 156.1 6.1 156.1 1.4 0 138.7-47 139.3-46.3.8.9 31.9 102.2 31.5 102.6-.9.9-140.2 47.1-140.6 48.8-.3 1.4 82.8 122.1 82.5 122.9s-85.5 63.5-86.3 63.5c-1-.2-89-125.5-90.9-125.5z" />
                  </svg>
                </div>
                <div className="font-medium font-mosans text-xl sm:text-3xl xl:text-6xl">
                  {text}
                </div>
              </div>
            ))}
          </Marquee>
        </section>

        {/*How it works*/}
        <section className="w-full px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Section */}
            <div className="space-y-8">
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden">
                <Image
                  alt="how it works"
                  className="w-full h-64 object-cover"
                  height={500}
                  src="/assets/brand-how-it-works.png"
                  width={500}
                />
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-mosans font-medium leading-tight">
                  How it works
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed">
                  Launch your campaign in three simple steps—quick, easy,
                  effective
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-8">
              {campaignSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between group"
                >
                  <div className="flex space-x-6">
                    <span className="text-2xl sm:text-6xl xl:text-6xl font-light text-muted-foreground w-6 sm:w-20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-2xl sm:text-6xl xl:text-6xl font-mosans font-medium group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {/*<Button className="w-12 h-12 bg-purple-200 hover:bg-purple-300 flex items-center justify-center transition-colors group-hover:scale-110 transform duration-200">*/}
                  {/*  <ArrowUpRight className="w-5 h-5 text-purple-700" />*/}
                  {/*</Button>*/}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full px-6">
          <WobbleCard
            className=""
            containerClassName="col-span-1 lg:col-span-2 h-full bg-[#f6f6f4] min-h-[500px] lg:min-h-[300px]"
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance font-mosans font-medium text-lg md:text-3xl lg:text-5xl tracking-[-0.015em] ">
                Effortless Campaign Setup
              </h2>
              <p className="mt-4 text-left  text-lg text-muted-foreground">
                Post your campaign brief in minutes and start receiving creator
                applications instantly.
              </p>
            </div>
            <Image
              alt="linear demo image"
              className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
              height={500}
              src="/assets/brand.png"
              width={500}
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-[#f6f6f4]">
            <h2 className="max-w-80  text-left text-balance  font-mosans font-medium text-lg md:text-3xl lg:text-5xl tracking-[-0.015em] ">
              Access to Verified Creators
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-lg text-muted-foreground">
              Connect with a growing network of quality creators who are ready
              to bring your brand to life.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-[#f6f6f4] min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance  font-mosans font-medium text-lg md:text-3xl lg:text-5xl tracking-[-0.015em] ">
                Streamlined Collaboration
              </h2>
              <p className="mt-4 max-w-[26rem] text-left   text-lg text-muted-foreground">
                One chat. Total clarity. Faster results.
              </p>
            </div>
            <Image
              alt="linear demo image"
              className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
              height={500}
              src="/assets/brand.png"
              width={500}
            />
          </WobbleCard>
        </section>

        {/* CTA */}
        <section className=" bg-yellow-300 w-full rounded-4xl">
          <div className="flex items-center justify-center flex-col py-20">
            <h1 className="font-mosans font-medium  text-2xl sm:text-2xl xl:text-5xl text-center">
              Find your perfect creator match
            </h1>
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
          </div>
        </section>
      </section>
    </LayoutSkeleton>
  );
}
