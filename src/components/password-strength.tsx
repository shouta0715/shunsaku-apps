"use client";

import React from "react";
import { Badge } from "./badge";
import { Text } from "./text";
import { type PasswordStrength } from "@/types/password";

type PasswordStrengthProps = {
  strength: PasswordStrength;
  showFeedback?: boolean;
  className?: string;
};

export function PasswordStrengthDisplay({
  strength,
  showFeedback = true,
  className,
}: PasswordStrengthProps) {
  const getBadgeColor = (label: PasswordStrength["label"]) => {
    switch (label) {
      case "Very Weak":
        return "red" as const;
      case "Weak":
        return "orange" as const;
      case "Fair":
        return "yellow" as const;
      case "Good":
        return "blue" as const;
      case "Strong":
        return "green" as const;
      default:
        return "zinc" as const;
    }
  };

  const getStrengthDescription = (label: PasswordStrength["label"]) => {
    switch (label) {
      case "Very Weak":
        return "非常に弱い";
      case "Weak":
        return "弱い";
      case "Fair":
        return "普通";
      case "Good":
        return "良い";
      case "Strong":
        return "強い";
      default:
        return "不明";
    }
  };

  const getScoreBar = (score: number) => {
    const maxScore = 5;
    const scorePercentage = (score / maxScore) * 100;
    
    let barColor = "bg-red-500";
    if (score >= 4) barColor = "bg-green-500";
    else if (score >= 3) barColor = "bg-blue-500";
    else if (score >= 2) barColor = "bg-yellow-500";
    else if (score >= 1) barColor = "bg-orange-500";

    return (
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden dark:bg-zinc-700">
            <div
              className={`h-full transition-all duration-300 ${barColor}`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
          <Text className="text-xs text-zinc-500 dark:text-zinc-400 min-w-fit">
            {score}/5
          </Text>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* 強度バッジと説明 */}
        <div className="flex items-center gap-3">
          <Badge color={getBadgeColor(strength.label)}>
            {getStrengthDescription(strength.label)}
          </Badge>
          <Text className="text-sm text-zinc-600 dark:text-zinc-400">
            パスワード強度
          </Text>
        </div>

        {/* スコアバー */}
        {getScoreBar(strength.score)}

        {/* フィードバック */}
        {showFeedback && strength.feedback.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
            <Text className="text-sm font-medium text-zinc-950 dark:text-white mb-2">
              改善提案:
            </Text>
            <ul className="space-y-1">
              {strength.feedback.map((feedback, index) => (
                <li key={index} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{feedback}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * シンプルな強度バッジのみ表示するコンポーネント
 */
export function PasswordStrengthBadge({
  strength,
  className,
}: {
  strength: PasswordStrength;
  className?: string;
}) {
  const getBadgeColor = (label: PasswordStrength["label"]) => {
    switch (label) {
      case "Very Weak":
        return "red" as const;
      case "Weak":
        return "orange" as const;
      case "Fair":
        return "yellow" as const;
      case "Good":
        return "blue" as const;
      case "Strong":
        return "green" as const;
      default:
        return "zinc" as const;
    }
  };

  const getStrengthDescription = (label: PasswordStrength["label"]) => {
    switch (label) {
      case "Very Weak":
        return "非常に弱い";
      case "Weak":
        return "弱い";
      case "Fair":
        return "普通";
      case "Good":
        return "良い";
      case "Strong":
        return "強い";
      default:
        return "不明";
    }
  };

  return (
    <Badge color={getBadgeColor(strength.label)} className={className}>
      {getStrengthDescription(strength.label)}
    </Badge>
  );
}