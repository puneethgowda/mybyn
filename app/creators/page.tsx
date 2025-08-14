import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

import { title, subtitle } from "@/components/primitives";

export default function ForInfluencersPage() {
  return (
    <section className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className={title()}>Monetize Your Influence</h1>
        <p className={subtitle({ class: "mt-4" })}>
          Connect with brands that align with your values and create authentic
          content that resonates with your audience
        </p>
        <Button
          as={Link}
          className="mt-8"
          color="primary"
          href="/login"
          size="lg"
        >
          Connect Instagram
        </Button>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {[
          {
            title: "Find Aligned Brands",
            description:
              "Connect with brands that share your values and resonate with your audience",
          },
          {
            title: "Monetize Your Content",
            description:
              "Turn your passion into income with paid collaborations and partnerships",
          },
          {
            title: "Grow Your Platform",
            description:
              "Expand your reach and build your personal brand through strategic partnerships",
          },
        ].map((benefit, index) => (
          <Card key={index} className="p-4">
            <CardBody>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-default-500">{benefit.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <div className="mt-12">
        <h2 className={title({ size: "sm", class: "text-center" })}>
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8  mt-12">
          {[
            {
              step: 1,
              title: "Create Profile",
              description:
                "Sign up and connect your Instagram account to showcase your content",
            },
            {
              step: 2,
              title: "Complete Profile",
              description:
                "Add your niche, interests, and collaboration preferences",
            },
            {
              step: 3,
              title: "Apply to Campaigns",
              description:
                "Browse and apply to campaigns that match your style and audience",
            },
            {
              step: 4,
              title: "Create & Earn",
              description:
                "Create authentic content, delight your audience, and get paid",
            },
          ].map((step) => (
            <div
              key={step.step}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-default-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Story */}
      <div className="bg-primary/10 p-8 rounded-xl mt-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Success Story: Alex Rivera
          </h2>
          <p className="mb-4">
            Before joining this platform, I was struggling to monetize my
            content despite having a decent following. Within just two months, I
            secured partnerships with three major brands that perfectly aligned
            with my content style. I&apos;ve been able to increase my income by
            70% while creating content I&apos;m truly proud of.
          </p>
          <p className="font-semibold">
            - Alex Rivera, Lifestyle Influencer (150K followers)
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">70%</p>
              <p className="text-sm">Income Increase</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">12</p>
              <p className="text-sm">Brand Partnerships</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">35%</p>
              <p className="text-sm">Follower Growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Brands */}
      <div className="mt-12">
        <h2 className={title({ size: "sm", class: "text-center" })}>
          Top Brands on Our Platform
        </h2>
        <div className="flex flex-wrap justify-center gap-8  mt-8">
          {["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"].map(
            (brand, index) => (
              <div
                key={index}
                className="w-32 h-32 bg-default-100 rounded-lg flex items-center justify-center"
              >
                <p className="font-bold text-default-500">{brand}</p>
              </div>
            ),
          )}
        </div>
      </div>

      {/* FAQs */}
      {/*<div className="mt-12">*/}
      {/*  <h2 className={title({ size: "sm", class: "text-center mb-8" })}>Frequently Asked Questions</h2>*/}
      {/*  <Accordion variant="splitted" className="max-w-3xl mx-auto">*/}
      {/*    <AccordionItem key="1" title="Is there a minimum follower count required?">*/}
      {/*      We welcome influencers of all sizes, including micro and nano influencers. What matters most is */}
      {/*      your engagement rate and the authenticity of your content.*/}
      {/*    </AccordionItem>*/}
      {/*    <AccordionItem key="2" title="How do I get paid for collaborations?">*/}
      {/*      Payment terms are set by each brand and clearly stated in the campaign details. Most payments */}
      {/*      are processed through our secure platform once the content is approved.*/}
      {/*    </AccordionItem>*/}
      {/*    <AccordionItem key="3" title="Can I choose which brands to work with?">*/}
      {/*      Absolutely! You have complete control over which campaigns you apply for and which brands you */}
      {/*      collaborate with. We encourage you to only work with brands that align with your values.*/}
      {/*    </AccordionItem>*/}
      {/*    <AccordionItem key="4" title="What if I can't meet a campaign deadline?">*/}
      {/*      Communication is key. If you're facing challenges meeting a deadline, reach out to the brand */}
      {/*      through our platform as soon as possible to discuss alternatives.*/}
      {/*    </AccordionItem>*/}
      {/*  </Accordion>*/}
      {/*</div>*/}

      {/* CTA */}
      <div className="text-center mt-12 bg-linear-to-r from-primary/20 to-secondary/20 p-12 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">
          Ready to turn your influence into income?
        </h2>
        <p className="text-default-600 max-w-2xl mx-auto mb-8">
          Join thousands of influencers already creating authentic content and
          building their careers
        </p>
        <Button as={Link} color="primary" href="/login" size="lg">
          Sign Up as Influencer
        </Button>
      </div>
    </section>
  );
}
