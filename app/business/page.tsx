import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

import { title, subtitle } from "@/components/primitives";

export default function ForBusinessPage() {
  return (
    <section className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className={title()}>
          Grow Your Business with Influencer Marketing
        </h1>
        <p className={subtitle({ class: "mt-4" })}>
          Connect with authentic influencers who can help you reach new
          audiences and drive real results
        </p>
        <Button
          as={Link}
          className="mt-8"
          color="primary"
          href="/login"
          size="lg"
        >
          Create Business Profile
        </Button>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {[
          {
            title: "Targeted Reach",
            description:
              "Connect with influencers whose audience matches your ideal customer profile",
          },
          {
            title: "Authentic Content",
            description:
              "Get genuine content created by influencers who believe in your products",
          },
          {
            title: "Measurable Results",
            description:
              "Track performance metrics and ROI for all your campaigns",
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
        <h2 className={title({ size: "sm", class: "text-center mb-12" })}>
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: 1,
              title: "Create Profile",
              description:
                "Sign up and create your business profile with details about your brand",
            },
            {
              step: 2,
              title: "Post Campaign",
              description:
                "Create a campaign with your requirements, budget, and goals",
            },
            {
              step: 3,
              title: "Review Applications",
              description:
                "Review influencer applications and select the best matches",
            },
            {
              step: 4,
              title: "Collaborate & Grow",
              description:
                "Work with influencers and track campaign performance",
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

      {/* Case Study */}
      <div className="bg-primary/10 p-8 rounded-xl mt-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Success Story: TechGrowth Inc.
          </h2>
          <p className="mb-4">
            We were struggling to reach our target demographic until we found
            this platform. Within 3 months of running influencer campaigns, we
            saw a 200% increase in website traffic and a 45% boost in
            conversions. The ROI has been incredible.
          </p>
          <p className="font-semibold">- Sarah Johnson, Marketing Director</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">200%</p>
              <p className="text-sm">Increase in Traffic</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">45%</p>
              <p className="text-sm">Higher Conversion</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">3.5x</p>
              <p className="text-sm">ROI on Ad Spend</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mt-12">
        <h2 className={title({ size: "sm", class: "text-center mb-8" })}>
          Frequently Asked Questions
        </h2>
        {/*<Accordion variant="splitted" className="max-w-3xl mx-auto">*/}
        {/*  <AccordionItem*/}
        {/*    key="1"*/}
        {/*    title="How much does it cost to use the platform?"*/}
        {/*  >*/}
        {/*    Our platform operates on a subscription model with different tiers*/}
        {/*    based on your business needs. You only pay for the subscription, and*/}
        {/*    there are no additional fees for connecting with influencers.*/}
        {/*  </AccordionItem>*/}
        {/*  <AccordionItem*/}
        {/*    key="2"*/}
        {/*    title="How do I know which influencers are right for my brand?"*/}
        {/*  >*/}
        {/*    Our platform provides detailed analytics on each influencer's*/}
        {/*    audience demographics, engagement rates, and content quality. You*/}
        {/*    can also filter influencers based on niche, location, and audience*/}
        {/*    size.*/}
        {/*  </AccordionItem>*/}
        {/*  <AccordionItem*/}
        {/*    key="3"*/}
        {/*    title="Can I run multiple campaigns simultaneously?"*/}
        {/*  >*/}
        {/*    Yes, you can run as many campaigns as you need. Our platform makes*/}
        {/*    it easy to manage multiple campaigns and track their performance*/}
        {/*    individually.*/}
        {/*  </AccordionItem>*/}
        {/*  <AccordionItem*/}
        {/*    key="4"*/}
        {/*    title="What if I'm not satisfied with an influencer's work?"*/}
        {/*  >*/}
        {/*    We have a review system in place to ensure quality. If you're not*/}
        {/*    satisfied, you can address concerns directly with the influencer*/}
        {/*    through our platform, and our support team is always available to*/}
        {/*    help resolve any issues.*/}
        {/*  </AccordionItem>*/}
        {/*</Accordion>*/}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 bg-linear-to-r from-primary/20 to-secondary/20 p-12 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">
          Ready to grow your business with influencer marketing?
        </h2>
        <p className="text-default-600 max-w-2xl mx-auto mb-8">
          Join thousands of businesses already leveraging the power of authentic
          influencer partnerships
        </p>
        <Button as={Link} color="primary" href="/login" size="lg">
          Get Started Today
        </Button>
      </div>
    </section>
  );
}
