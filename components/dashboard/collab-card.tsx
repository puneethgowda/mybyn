import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { CollabWithBusinessProfile } from "@/types/collab";
import { COLLAB_TYPE } from "@/utils/enums";
import { toTitleCase } from "@/utils/string";

interface CollabCardProps {
  collab: CollabWithBusinessProfile;
  handleClick: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  onApply?: () => void;
}

const CollabCard = ({ collab, handleClick }: CollabCardProps) => {
  const { isSm: _isSm } = useBreakpoint();

  return (
    <Card
      key={collab.id}
      className="w-full cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="gap-3 space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="rounded-md">
              <AvatarImage
                alt="business profile"
                src={collab.business_profile.logo_url}
              />
              <AvatarFallback className=" rounded-md">
                {collab.business_profile.name}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">
                {toTitleCase(collab.business_profile.name)}
              </h4>
              <p className="text-xs text-muted-foreground">
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
          <p className="text-sm text-muted-foreground line-clamp-2">
            {collab.description}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Amount Offered</p>
            {/* if collab type is barter show minus sign instead of amount */}
            {collab.collab_type === "BARTER" ? (
              <p className="font-semibold">-</p>
            ) : (
              <p className="font-semibold">
                ₹{collab.amount && collab.amount.toLocaleString()}
              </p>
            )}
          </div>
          <Badge variant="outline">{COLLAB_TYPE[collab.collab_type]}</Badge>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1">
            <Badge
              className={`text-white ${collab.platform === "INSTAGRAM" ? "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]" : "bg-gray-200"}`}
              variant="secondary"
            >
              <span>{toTitleCase(collab?.platform?.toLowerCase() ?? "")}</span>
            </Badge>
            <Badge variant="secondary">
              {`Min: ${collab.min_followers} ${
                collab.platform === "INSTAGRAM" ? "followers" : "subscribers"
              }`}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollabCard;
