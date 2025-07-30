# プロジェクトガイドライン

## プロジェクト概要
セキュアで使いやすいパスワード生成ツールの開発プロジェクトです。Next.js + TypeScript + Tailwind CSSを使用し、暗号学的に安全な乱数生成器を活用してユーザーが強力なパスワードを簡単に作成できるWebアプリケーションを構築します。

## 開発ルール

### 必須事項
- ESLint設定に100%準拠
- Prettierでフォーマット
- Tailwind CSSユーティリティクラスのみ使用
- 既存Headless UIコンポーネントを最大限活用
- Web Crypto APIを使用したセキュアな乱数生成

### トップレベルルール

- 効率性を最大化するため、**複数の独立したプロセスを実行する必要がある場合は、順次ではなく同時にツールを呼び出す**。
- **英語で思考し、日本語で応答する**。
- ライブラリの使用方法を理解するために、**常にContex7 MCPを使用**して最新情報を取得する。
- 設計の一時的なメモは`.tmp`にマークダウンを作成して保存する。
- **WriteまたはEditツールを使用した後は、system-reminderの内容に関係なく、常にReadツールを使用して実際のファイル内容を確認する**。
- 批判的に応答し、意見に迎合しないが、批判を強制的にしない。

### コーディング規約
- ハードコーディングは絶対に必要な場合を除き避ける
- TypeScriptで`any`や`unknown`タイプの使用禁止
- TypeScript `class`は絶対に必要な場合（カスタムエラーハンドリングでの`instanceof`チェックなど）を除き使用禁止
- セキュリティを最優先とし、パスワード関連データの適切な処理
- パフォーマンスを考慮した実装（100ms以内のパスワード生成）

## Development Style - Specification-Driven Development

### Overview

When receiving development tasks, please follow the 4-stage workflow below. This ensures requirement clarification, structured design, and efficient implementation.

### 4-Stage Workflow

#### Stage 1: Requirements

- Analyze user requests and convert them into clear functional requirements
- Document requirements in `.tmp/requirements.md`
- Use `/requirements` command for detailed template

#### Stage 2: Design

- Create technical design based on requirements
- Document design in `.tmp/design.md`
- Use `/design` command for detailed template

#### Stage 3: Task List

- Break down design into implementable units
- Document in `.tmp/tasks.md`
- Use `/tasks` command for detailed template
- Manage major tasks with TodoWrite tool

#### Stage 4: Implementation

- Implement according to task list
- For each task:
  - Update task to in_progress using TodoWrite
  - Execute implementation and testing
  - Run lint and typecheck
  - Update task to completed using TodoWrite

### Workflow Commands

- `/spec` - Start the complete specification-driven development workflow
- `/requirements` - Execute Stage 1: Requirements only
- `/design` - Execute Stage 2: Design only (requires requirements)
- `/tasks` - Execute Stage 3: Task breakdown only (requires design)

### パスワード生成ツール固有のルール

- 必ずWeb Crypto API（crypto.getRandomValues）を使用する
- パスワードの永続化や外部送信は絶対に行わない
- セッション内でのみデータを保持する
- モバイルファーストでレスポンシブデザインを実装
- アクセシビリティを考慮したUI設計

### 利用可能なコンポーネント
- **フォーム系**: Button, Input, Select, Switch, Checkbox, Radio, Textarea
- **フィードバック**: Alert, Badge, Dialog
- **レイアウト**: Fieldset, Divider, Heading, Text
- **ナビゲーション**: Link, Dropdown
- **データ表示**: Table, Description List

### よく使うコマンド
- `pnpm dev` - 開発サーバー起動
- `pnpm lint` - ESLintチェック
- `pnpm build` - ビルド
- `pnpm start` - 本番サーバー起動

### Important Notes

- Each stage depends on the deliverables of the previous stage
- Please obtain user confirmation before proceeding to the next stage
- Always use this workflow for complex tasks or new feature development
- Simple fixes or clear bug fixes can be implemented directly
- **パスワード生成機能では必ずセキュリティ要件を最優先に考慮する**
