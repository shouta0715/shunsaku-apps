"use client";

import React, { useState, useCallback, useMemo, useEffect, Component } from "react";
import { Fieldset } from "./fieldset";
import { Heading } from "./heading";
import { PasswordControls } from "./password-controls";
import { PasswordDisplay } from "./password-display";
import { PasswordStrengthDisplay } from "./password-strength";
import {
  type PasswordSettings,
  type PasswordStrength,
} from "@/types/password";
import {
  generatePassword,
  calculateStrength,
  validatePasswordSettings,
  loadSettings,
  saveSettings,
} from "@/utils";

type PasswordGeneratorProps = {
  className?: string;
  initialSettings?: PasswordSettings;
};

export function PasswordGenerator({
  className,
  initialSettings,
}: PasswordGeneratorProps) {
  const [settings, setSettings] = useState<PasswordSettings>(() => {
    // 初期化時に保存された設定を読み込む
    if (initialSettings) {
      return initialSettings;
    }

    return loadSettings();
  });
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // パスワード強度の計算（メモ化）
  const passwordStrength = useMemo<PasswordStrength>(() => {
    if (!password) {
      return {
        score: 0,
        label: "Very Weak",
        feedback: [],
      };
    }

    return calculateStrength(password);
  }, [password]);

  // パスワード生成関数
  const handleGenerate = useCallback(async () => {
    setError(null);
    setIsGenerating(true);

    try {
      // 設定の検証
      const validation = validatePasswordSettings(settings);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // パスワード生成（非同期で実行）
      await new Promise(resolve => setTimeout(resolve, 10)); // UIの応答性確保
      const newPassword = generatePassword(settings);
      setPassword(newPassword);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "パスワード生成に失敗しました";
      setError(errorMessage);
      setPassword("");
    } finally {
      setIsGenerating(false);
    }
  }, [settings]);

  // 設定変更ハンドラー
  const handleSettingsChange = useCallback((newSettings: PasswordSettings) => {
    setSettings(newSettings);
    setError(null); // 設定変更時にエラーをクリア
    
    // 設定を保存
    saveSettings(newSettings);
  }, []);

  // 初期パスワード生成
  useEffect(() => {
    void handleGenerate();
  }, [handleGenerate]);

  return (
    <div className={className}>
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Heading level={1} className="text-3xl font-bold text-zinc-950 dark:text-white">
            パスワード ジェネレーター
          </Heading>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            セキュアで強力なパスワードを簡単に生成できます
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <div className="text-sm text-red-700 dark:text-red-300">
              <strong>エラー:</strong> {error}
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 左側: パスワード設定 */}
          <div>
            <PasswordControls
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onGenerate={handleGenerate}
            />
          </div>

          {/* 右側: パスワード表示と強度 */}
          <div className="space-y-6">
            {/* パスワード表示 */}
            <PasswordDisplay
              password={password}
              strength={passwordStrength}
            />

            {/* パスワード強度表示 */}
            {password && (
              <Fieldset>
                <Heading level={2}>パスワード強度</Heading>
                <div className="mt-4">
                  <PasswordStrengthDisplay
                    strength={passwordStrength}
                    showFeedback={true}
                  />
                </div>
              </Fieldset>
            )}

            {/* 生成ボタン（モバイル用の追加ボタン） */}
            <div className="lg:hidden">
              <Fieldset>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !validatePasswordSettings(settings).isValid}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-900"
                >
                  {isGenerating ? "生成中..." : "新しいパスワードを生成"}
                </button>
              </Fieldset>
            </div>
          </div>
        </div>

        {/* フッター情報 */}
        <div className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            このツールはブラウザ内でパスワードを生成します。
            <br />
            生成されたパスワードはサーバーに送信されません。
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * エラーバウンダリーコンポーネント
 */
export class PasswordGeneratorErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error("PasswordGenerator Error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <div className="text-sm text-red-700 dark:text-red-300">
              <strong>申し訳ありません。</strong>
              <br />
              パスワードジェネレーターでエラーが発生しました。
              <br />
              ページを再読み込みしてください。
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}