export const VIDEO_WIDTH_PX = 1920;
export const VIDEO_HEIGHT_PX = 1080;
export const VIDEO_FPS = 30;

export const BACKGROUND_COLOR = "#0a0a0a";
export const TEXT_COLOR = "#d4d4d8";
export const MUTED_COLOR = "#737373";
export const RED_COLOR = "#f87171";
export const GREEN_COLOR = "#4ade80";
export const YELLOW_COLOR = "#eab308";

export const COMMAND = "npx -y react-doctor@latest .";

export const TARGET_SCORE = 42;
export const PERFECT_SCORE = 100;
export const SCORE_GOOD_THRESHOLD = 75;
export const SCORE_OK_THRESHOLD = 50;
export const TOTAL_ERROR_COUNT = 22;
export const AFFECTED_FILE_COUNT = 18;
export const ELAPSED_TIME = "2.1s";
export const SCORE_BAR_WIDTH = 30;

export const CHAR_FRAMES = 2;
export const CURSOR_BLINK_FRAMES = 16;

export const SCENE_HERO_START = 0;
export const SCENE_HERO_DURATION = 60;
export const SCENE_TYPING_START = SCENE_HERO_START + SCENE_HERO_DURATION;
export const SCENE_TYPING_DURATION = 75;
export const SCENE_DIAGNOSTICS_START = SCENE_TYPING_START + SCENE_TYPING_DURATION;
export const SCENE_DIAGNOSTICS_DURATION = 105;
export const SCENE_SCORE_START = SCENE_DIAGNOSTICS_START + SCENE_DIAGNOSTICS_DURATION;
export const SCENE_SCORE_DURATION = 75;
export const SCENE_CTA_START = SCENE_SCORE_START + SCENE_SCORE_DURATION;
export const SCENE_CTA_DURATION = 45;

export const TOTAL_DURATION =
  SCENE_HERO_DURATION +
  SCENE_TYPING_DURATION +
  SCENE_DIAGNOSTICS_DURATION +
  SCENE_SCORE_DURATION +
  SCENE_CTA_DURATION;

export const DIAGNOSTICS = [
  {
    message: "Derived state computed in useEffect, compute during render instead",
    count: 5,
  },
  {
    message: 'Server action "deleteUser" missing authentication check',
    count: 2,
  },
  {
    message: "Array index used as key, causes bugs when items are reordered",
    count: 12,
  },
  {
    message: 'Component "UserCard" inside "Dashboard", destroys state every render',
    count: 4,
  },
  {
    message: "Data fetched in useEffect without cleanup, causes race conditions",
    count: 8,
  },
  {
    message: "useState initialized from prop, derive during render instead of syncing",
    count: 3,
  },
  {
    message: "Missing prefers-reduced-motion check for animations",
    count: 2,
  },
];

export const BOX_TOP = "┌─────┐";
export const BOX_BOTTOM = "└─────┘";
