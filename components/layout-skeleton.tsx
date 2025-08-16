import React, { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

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
