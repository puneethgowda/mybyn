import { Link } from "@heroui/link";
import { Card, CardBody } from "@heroui/card";
import { button as buttonStyles } from "@heroui/theme";
import { Button } from "@heroui/button";

import { title, subtitle } from "@/components/primitives";

export default async function Home() {
  // const supabase = await createClient();
  // const { data, error } = await supabase.auth.getUser();
  //
  // if (data && !error) {
  //   redirect("/dashboard");
  // }

  return (
    <section className="">
      <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <p className="text-base font-semibold tracking-wider text-primary uppercase">
            Built for collabs
          </p>
          <h1 className="mt-4 text-3xl font-bold  lg:mt-8 sm:text-5xl xl:text-8xl">
            Where creators &amp; brands connect
          </h1>
          <p className="mt-4 text-base  lg:mt-8 sm:text-xl">
            Grow your brand. Grow your influence. Grow together
          </p>
          {/*<p className="mt-4 text-base  lg:mt-8 sm:text-xl">*/}
          {/*  Discover the right partners. Create bigger impact. Together.*/}
          {/*</p>*/}

          <Button as={Link} className="mt-8" color="primary" href="/login">
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
          <p className="mt-5 text-default-500">
            Already joined us?{" "}
            <Link
              className="transition-all duration-200 hover:underline"
              href="/"
              title=""
            >
              Log in
            </Link>
          </p>
        </div>
        <div>
          <img
            alt=""
            className="w-full"
            src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png"
          />
        </div>
      </div>
    </section>
  );

  return (
    <section className="flex flex-col items-center gap-8 py-8 md:py-10">
      {/* Hero Section */}
      <div className="inline-block max-w-3xl text-center justify-center">
        <span className={title()}>Connect&nbsp;</span>
        <span className={title({ color: "violet" })}>Businesses&nbsp;</span>
        <span className={title()}>with&nbsp;</span>
        <span className={title({ color: "violet" })}>Influencers</span>
        <div className={subtitle({ class: "mt-4" })}>
          The ultimate platform for meaningful collaborations that drive results
        </div>
        <div className="flex gap-4 mt-8 justify-center">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            href="/discover"
          >
            Discover Opportunities
          </Link>
          <Link
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
              size: "lg",
            })}
            href="/login"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="w-full max-w-5xl mt-16">
        <h2 className={title({ size: "sm", class: "text-center" })}>
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: "Create Profile",
              description:
                "Sign up and create your business or influencer profile in minutes",
            },
            {
              title: "Connect & Discover",
              description:
                "Browse opportunities or post collaborations based on your needs",
            },
            {
              title: "Collaborate & Grow",
              description:
                "Work together on campaigns that drive meaningful results",
            },
          ].map((step, index) => (
            <Card key={index} className="p-4">
              <CardBody className="text-center">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-default-500">{step.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full max-w-5xl mt-16">
        <h2 className={title({ size: "sm", class: "text-center" })}>
          Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">For Businesses</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>
                  Access to a curated network of authentic influencers
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Simplified campaign management and tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Cost-effective marketing with measurable ROI</span>
              </li>
            </ul>
            <Link className="text-primary font-medium" href="/for-business">
              Learn more →
            </Link>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">For Influencers</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>
                  Find brands that align with your values and audience
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Monetize your content and grow your platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>
                  Build long-term partnerships with reputable businesses
                </span>
              </li>
            </ul>
            <Link className="text-primary font-medium" href="/for-influencers">
              Learn more →
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="w-full max-w-5xl mt-16">
        <h2 className={title({ size: "sm", class: "text-center" })}>
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {[
            {
              quote:
                "This platform helped us find the perfect influencers for our product launch, resulting in a 300% increase in engagement.",
              author: "Sarah J., Marketing Director",
              company: "TechGrowth Inc.",
            },
            {
              quote:
                "I've been able to collaborate with amazing brands that truly align with my values. My audience loves the authenticity!",
              author: "Mark T.",
              company: "Lifestyle Influencer, 500K followers",
            },
          ].map((testimonial, index) => (
            <Card key={index} className="p-6">
              <CardBody>
                <p className="italic mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-default-500 text-sm">
                    {testimonial.company}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-5xl mt-16 bg-primary/10 p-12 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-default-500 max-w-lg mx-auto mb-8">
          Join thousands of businesses and influencers already creating
          successful partnerships
        </p>
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            size: "lg",
          })}
          href="/login"
        >
          Sign Up Now
        </Link>
      </div>
    </section>
  );
}
