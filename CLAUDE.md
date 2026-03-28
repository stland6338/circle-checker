# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

同人イベント「SHINY STAR FESTIVAL 10」（2026/3/29開催）のサークルチェッカーWebアプリ。スマホで使えるサークル一覧＆ブックマーク機能を提供する。イベント専用の静的SPA（サーバーなし）。

## コマンド

```bash
npm run dev        # 開発サーバー起動 (Vite, port 5173)
npm run build      # プロダクションビルド (dist/ に出力)
npm run preview    # ビルド結果のプレビュー
npx tsc --noEmit   # TypeScript型チェック
```

### データ更新（サークル情報の再取得）

```bash
curl -s 'https://idolstarfes.com/283/10list_0112.html' | iconv -f SHIFT_JIS -t UTF-8 > /tmp/ssf10.html
python3 scripts/scrape.py /tmp/ssf10.html > src/data/circles.json
```

## 技術スタック

- React 18 + TypeScript + Vite
- Tailwind CSS v4（`@tailwindcss/vite` プラグイン）
- データ: 静的JSON（`src/data/circles.json`、314サークル）
- ブックマーク: localStorage（キー: `ssf10-bookmarks`）
- ホスティング: Vercel（予定）

## アーキテクチャ

```
src/
  App.tsx              # メインコンポーネント（検索・フィルター・タブ制御）
  types.ts             # Circle型定義
  data/circles.json    # サークルデータ（スクレイピング生成）
  hooks/useBookmarks.ts # ブックマーク管理（localStorage連携）
  components/
    CircleCard.tsx     # サークルカード（展開式、ブックマーク★）
    SearchBar.tsx      # キーワード検索入力
    CharacterFilter.tsx # キャラクター名フィルターチップ
    TabNav.tsx         # 下部タブナビ（全サークル / ブクマ）
scripts/
  scrape.py            # 元サイトHTMLからcircles.jsonを生成
```

### データフロー

1. `scrape.py` が元サイト（Shift_JIS HTML）をパースして `circles.json` を生成
2. `App.tsx` がJSONをインポートし、検索・キャラフィルター・タブでフィルタリング
3. ブックマークは `useBookmarks` フックで localStorage に永続化

### キャラクター画像名マッピング

元サイトのキャラアイコン画像ファイル名（例: `tenka.png`）とキャラ名の対応は `scripts/scrape.py` の `IMG_TO_CHARACTER` に定義。29キャラクター。

## 開発ワークフロー

このプロジェクトは「プチ仕様駆動開発」で進める。

### ドキュメント構成

| ファイル | 役割 | 更新タイミング |
|----------|------|----------------|
| `docs/PLAN.md` | やりたいことの原液 | プロジェクト開始時 |
| `docs/SPEC.md` | 仕様の壁打ち結果 | 設計フェーズ |
| `docs/TODO.md` | タスク管理 | 常時更新 |
| `docs/KNOWLEDGE.md` | 学び・ナレッジ | 随時追記 |

### セッション開始時のルーティン

1. `docs/TODO.md` を読んで現在の進捗を把握する
2. `docs/KNOWLEDGE.md` を読んで過去の学びを把握する
3. 必要に応じて `docs/SPEC.md` を参照する

### 作業ルール

- 実装前に必ず `docs/SPEC.md` で仕様を確認する
- タスク完了時は `docs/TODO.md` を更新する
- 新しい学びがあれば `docs/KNOWLEDGE.md` に追記する
- 不明点は推測で進めず確認を取る
