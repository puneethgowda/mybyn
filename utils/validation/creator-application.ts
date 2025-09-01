import { CreatorProfile } from "@/types/user";
import { ValidationParams, ValidationResult } from "@/types/validation";

/**
 * Creator Application Validation Utilities
 *
 * This module provides comprehensive validation functions for creator applications
 * to collaborations. It validates:
 * 1. Creator profile existence and completeness
 * 2. Minimum followers requirement
 * 3. Sufficient balance for application
 */

/**
 * Validate if creator profile exists and has required fields
 */
export function validateCreatorProfile(
  creatorProfile: CreatorProfile | undefined
): ValidationResult {
  if (!creatorProfile) {
    return {
      isValid: false,
      errorMessage: "Please connect your Instagram account before applying",
      field: "profile",
    };
  }

  // Check required fields
  if (!creatorProfile.name || !creatorProfile.instagram_handle) {
    return {
      isValid: false,
      errorMessage: "Please connect your Instagram account before applying",
      field: "profile",
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validate if creator meets minimum followers requirement
 */
export function validateMinimumFollowers(
  creatorFollowers: number | null,
  requiredFollowers: number
): ValidationResult {
  if (!creatorFollowers) {
    return {
      isValid: false,
      errorMessage:
        "Please connect your Instagram account to verify your followers",
      field: "followers",
    };
  }

  if (creatorFollowers < requiredFollowers) {
    return {
      isValid: false,
      errorMessage: `You need at least ${requiredFollowers.toLocaleString()} followers. Current: ${creatorFollowers.toLocaleString()}`,
      field: "followers",
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validate if user has sufficient balance for application
 */
export function validateApplicationBalance(
  userBalance: number,
  requiredPoints: number
): ValidationResult {
  if (userBalance < requiredPoints) {
    return {
      isValid: false,
      errorMessage: `You need ${requiredPoints} credits to apply.`,
      field: "balance",
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Comprehensive validation for creator application
 */
export function validateCreatorApplication(
  params: ValidationParams
): ValidationResult[] {
  const results: ValidationResult[] = [];

  // 1. Validate creator profile
  const profileValidation = validateCreatorProfile(params?.creatorProfile);

  results.push(profileValidation);
  if (!profileValidation.isValid) {
    return results; // Stop on first critical failure
  }

  // 2. Validate minimum followers
  const followersValidation = validateMinimumFollowers(
    params.creatorFollowers,
    params.requiredFollowers
  );

  results.push(followersValidation);
  if (!followersValidation.isValid) {
    return results;
  }

  // 3. Validate balance
  const balanceValidation = validateApplicationBalance(
    params.userBalance,
    params.requiredPoints
  );

  results.push(balanceValidation);

  return results;
}

/**
 * Check if all validations pass
 */
export function areAllValidationsPassed(results: ValidationResult[]): boolean {
  return results.every(result => result.isValid);
}

/**
 * Get first validation error message
 */
export function getFirstValidationError(
  results: ValidationResult[]
): ValidationResult | undefined {
  const failedValidation = results.find(result => !result.isValid);

  return failedValidation;
}
