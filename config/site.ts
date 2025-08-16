export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Kollabit | Your collab, made simple",
  description:
    "Connecting creators, influencers, and business to create, collaborate, and grow",
  navItems: [
    {
      label: "Business",
      href: "/business",
    },
    {
      label: "Creators",
      href: "/creators",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Business",
      href: "/business",
    },
    {
      label: "Creators",
      href: "/creators",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
