import React from "react";
import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";
import { DiscordIcon, GithubIcon, TwitterIcon } from "@/components/icons";

const Footer = () => {
  return (
    <footer className="w-full px-6 bg-[#141414] text-white rounded-4xl  py-8 mt-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">KOLLABIT</h3>
            <p className="text-muted-foreground text-sm">
              Connecting businesses and influencers for impactful
              collaborations.
            </p>
            <div className="flex gap-4 mt-4">
              <Link
                isExternal
                aria-label="Twitter"
                href={siteConfig.links.twitter}
              >
                <TwitterIcon className="text-muted-foreground hover:text-primary" />
              </Link>
              <Link
                isExternal
                aria-label="GitHub"
                href={siteConfig.links.github}
              >
                <GithubIcon className="text-muted-foreground hover:text-primary" />
              </Link>
              <Link
                isExternal
                aria-label="Discord"
                href={siteConfig.links.discord}
              >
                <DiscordIcon className="text-muted-foreground hover:text-primary" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">For Businesses</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/business"
                >
                  Business Solutions
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/case-studies"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/resources"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">For Influencers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/influencers"
                >
                  Influencer Platform
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/opportunities"
                >
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/growth"
                >
                  Grow Your Brand
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/success-stories"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/blog"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-divider mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BIZZ. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              className="text-muted-foreground hover:text-primary text-sm"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-muted-foreground hover:text-primary text-sm"
              href="/terms"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
