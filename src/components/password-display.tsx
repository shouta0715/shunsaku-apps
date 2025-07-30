"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { Fieldset } from "./fieldset";
import { Heading } from "./heading";
import { Input, InputGroup } from "./input";
import { Text } from "./text";
import { type PasswordStrength } from "@/types/password";
import { copyToClipboard, isClipboardSupported } from "@/utils";

type PasswordDisplayProps = {
  password: string;
  strength?: PasswordStrength;
  onCopy?: () => void;
  className?: string;
};

export function PasswordDisplay({
  password,
  strength,
  onCopy,
  className,
}: PasswordDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleCopy = async () => {
    if (!password) return;

    try {
      const success = await copyToClipboard(password);
      
      if (success) {
        setCopySuccess(true);
        setCopyError(false);
        onCopy?.();
        
        // 成功メッセージを2秒後に消す
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        setCopyError(true);
        setCopySuccess(false);
        
        // エラーメッセージを3秒後に消す
        setTimeout(() => setCopyError(false), 3000);
      }
    } catch {
      setCopyError(true);
      setCopySuccess(false);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const displayValue = password 
    ? (isVisible ? password : "•".repeat(password.length))
    : "";

  return (
    <div className={className}>
      <Fieldset>
        <Heading level={2}>生成されたパスワード</Heading>
        
        <div className="mt-4">
          <InputGroup>
            <Input
              type="text"
              value={displayValue}
              readOnly
              className="font-mono text-base tracking-wider"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            />
          </InputGroup>
          
          {/* パスワードの情報 */}
          {password && (
            <div className="mt-2 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <span>{password.length}文字</span>
              {strength && (
                <span>
                  強度: {strength.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="mt-4 flex gap-3">
          <Button
            outline
            onClick={handleToggleVisibility}
            disabled={!password}
            className="flex-1"
          >
            {isVisible ? "非表示" : "表示"}
          </Button>
          
          {isClipboardSupported() && (
            <Button
              color="blue"
              onClick={handleCopy}
              disabled={!password}
              className="flex-1"
            >
              {copySuccess ? "✓ コピー済み" : "コピー"}
            </Button>
          )}
        </div>

        {/* フィードバックメッセージ */}
        {copySuccess && (
          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
            <Text className="text-sm text-green-700 dark:text-green-300">
              ✓ パスワードをクリップボードにコピーしました
            </Text>
          </div>
        )}

        {copyError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
            <Text className="text-sm text-red-700 dark:text-red-300">
              ✗ コピーに失敗しました。手動でパスワードを選択してコピーしてください。
            </Text>
          </div>
        )}

        {/* 強度フィードバック */}
        {strength && strength.feedback.length > 0 && (
          <div className="mt-4">
            <Text className="text-sm font-medium text-zinc-950 dark:text-white">
              パスワード強化のヒント:
            </Text>
            <ul className="mt-2 space-y-1">
              {strength.feedback.map((feedback, index) => (
                <li key={index} className="text-sm text-zinc-600 dark:text-zinc-400">
                  • {feedback}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* パスワードが空の場合 */}
        {!password && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <Text className="text-zinc-500 dark:text-zinc-400">
              「パスワード生成」ボタンをクリックしてパスワードを作成してください
            </Text>
          </div>
        )}
      </Fieldset>
    </div>
  );
}