import { CHARACTER_SETS, type PasswordStrength } from "@/types/password";

/**
 * パスワード強度を計算
 */
export function calculateStrength(password: string): PasswordStrength {
  if (!password || password.length === 0) {
    return {
      score: 0,
      label: "Very Weak",
      feedback: ["Password is required"],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // 長さによる評価
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Use at least 8 characters");
  }

  if (password.length >= 12) {
    score += 1;
  } else if (password.length >= 8) {
    feedback.push("Consider using 12 or more characters");
  }

  // 文字種多様性の評価
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = new RegExp(`[${escapeRegExp(CHARACTER_SETS.symbols)}]`).test(password);

  const charTypeCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;

  if (charTypeCount >= 3) {
    score += 1;
  } else {
    const missing = [];
    if (!hasLowercase) missing.push("lowercase letters");
    if (!hasUppercase) missing.push("uppercase letters");
    if (!hasNumbers) missing.push("numbers");
    if (!hasSymbols) missing.push("symbols");
    feedback.push(`Add ${missing.slice(0, -1).join(", ")}${missing.length > 1 ? " and " : ""}${missing[missing.length - 1]}`);
  }

  // パターンの評価
  if (!hasRepeatingCharacters(password)) {
    score += 1;
  } else {
    feedback.push("Avoid repeating characters");
  }

  if (!hasCommonPatterns(password)) {
    score += 1;
  } else {
    feedback.push("Avoid common patterns");
  }

  // スコアに基づくラベル決定
  const label = getStrengthLabel(score);

  return {
    score,
    label,
    feedback,
  };
}

/**
 * スコアからラベルを取得
 */
function getStrengthLabel(score: number): PasswordStrength["label"] {
  switch (score) {
    case 0:
    case 1:
      return "Very Weak";
    case 2:
      return "Weak";
    case 3:
      return "Fair";
    case 4:
      return "Good";
    case 5:
      return "Strong";
    default:
      return "Very Weak";
  }
}

/**
 * 繰り返し文字の検出
 */
function hasRepeatingCharacters(password: string): boolean {
  return /(.)\1{2,}/.test(password);
}

/**
 * 一般的なパターンの検出
 */
function hasCommonPatterns(password: string): boolean {
  const commonPatterns = [
    /123456/,
    /abcdef/,
    /qwerty/,
    /password/i,
    /admin/i,
    /letmein/i,
  ];

  return commonPatterns.some(pattern => pattern.test(password));
}

/**
 * 正規表現用の文字エスケープ
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * パスワード強度に応じた色を取得
 */
export function getStrengthColor(strength: PasswordStrength): {
  bgColor: string;
  textColor: string;
} {
  switch (strength.label) {
    case "Very Weak":
      return { bgColor: "bg-red-100", textColor: "text-red-800" };
    case "Weak":
      return { bgColor: "bg-orange-100", textColor: "text-orange-800" };
    case "Fair":
      return { bgColor: "bg-yellow-100", textColor: "text-yellow-800" };
    case "Good":
      return { bgColor: "bg-blue-100", textColor: "text-blue-800" };
    case "Strong":
      return { bgColor: "bg-green-100", textColor: "text-green-800" };
    default:
      return { bgColor: "bg-gray-100", textColor: "text-gray-800" };
  }
}