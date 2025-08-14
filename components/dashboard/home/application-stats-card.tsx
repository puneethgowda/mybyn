import React from "react";
import { Card, CardBody } from "@heroui/card";

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
      <CardBody className="md:gap-2">
        <div className="flex items-center justify-between">
          <p className="text-default-500 text-xs md:text-base">{title}</p>
          {icon}
        </div>
        <p className="text-xl md:text-3xl font-bold">{count}</p>
      </CardBody>
    </Card>
  );
};

export default ApplicationStatsCard;
