import { ReactNode } from "react";

import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";

const LayoutSkeleton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default LayoutSkeleton;
