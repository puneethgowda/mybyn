import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";

import { COLLAB_TYPE } from "@/utils/enums";
import { CollabWithBusinessProfile } from "@/types/collab";
import { toTitleCase } from "@/utils/string";
import { useBreakpoint } from "@/hooks/use-breakpoint";

interface CollabCardProps {
  collab: CollabWithBusinessProfile;
  handleClick: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  onApply?: () => void;
}

const CollabCard = ({ collab, handleClick }: CollabCardProps) => {
  const { isSm } = useBreakpoint();

  return (
    <Card key={collab.id} className="w-full cursor-pointer">
      <CardBody className="gap-3 p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar
              className="bg-primary/20 text-primary"
              size="md"
              src={collab.business_profile.logo_url}
            />
            <div>
              <h4 className="font-semibold">
                {toTitleCase(collab.business_profile.name)}
              </h4>
              <p className="text-xs text-default-500">
                {toTitleCase(collab.business_profile.location)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {/*{true && (*/}
            {/*  <Tooltip content="Trending opportunity">*/}
            {/*    <Chip color="danger" size="sm" variant="flat">*/}
            {/*      🔥 Trending*/}
            {/*    </Chip>*/}
            {/*  </Tooltip>*/}
            {/*)}*/}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold line-clamp-2">
            {toTitleCase(collab.title)}
          </h3>
          <p className="text-sm text-default-600 mt-1 line-clamp-2">
            {collab.description}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-default-500">Amount Offered</p>
            <p className="font-semibold">
              ₹{collab.amount && collab.amount.toLocaleString()}
            </p>
          </div>
          <Chip color="secondary" size={isSm ? "sm" : "md"} variant="flat">
            {COLLAB_TYPE[collab.collab_type]}
          </Chip>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1">
            <Chip size="sm" variant="flat">
              <span>{collab.platform}</span>
            </Chip>
            <Chip size="sm" variant="flat">
              {`Min: ${collab.min_followers} ${collab.platform === "INSTAGRAM" ? "followers" : "subscribers"}`}
            </Chip>
          </div>

          <Button className="" color="primary" size="sm" onPress={handleClick}>
            Learn More
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CollabCard;
