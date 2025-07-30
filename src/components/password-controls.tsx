"use client";

import React from "react";
import { Button } from "./button";
import { Fieldset } from "./fieldset";
import { Heading } from "./heading";
import { Input } from "./input";
import { Switch, SwitchField } from "./switch";
import { Text } from "./text";
import { 
  DEFAULT_PASSWORD_SETTINGS,
  type PasswordSettings,
} from "@/types/password";
import { validatePasswordSettings } from "@/utils";

type PasswordControlsProps = {
  settings: PasswordSettings;
  onSettingsChange: (settings: PasswordSettings) => void;
  onGenerate: () => void;
  className?: string;
};

export function PasswordControls({
  settings,
  onSettingsChange,
  onGenerate,
  className,
}: PasswordControlsProps) {
  const validation = validatePasswordSettings(settings);

  const handleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const length = Math.min(128, Math.max(4, Number(event.target.value) || 4));
    onSettingsChange({ ...settings, length });
  };

  const handleCharTypeChange = (
    field: keyof Pick<
      PasswordSettings,
      "includeUppercase" | "includeLowercase" | "includeNumbers" | "includeSymbols"
    >
  ) => (checked: boolean) => {
    onSettingsChange({ ...settings, [field]: checked });
  };

  const handleExcludeSimilarChange = (checked: boolean) => {
    onSettingsChange({ ...settings, excludeSimilar: checked });
  };

  const handleReset = () => {
    onSettingsChange(DEFAULT_PASSWORD_SETTINGS);
  };

  return (
    <div className={className}>
      <Fieldset>
        <Heading level={2}>パスワード設定</Heading>
        
        {/* パスワード長設定 */}
        <Fieldset>
          <Text className="text-sm font-medium text-zinc-950 dark:text-white">
            パスワード長: {settings.length}文字
          </Text>
          <Input
            type="number"
            min={4}
            max={128}
            value={settings.length}
            onChange={handleLengthChange}
            className="mt-2"
          />
          <Text className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            4文字から128文字まで設定できます
          </Text>
        </Fieldset>

        {/* 文字種選択 */}
        <Fieldset className="mt-6">
          <Heading level={3} className="text-base">
            使用する文字種
          </Heading>
          
          <div className="mt-4 space-y-4">
            <SwitchField>
              <Switch
                checked={settings.includeUppercase}
                onChange={handleCharTypeChange("includeUppercase")}
              />
              <Text className="text-sm">
                大文字 (A-Z)
              </Text>
            </SwitchField>

            <SwitchField>
              <Switch
                checked={settings.includeLowercase}
                onChange={handleCharTypeChange("includeLowercase")}
              />
              <Text className="text-sm">
                小文字 (a-z)
              </Text>
            </SwitchField>

            <SwitchField>
              <Switch
                checked={settings.includeNumbers}
                onChange={handleCharTypeChange("includeNumbers")}
              />
              <Text className="text-sm">
                数字 (0-9)
              </Text>
            </SwitchField>

            <SwitchField>
              <Switch
                checked={settings.includeSymbols}
                onChange={handleCharTypeChange("includeSymbols")}
              />
              <Text className="text-sm">
                記号 (!@#$%^&*...)
              </Text>
            </SwitchField>
          </div>
        </Fieldset>

        {/* オプション設定 */}
        <Fieldset className="mt-6">
          <Heading level={3} className="text-base">
            オプション
          </Heading>
          
          <div className="mt-4">
            <SwitchField>
              <Switch
                checked={settings.excludeSimilar}
                onChange={handleExcludeSimilarChange}
              />
              <div>
                <Text className="text-sm">
                  類似文字を除外
                </Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                  0/O, 1/l/I などの紛らわしい文字を除外します
                </Text>
              </div>
            </SwitchField>
          </div>
        </Fieldset>

        {/* エラー表示 */}
        {!validation.isValid && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <Text className="text-sm text-red-700 dark:text-red-300">
              {validation.errors.join(", ")}
            </Text>
          </div>
        )}

        {/* アクションボタン */}
        <div className="mt-6 flex gap-3">
          <Button
            color="blue"
            onClick={onGenerate}
            disabled={!validation.isValid}
            className="flex-1"
          >
            パスワード生成
          </Button>
          <Button
            outline
            onClick={handleReset}
            className="px-4"
          >
            リセット
          </Button>
        </div>
      </Fieldset>
    </div>
  );
}