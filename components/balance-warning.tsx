"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { MessageAlert, Coins } from "iconoir-react";
import Link from "next/link";

interface BalanceWarningProps {
  currentBalance: number;
  requiredPoints: number;
  action: "create" | "apply";
  className?: string;
}

export function BalanceWarning({
  currentBalance,
  requiredPoints,
  action,
  className,
}: BalanceWarningProps) {
  const shortfall = requiredPoints - currentBalance;

  if (currentBalance >= requiredPoints) return null;

  return (
    <Card className={`border-warning ${className}`}>
      <CardBody className="flex flex-row items-center gap-3 p-4">
        <MessageAlert className="size-5 text-warning flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-warning">
            Insufficient Balance
          </p>
          <p className="text-xs text-default-600">
            You need {shortfall} more points to{" "}
            {action === "create"
              ? "create collaborations"
              : "apply for collaborations"}
            .
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            startContent={<Coins className="size-3" />}
            variant="flat"
          >
            {currentBalance}/{requiredPoints}
          </Chip>
          <Link href="/dashboard/profile">
            <Button color="warning" size="sm" variant="flat">
              Earn Points
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
