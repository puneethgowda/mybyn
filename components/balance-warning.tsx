"use client";

import { RiFeedbackLine, RiFlashlightLine } from "@remixicon/react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <CardContent className="flex flex-row items-center gap-3">
        <RiFeedbackLine className="size-5 text-yellow-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-warning">
            Insufficient Balance
          </p>
          <p className="text-xs text-muted-foreground">
            You need {shortfall} more points to{" "}
            {action === "create"
              ? "create collaborations"
              : "apply for collaborations"}
            .
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <RiFlashlightLine
              aria-hidden="true"
              className="opacity-60"
              size={12}
            />
            {currentBalance}/{requiredPoints}
          </Badge>
          <Link href="/dashboard/profile">
            <Button size="sm" variant="default">
              Earn Points
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
