import { DEFAULT_PASSWORD_SETTINGS, type PasswordSettings } from "@/types/password";

const STORAGE_KEY = "password-generator-settings";

/**
 * sessionStorageから設定を読み込み
 */
export function loadSettings(): PasswordSettings {
  // サーバーサイドでは実行しない
  if (typeof window === "undefined") {
    return DEFAULT_PASSWORD_SETTINGS;
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PASSWORD_SETTINGS;
    }

    const parsed = JSON.parse(stored) as PasswordSettings;
    
    // 設定の検証
    if (isValidSettings(parsed)) {
      return parsed;
    }

    // 無効な設定の場合はデフォルトを返す
    return DEFAULT_PASSWORD_SETTINGS;
  } catch {
    // エラーの場合はデフォルト設定を返す
    return DEFAULT_PASSWORD_SETTINGS;
  }
}

/**
 * sessionStorageに設定を保存
 */
export function saveSettings(settings: PasswordSettings): boolean {
  // サーバーサイドでは実行しない
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const serialized = JSON.stringify(settings);
    sessionStorage.setItem(STORAGE_KEY, serialized);

    return true;
  } catch {
    return false;
  }
}

/**
 * 保存された設定をクリア
 */
export function clearSettings(): boolean {
  // サーバーサイドでは実行しない
  if (typeof window === "undefined") {
    return false;
  }

  try {
    sessionStorage.removeItem(STORAGE_KEY);

    return true;
  } catch {
    return false;
  }
}

/**
 * 設定の妥当性を検証
 */
function isValidSettings(settings: unknown): settings is PasswordSettings {
  if (!settings || typeof settings !== "object") {
    return false;
  }

  const s = settings as Record<string, unknown>;

  return (
    typeof s.length === "number" &&
    s.length >= 4 &&
    s.length <= 128 &&
    typeof s.includeUppercase === "boolean" &&
    typeof s.includeLowercase === "boolean" &&
    typeof s.includeNumbers === "boolean" &&
    typeof s.includeSymbols === "boolean" &&
    typeof s.excludeSimilar === "boolean" &&
    (s.symbolSet === undefined || typeof s.symbolSet === "string")
  );
}

/**
 * sessionStorageが利用可能かチェック
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const testKey = "__storage_test__";
    sessionStorage.setItem(testKey, "test");
    sessionStorage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
}