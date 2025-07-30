/**
 * パスワード生成設定の型定義
 */
export type PasswordSettings = {
  length: number; // 4-128
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  symbolSet?: string;
};

/**
 * パスワード強度の型定義
 */
export type PasswordStrength = {
  score: number; // 0-4
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
  feedback: string[];
};

/**
 * パスワード履歴項目の型定義
 */
export type PasswordHistoryItem = {
  id: string;
  password: string;
  timestamp: number;
  settings: PasswordSettings;
  strength: PasswordStrength;
};

/**
 * プリセット設定の型定義
 */
export type PasswordPreset = {
  id: string;
  name: string;
  settings: PasswordSettings;
};

/**
 * デフォルト設定
 */
export const DEFAULT_PASSWORD_SETTINGS: PasswordSettings = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeSimilar: false,
  symbolSet: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

/**
 * 文字セット定義
 */
export const CHARACTER_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  similarChars: "0O1lI",
} as const;