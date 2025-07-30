# 詳細設計書 - パスワード生成ツール

## 1. アーキテクチャ概要

### 1.1 システム構成図

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                     │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router (src/app/)                         │
│  ├── page.tsx (パスワード生成ページ)                     │
│  ├── layout.tsx (ルートレイアウト)                       │
│  └── globals.css (ダークモード設定)                      │
├─────────────────────────────────────────────────────────┤
│  Components Layer (src/components/)                     │
│  ├── [既存] Button, Input, Switch, Fieldset...         │
│  ├── [新規] PasswordGenerator (メインコンポーネント)      │
│  ├── [新規] PasswordDisplay (パスワード表示)            │
│  ├── [新規] PasswordControls (設定コントロール)          │
│  ├── [新規] PasswordStrength (強度表示)                 │
│  └── [新規] PasswordHistory (履歴表示)                   │
├─────────────────────────────────────────────────────────┤
│  Logic Layer (utils/)                                   │
│  ├── passwordGenerator.ts (パスワード生成ロジック)        │
│  ├── passwordStrength.ts (強度計算)                     │
│  ├── clipboard.ts (クリップボード操作)                   │
│  └── types.ts (型定義)                                  │
├─────────────────────────────────────────────────────────┤
│  Browser APIs                                           │
│  ├── Web Crypto API (crypto.getRandomValues)           │
│  ├── Clipboard API (navigator.clipboard)                │
│  └── Local Storage (設定保存)                           │
└─────────────────────────────────────────────────────────┘
```

### 1.2 技術スタック

- **言語**: TypeScript 5 (strict mode)
- **フレームワーク**: Next.js 15.4.4 (App Router)
- **UIライブラリ**: @headlessui/react v2.2.0
- **スタイリング**: Tailwind CSS v4 (白基調、ダークモード自動反転)
- **アニメーション**: Framer Motion v11.15.0
- **状態管理**: React hooks (useState, useEffect, useCallback)
- **ビルドツール**: pnpm, Next.js built-in bundler
- **コード品質**: ESLint (strict) + Prettier + TypeScript strict

## 2. コンポーネント設計

### 2.1 既存コンポーネントの活用

| 既存コンポーネント | 用途 | 活用方法 |
| ----------------- | ---- | -------- |
| Button | アクション実行 | 生成ボタン、コピーボタン、再生成ボタン |
| Input | 数値入力 | パスワード長の入力 |
| Switch | オン/オフ切り替え | 文字種別の選択、オプション設定 |
| Fieldset | フォームグループ化 | 設定セクションのグループ化 |
| Heading | セクションタイトル | 各設定セクションのタイトル |
| Text | テキスト表示 | 説明文、ラベル |
| Badge | ステータス表示 | パスワード強度の表示 |
| Alert | 通知表示 | エラーメッセージ、成功通知 |

### 2.2 新規コンポーネント一覧

| コンポーネント名 | 責務 | 依存関係 | 既存コンポーネントの活用 |
| ---------------- | ---- | -------- | ----------------------- |
| PasswordGenerator | メインコンテナ | PasswordDisplay, PasswordControls | Fieldset, Heading |
| PasswordDisplay | パスワード表示・コピー | clipboard.ts | Input, Button, Badge |
| PasswordControls | 生成設定UI | passwordGenerator.ts | Fieldset, Switch, Input, Text |
| PasswordStrength | 強度計算・表示 | passwordStrength.ts | Badge, Text |
| PasswordHistory | 履歴表示 | Local Storage | Text, Button |

### 2.3 各コンポーネントの詳細

#### PasswordGenerator (メインコンテナ)

- **目的**: パスワード生成機能全体を統括するルートコンポーネント
- **公開インターフェース**:
  ```typescript
  interface PasswordGeneratorProps {
    className?: string;
    initialSettings?: PasswordSettings;
  }
  ```
- **内部実装方針**: 
  - React hooksで状態管理
  - 子コンポーネントへの prop drilling を最小化
  - エラーバウンダリーの実装

#### PasswordDisplay (パスワード表示)

- **目的**: 生成されたパスワードの表示とクリップボードコピー機能
- **公開インターフェース**:
  ```typescript
  interface PasswordDisplayProps {
    password: string;
    isVisible: boolean;
    onToggleVisibility: () => void;
    onCopy: () => Promise<void>;
    strength: PasswordStrength;
  }
  ```
- **内部実装方針**:
  - 既存のInputコンポーネントを読み取り専用で使用
  - Buttonコンポーネントでコピーアクション
  - アニメーションで視覚的フィードバック

#### PasswordControls (設定コントロール)

- **目的**: パスワード生成の各種設定UI
- **公開インターフェース**:
  ```typescript
  interface PasswordControlsProps {
    settings: PasswordSettings;
    onSettingsChange: (settings: PasswordSettings) => void;
    onGenerate: () => void;
  }
  ```
- **内部実装方針**:
  - Fieldsetで設定をグループ化
  - Switchコンポーネントで文字種選択
  - バリデーション機能を内蔵

## 3. データフロー

### 3.1 データフロー図

```
[User Input] → [PasswordControls] → [PasswordGenerator State]
                                          ↓
