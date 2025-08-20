import React from "react";

import { Card, CardContent } from "@/components/ui/card";

const ApplicationStatsCard = ({
  title,
  icon,
  count,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
}) => {
  return (
    <Card>
      <CardContent className="md:gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs md:text-base">{title}</p>
          {icon}
        </div>
        <p className="text-xl md:text-3xl font-bold">{count}</p>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatsCard;
