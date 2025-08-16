import { Fira_Code as FontMono, Onest } from "next/font/google";
import localFont from "next/font/local";

export const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const moSans = localFont({
  src: "./68934a4feeb4c496ee3a3cc8_MoSans-Regular.woff",
  variable: "--font-mosans",
});