[Password Generation] ← [passwordGenerator.ts] ← [Settings State]
        ↓
[PasswordDisplay] → [Clipboard API] → [User Notification]
        ↓
[PasswordStrength] → [Badge Display]
        ↓
[PasswordHistory] → [Local Storage]
```

### 3.2 データ変換

- **入力データ形式**: PasswordSettings (length, charset flags, options)
- **処理過程**: Web Crypto API → character selection → password assembly
- **出力データ形式**: Generated password string + strength metrics

## 4. APIインターフェース

### 4.1 内部API

```typescript
// パスワード設定の型定義
interface PasswordSettings {
  length: number; // 4-128
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  symbolSet?: string;
}

// パスワード強度の型定義
interface PasswordStrength {
  score: number; // 0-4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  feedback: string[];
}

// パスワード生成関数
function generatePassword(settings: PasswordSettings): string;

// 強度計算関数  
function calculateStrength(password: string): PasswordStrength;

// クリップボードコピー関数
function copyToClipboard(text: string): Promise<boolean>;
```

### 4.2 外部API

- **Web Crypto API**: `crypto.getRandomValues()` でセキュアな乱数生成
- **Clipboard API**: `navigator.clipboard.writeText()` でコピー機能
- **Local Storage API**: 設定とセッション履歴の保存

## 5. エラーハンドリング

### 5.1 エラー分類

- **Web Crypto API エラー**: Graceful degradation with Math.random()
- **Clipboard API エラー**: Fallback to manual selection
- **バリデーションエラー**: リアルタイムフィードバックで予防
- **設定エラー**: デフォルト値への自動復旧

### 5.2 エラー通知

- Alertコンポーネントを使用したユーザーフレンドリーなエラー表示
- console.error でデバッグ情報のログ出力（本番では除去）

## 6. セキュリティ設計

### 6.1 データ保護

- **メモリ管理**: パスワード文字列は最低限の時間のみ保持
- **乱数生成**: Web Crypto APIによる暗号学的に安全な乱数
- **XSS対策**: React の自動エスケープと Content Security Policy
- **履歴管理**: sessionStorageのみ使用、永続化しない

### 6.2 プライバシー

- パスワードのサーバー送信なし
- 分析ツールへのパスワード情報送信なし
- ブラウザ履歴にパスワード情報を残さない

## 7. テスト戦略

### 7.1 単体テスト

- **カバレッジ目標**: 85%以上
- **テストフレームワーク**: Jest + React Testing Library
- **重点テスト項目**:
  - パスワード生成ロジック
  - 強度計算アルゴリズム
  - バリデーション機能

### 7.2 統合テスト

- ユーザーインタラクションフローのテスト
- クリップボード機能のモックテスト
- エラーハンドリングのシナリオテスト

## 8. パフォーマンス最適化

### 8.1 想定される負荷

- パスワード生成: 100ms以内 (要件)
- UI応答性: 16ms以内 (60fps維持)
- 大量生成: 1000個まで対応

### 8.2 最適化方針

- `useCallback` でイベントハンドラーの再生成を防止
- `useMemo` で強度計算の重複実行を防止
- Web Workers での大量生成処理 (将来実装)

## 9. デプロイメント

### 9.1 デプロイ構成

- **静的サイト生成**: Next.js の static export
- **CDN配信**: Vercel または Netlify での高速配信
- **PWA対応**: 将来実装でオフライン機能

### 9.2 設定管理

- 環境変数なし (全てクライアントサイド)
- ビルド時設定の最適化

## 10. UI/UX設計

### 10.1 デザインシステムの活用

- **カラーテーマ**: 白基調 (`bg-white`) + ダークモード自動反転
- **既存パレット活用**: 
  - プライマリ: `blue-600` (生成ボタン)
  - セカンダリ: `zinc-600` (設定UI)  
  - 成功: `green-600` (強度表示)
  - 警告: `amber-600` (弱いパスワード)
  - エラー: `red-600` (エラー表示)
- **タイポグラフィ**: Geist Sans (UI) + Geist Mono (パスワード表示)
- **既存コンポーネントのスタイル統一**: Button, Input, Switch の既存スタイルを継承

### 10.2 レスポンシブデザイン

- **モバイルファースト**: sm: (640px+) でデスクトップ対応
- **ブレークポイント**: 
  - モバイル: 〜639px (縦配置、大きなタッチターゲット)
  - デスクトップ: 640px+ (横配置、効率的なレイアウト)

### 10.3 ダークモード対応

- **自動切り替え**: CSS `prefers-color-scheme` で自動検出
- **カスタムプロパティ**: `--background`, `--foreground` を活用
- **コンポーネント対応**: 既存コンポーネントのdark:バリアント活用

## 11. コーディング規約

### 11.1 必須ツールの使用

- **ESLint**: TypeScript strict + React hooks + a11y rules
- **Prettier**: 80文字幅、セミコロンあり、ダブルクォート
- **Tailwind CSS**: ユーティリティクラスのみ、カスタムCSS禁止

### 11.2 コード品質チェック

実装完了後に必須実行:
```bash
pnpm lint     # ESLint エラー0件必須
pnpm build    # ビルド成功必須  
pnpm format   # Prettier フォーマット
```

### 11.3 TypeScript規約

- `any` タイプ使用禁止
- `unknown` の適切な活用
- strict mode 設定準拠
- export type での型のみエクスポート

## 12. 実装上の注意事項

### 12.1 既存資産の活用

- **コンポーネント再利用**: 25個の既存コンポーネントを最大限活用
- **スタイル継承**: 既存のcolor palette、spacing、typography を継承
- **パターン踏襲**: forwardRef、clsx、Headless UI パターンの踏襲

### 12.2 セキュリティ最優先

- **Web Crypto API**: 必須使用、fallback の実装
- **メモリ管理**: パスワード文字列の適切なライフサイクル管理
- **永続化禁止**: パスワードのlocalStorage保存厳禁

### 12.3 アクセシビリティ

- **キーボードナビゲーション**: 全機能をキーボードで操作可能
- **スクリーンリーダー**: 適切な aria-label、role の設定
- **コントラスト比**: WCAG 2.1 AA準拠 (4.5:1以上)

### 12.4 パフォーマンス

- **メモ化**: 重い計算処理の適切なメモ化
- **バンドルサイズ**: 不要なライブラリの読み込み回避
- **レンダリング最適化**: 不要な再レンダリング防止

## 13. 実装フェーズ

### Phase 1: 基盤実装
1. 型定義とユーティリティ関数
2. パスワード生成ロジック
3. 基本UIコンポーネント

### Phase 2: 機能拡張  
1. パスワード強度表示
2. クリップボード機能
3. 設定の永続化

### Phase 3: UX向上
1. パスワード履歴
2. アニメーション
3. プリセット機能

各フェーズ完了時にlint/build/テストの実行を必須とする。