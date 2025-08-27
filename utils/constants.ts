// Points and Balance Constants
export const POINTS = {
  CREATE_COLLAB: 50,
  APPLY_COLLAB: 10,
  REFERRAL_REWARD: 100,
  REFERRAL_CREATOR_PROFILE: 50,
  REFERRAL_BUSINESS_PROFILE: 50,
} as const;

// Collab Constants
export const COLLAB_LIMITS = {
  MIN_FOLLOWERS: 0,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const;

// Application Constants
export const APPLICATION_LIMITS = {
  MAX_MESSAGE_LENGTH: 500,
} as const;

// Validation Constants
export const VALIDATION_MESSAGES = {
  PROFILE_MISSING: "Please complete your creator profile before applying",
  PROFILE_INCOMPLETE:
    "Please complete your creator profile with name and Instagram handle",
  INSTAGRAM_NOT_CONNECTED:
    "Please connect your Instagram account to verify your followers",
  INSUFFICIENT_FOLLOWERS:
    "You need at least {required} followers. Current: {current}",
  INSUFFICIENT_BALANCE:
    "You need {required} points to apply. Current balance: {current} points",
} as const;

// UI Constants
export const UI = {
  ITEMS_PER_PAGE: 9,
  DASHBOARD_RECENT_LIMIT: 3,
} as const;
