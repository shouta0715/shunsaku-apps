---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Create requirements specification for the given task (Stage 1 of Spec-Driven Development)
---

## Context

- Task description: $ARGUMENTS

## Your task

### 1. Create directory

- Create `.tmp` directory if it doesn't exist

### 2. Analyze the user's request

Carefully analyze the provided task description and extract:

- The core problem to be solved
- Implicit requirements not explicitly stated
- Potential edge cases and constraints
- Success criteria

### 3. Create Requirements Document

Create `.tmp/requirements.md` with the following sections:

```markdown
# 要件定義書 - [タスク名]

## 1. 目的

[このタスク/プロジェクトの目的を明確に記述]

## 2. 機能要件

### 2.1 必須機能

- [ ] [機能1の詳細説明]
- [ ] [機能2の詳細説明]
      ...

### 2.2 オプション機能

- [ ] [将来的に実装可能な機能]
      ...

## 3. 非機能要件

### 3.1 パフォーマンス

- [応答時間、処理速度などの要件]

### 3.2 セキュリティ

- [セキュリティに関する要件]

### 3.3 保守性

- [コードの保守性に関する要件]

### 3.4 コード品質基準

- **ESLint**: プロジェクトのESLint設定に100%準拠すること
- **Prettier**: 全コードがPrettierでフォーマットされていること
- **Tailwind CSS**: Tailwindのユーティリティクラスのみを使用し、カスタムCSSは最小限に抑えること

### 3.5 互換性

- [既存システムとの互換性要件]

## 4. 制約事項

### 4.1 技術的制約

- [使用技術、ライブラリの制約]
- **必須**: ESLint、Prettier、Tailwind CSSの設定に従うこと
- **必須**: `npm run lint`と`npm run build`がエラーなく実行できること

### 4.2 ビジネス制約

- [納期、予算などの制約]

## 5. 成功基準

### 5.1 完了の定義

- [ ] [明確な完了条件1]
- [ ] [明確な完了条件2]
      ...

### 5.2 受け入れテスト

- [ユーザーが満足する条件]

## 6. 想定されるリスク

- [実装上のリスクと対策]

## 7. 今後の検討事項

- [設計フェーズで詳細化すべき事項]
```

### 4. Create TODO entry

Use TodoWrite to add "要件定義の完了とレビュー" as a task

### 5. Create project documentation

#### 5.1 Create/Update README.md

Create or update `README.md` with the following structure:

```markdown
# [プロジェクト名]

## 概要
[要件定義から抽出したプロジェクトの目的と概要]

## 技術スタック
- フレームワーク: [検出したフレームワーク]
- 言語: [使用言語とバージョン]
- スタイリング: Tailwind CSS v4
- 品質管理: ESLint, Prettier
- [その他の主要ライブラリ]

## セットアップ
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 品質チェック
npm run lint
```

## 開発ガイドライン

### コード品質基準
- ESLint: `npm run lint` でエラー0件
- Prettier: 全コードがフォーマット済み
- Tailwind CSS: ユーティリティクラスのみ使用

### コンポーネント
[src/components/内の利用可能なコンポーネント一覧]

## 機能一覧
[要件定義から抽出した機能リスト]

## ライセンス
[ライセンス情報]
```

#### 5.2 Create/Update CLAUDE.md

Create or update `.claude/CLAUDE.md` with project-specific rules:

```markdown
# プロジェクトガイドライン

## プロジェクト概要
[要件定義からの概要]

## 開発ルール

### 必須事項
- ESLint設定に100%準拠
- Prettierでフォーマット
- Tailwind CSSユーティリティクラスのみ使用
- 既存コンポーネントを最大限活用

### コーディング規約
- TypeScriptのanyタイプ禁止
- ハードコーディング最小化
- [プロジェクト固有のルール]

### ワークフロー
1. 要件定義 → 設計 → タスク分解 → 実装
2. 各タスク完了時に品質チェック実行
3. コミット前にlint/build確認

### 利用可能なコンポーネント
[src/components/の一覧と用途]

### よく使うコマンド
- `npm run dev` - 開発サーバー起動
- `npm run lint` - ESLintチェック
- `npm run build` - ビルド
```

### 6. Present to user

Show the created requirements document and ask for:

- Confirmation of understanding
- Any missing requirements
- Approval to proceed to design phase
- Review of generated README.md and CLAUDE.md

## Important Notes

- Be thorough in identifying implicit requirements
- Consider both current needs and future extensibility
- Use clear, unambiguous language
- Include measurable success criteria
- **MUST include code quality requirements (ESLint, Prettier, Tailwind CSS)**
- **All code must pass linting and formatting checks**
- **MUST generate/update README.md and CLAUDE.md based on requirements**
- **Documentation should serve as project memory for future Claude Code sessions**

think hard
