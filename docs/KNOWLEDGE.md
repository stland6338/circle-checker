# KNOWLEDGE: circle-checker

> 作成日: 2026-03-28

---

## トラブルシューティング

（まだなし — 開発中に問題が発生したら記録する）

---

## 技術的な学び

- 元サイト（idolstarfes.com）のサークルリストは314サークル掲載
- 元サイトは **Shift_JIS** エンコーディング。`iconv -f SHIFT_JIS -t UTF-8` で変換が必要
- HTML構造: `<table>` 内の `<tr>` が1サークル。ヘッダー/セクション区切り行は `bgcolor="#80a2fd"` で識別
- セクション区切り: 「◆あ行」「◆か行」...「◆や・ら・わ行」の8セクション（50音順）
- キャラクターアイコンは `img/<名前>.png` 形式。28種類のキャラ画像ファイル→29キャラにマッピング
  - `natuha` と `meguru` は別画像だが実は同一キャラの可能性あり（要確認）
- プロデュースアイドルの背景色でユニットを識別可能（6ユニット＋コメティック）
- 偶数行は `bgcolor="#c2e0fe"` でストライプ表示
- HOME列のリンクは Pixiv以外に booth.pm, note.com, wixsite 等も含まれる

---

## 設計判断の記録

- **静的SPA（サーバーなし）を選択:** 314件程度のデータなのでJSONバンドルで十分。サーバーコスト不要。
- **localStorage でブックマーク管理:** ユーザー認証を省略できる。友人間の共有はURL共有で十分。
- **React + Vite + Tailwind CSS v4:** 軽量な構成。イベント専用なので過剰な技術は避ける。
- **Tailwind v4:** `@tailwindcss/vite` プラグイン使用。`tailwind.config.js` は不要（CSS内の `@import "tailwindcss"` で完結）。

---

## 環境・セットアップのメモ

- Node.js でのフロントエンド開発
- Python3 はスクレイピング用（BeautifulSoup不要、標準ライブラリのHTMLParserで十分だった）
- ビルド出力: `dist/` ディレクトリ（約80KB gzip）

---

## 参考リンク

- イベント公式サークルリスト: https://idolstarfes.com/283/10list_0112.html
- イベント名: SHINY STAR FESTIVAL 10（2026/3/29開催）
