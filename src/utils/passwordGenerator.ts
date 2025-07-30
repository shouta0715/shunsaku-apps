import {
  CHARACTER_SETS,
  type PasswordSettings,
} from "@/types/password";

/**
 * セキュアな乱数生成器を使用してパスワードを生成
 */
export function generatePassword(settings: PasswordSettings): string {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    symbolSet,
  } = settings;

  // 文字セットの構築
  let charset = "";
  
  if (includeUppercase) {
    charset += CHARACTER_SETS.uppercase;
  }
  
  if (includeLowercase) {
    charset += CHARACTER_SETS.lowercase;
  }
  
  if (includeNumbers) {
    charset += CHARACTER_SETS.numbers;
  }
  
  if (includeSymbols) {
    charset += symbolSet || CHARACTER_SETS.symbols;
  }

  // 最低限の文字セットがない場合はエラー
  if (charset.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  // 類似文字の除外
  if (excludeSimilar) {
    for (const char of CHARACTER_SETS.similarChars) {
      charset = charset.replace(new RegExp(char, "g"), "");
    }
  }

  // パスワード生成
  return generateSecureRandomString(charset, length);
}

/**
 * Web Crypto APIまたはMath.randomを使用してセキュアな乱数文字列を生成
 */
function generateSecureRandomString(charset: string, length: number): string {
  const password: string[] = [];
  
  try {
    // Web Crypto APIを使用（セキュア）
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      password.push(charset[array[i] % charset.length]);
    }
  } catch {
    // Fallback to Math.random (非推奨だが対応)
    // eslint-disable-next-line no-console
    console.warn("Web Crypto API not available, falling back to Math.random");
    
    for (let i = 0; i < length; i++) {
      password.push(charset[Math.floor(Math.random() * charset.length)]);
    }
  }

  return password.join("");
}

/**
 * パスワード設定の検証
 */
export function validatePasswordSettings(settings: PasswordSettings): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 長さの検証
  if (settings.length < 4 || settings.length > 128) {
    errors.push("Password length must be between 4 and 128 characters");
  }

  // 文字種選択の検証
  const hasCharType = 
    settings.includeUppercase ||
    settings.includeLowercase ||
    settings.includeNumbers ||
    settings.includeSymbols;

  if (!hasCharType) {
    errors.push("At least one character type must be selected");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}