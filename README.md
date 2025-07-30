# パスワード生成ツール

## 概要
セキュアで使いやすいパスワード生成ツールです。暗号学的に安全な乱数生成器を使用し、カスタマイズ可能な設定でユーザーが強力なパスワードを簡単に作成できます。

## 技術スタック
- フレームワーク: Next.js 15.4.4
- 言語: TypeScript 5 + React 19.1.0
- スタイリング: Tailwind CSS v4
- UIコンポーネント: Headless UI v2.2.0
- アニメーション: Framer Motion v11.15.0
- 品質管理: ESLint, Prettier
- フォント: Geist Sans & Geist Mono

## セットアップ
```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# 品質チェック
pnpm lint
```

## 開発ガイドライン

### コード品質基準
- ESLint: `pnpm lint` でエラー0件
- Prettier: 全コードがフォーマット済み
- Tailwind CSS: ユーティリティクラスのみ使用
- TypeScript: anyタイプ禁止、strict mode

### 利用可能なコンポーネント
- **UI基盤**: Button, Input, Select, Switch, Checkbox, Radio
- **フィードバック**: Alert, Badge, Dialog
- **レイアウト**: Navbar, Sidebar, Fieldset, Divider
- **データ表示**: Table, Description List, Pagination
- **フォーム**: Textarea, Combobox, Listbox
- **ナビゲーション**: Link, Dropdown
- **その他**: Avatar, Heading, Text

## 機能一覧

### 必須機能
- パスワード長設定（4～128文字）
- 文字種別選択（大文字・小文字・数字・記号）
- セキュアな乱数生成（Web Crypto API）
- クリップボードコピー
- パスワード強度表示
- レスポンシブデザイン

### オプション機能
- パスワード履歴（セッション内）
- 複数パスワード一括生成
- 設定プリセット保存
- 類似文字除外オプション
- ダークモード対応

## セキュリティ
- 暗号学的に安全な乱数生成器（crypto.getRandomValues）使用
- クライアントサイドのみでの処理
- パスワードの永続化なし
- XSS攻撃からの保護

## プロジェクト構造
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
└── components/            # 再利用可能コンポーネント
    ├── alert.tsx
    ├── button.tsx
    ├── input.tsx
    └── [その他のUIコンポーネント]
```

## ライセンス
MIT
