import { CreatorProfile } from "@/types/user";

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  field?: string;
}

export interface ValidationParams {
  creatorProfile: CreatorProfile | undefined;
  creatorFollowers: number | null;
  requiredFollowers: number;
  userBalance: number;
  requiredPoints: number;
}

export interface ValidationError {
  type: "profile" | "followers" | "balance";
  message: string;
  field?: string;
}
