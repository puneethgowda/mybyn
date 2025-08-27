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

// UI Constants
export const UI = {
  ITEMS_PER_PAGE: 9,
  DASHBOARD_RECENT_LIMIT: 3,
} as const;
