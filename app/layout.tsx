import "./globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { cn } from "@heroui/theme";
import { headers } from "next/headers";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/"; // Use middleware to set x-pathname or parse from request

  const websiteRoutes = ["/", "/business", "/discover", "/creators"];
  const isWebsiteRoute = websiteRoutes.includes(pathname);
  const isLogin = ["/login"].includes(pathname);

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-dvh text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-dvh supports-[height:100dvh]:h-dvh">
            {(isWebsiteRoute || isLogin) && <Navbar />}
            <div
              className={cn({
                "container mx-auto max-w-7xl pt-16 px-6 grow": isWebsiteRoute,
                "h-full": !isWebsiteRoute,
              })}
            >
              {children}
            </div>
            {isWebsiteRoute && <Footer />}
          </div>
        </Providers>
      </body>
    </html>
  );
}
