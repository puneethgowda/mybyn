"use client";

import { RiSettingsLine } from "@remixicon/react";
import * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTitle, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

type FilterPanelContext = {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  togglePanel: () => void;
};

const FilterPanelContext = React.createContext<FilterPanelContext | null>(null);

function useFilterPanel() {
  const context = React.useContext(FilterPanelContext);

  if (!context) {
    throw new Error(
      "useFilterPanel must be used within a FilterPanelProvider.",
    );
  }

  return context;
}

const FilterPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile(1024);
  const [openMobile, setOpenMobile] = React.useState(false);

  // Helper to toggle the sidebar.
  const togglePanel = React.useCallback(() => {
    return isMobile && setOpenMobile((open) => !open);
  }, [isMobile, setOpenMobile]);

  const contextValue = React.useMemo<FilterPanelContext>(
    () => ({
      isMobile,
      openMobile,
      setOpenMobile,
      togglePanel,
    }),
    [isMobile, openMobile, setOpenMobile, togglePanel],
  );

  return (
    <FilterPanelContext.Provider value={contextValue}>
      {children}
    </FilterPanelContext.Provider>
  );
};

FilterPanelProvider.displayName = "FilterPanelProvider";

const FilterPanel = ({ children }: { children: React.ReactNode }) => {
  const { isMobile, openMobile, setOpenMobile } = useFilterPanel();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent className="w-72 px-4 md:px-6 py-0 bg-[hsl(240_5%_92.16%)] [&>button]:hidden">
          <SheetTitle className="hidden">Filter</SheetTitle>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <ScrollArea>
      <div className="w-[300px] px-4 md:px-6">{children}</div>
    </ScrollArea>
  );
};

FilterPanel.displayName = "FilterPanel";

const FilterPanelTrigger = ({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { isMobile, togglePanel } = useFilterPanel();

  if (!isMobile) {
    return null;
  }

  return (
    <Button
      className="px-2"
      variant="ghost"
      onClick={(event) => {
        onClick?.(event);
        togglePanel();
      }}
    >
      <RiSettingsLine
        aria-hidden="true"
        className="text-muted-foreground sm:text-muted-foreground/70 size-5"
        size={20}
      />
      <span className="">Filter</span>
    </Button>
  );
};

FilterPanelTrigger.displayName = "FilterPanelTrigger";

export { FilterPanel, FilterPanelProvider, FilterPanelTrigger, useFilterPanel };
