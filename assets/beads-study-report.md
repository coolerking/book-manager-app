# Beads (bd) 学習レポート

## 概要

**Beads** (`bd` コマンド) は、AIエージェント向けの分散型グラフ・イシュートラッカーです。  
[Dolt](https://github.com/dolthub/dolt)（バージョン管理機能付きSQLデータベース）をストレージバックエンドとして使用し、AIコーディングエージェントが長期タスクを構造化して管理するための「永続的なメモリ」を提供します。

- **リポジトリ**: https://github.com/gastownhall/beads
- **バージョン**: 1.0.4 (2026-05-07)
- **言語**: Go (1.26.2)
- **対応OS**: macOS, Linux, Windows, FreeBSD
- **ライセンス**: MIT

---

## プロジェクトの目的

従来のMarkdownベースのTODOリストやプラン管理の問題点を解決し、**依存関係を考慮したグラフ構造**でAIエージェントがコンテキストを失わずに長期タスクを処理できるようにすることが目的です。

---

## アーキテクチャ（3層構造）

```
┌─────────────────────────────────────────┐
│         CLI Layer (cmd/bd/)              │
│  Cobra-based commands, --json対応       │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│       Storage Layer (internal/)          │
│  Dolt SQL DB, バージョン管理付き        │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│     Remote Layer (Dolt push/pull)        │
│  DoltHub, S3, GCS, filesystem           │
└─────────────────────────────────────────┘
```

### ストレージモード

| モード | 説明 |
|--------|------|
| **Embedded (デフォルト)** | Doltをインプロセスで実行。サーバー不要。単一ライター |
| **Server** | `dolt sql-server` に接続。複数ライター対応 |

---

## 主要機能

### 1. コア機能（イシュー管理）
- イシューの作成・更新・クローズ
- 依存関係グラフ（blocks, related, parent-child, discovered-from）
- ラベル、コメント、ステータス、優先度、アサイン管理
- 階層ID（`bd-a3f8` → `bd-a3f8.1` → `bd-a3f8.1.1`）

### 2. AI エージェント最適化
- **`--json`フラグ**: 全コマンドでJSON出力対応
- **`bd ready`**: ブロッカーのない次の作業を自動検出
- **`bd prime`**: ワークフローコンテキストとメモリの注入
- **`bd remember`**: 永続的なプロジェクトメモリ
- **原子的claim**: `bd update <id> --claim` で競合なくタスク取得

### 3. 分散・同期
- **Hash-based IDs**: `bd-a1b2` 形式でマージ衝突を防止
- **Cell-level merge**: Doltのセルレベル3-wayマージ
- **Dolt push/pull**: ネイティブ同期
- **Protected branches**: `refs/dolt/data` で独立管理

### 4. その他の特徴的機能
- **Compaction（コンパクション）**: 古いクローズ済みタスクをセマンティック要約で圧縮（コンテキストウィンドウ節約）
- **Messaging**: スレッド型メッセージ（`--thread`）、エフェメラルライフサイクル
- **Graph Links**: `relates_to`, `duplicates`, `supersedes`, `replies_to`
- **Stealth Mode**: gitリポジトリに影響を与えずローカルで使用
- **Federation**: 外部トラッカー（GitHub Issues, Jira, Linear, ADO）との連携

---

## 技術スタック

| 分野 | 技術 |
|------|------|
| 言語 | Go 1.26.2 |
| CLI framework | [Cobra](https://github.com/spf13/cobra) |
| 設定管理 | [Viper](https://github.com/spf13/viper) |
| データベース | [Dolt](https://github.com/dolthub/dolt) (dolthub/driver) |
| UI/TUI | [Lip Gloss](https://github.com/charmbracelet/lipgloss), [Glamour](https://github.com/charmbracelet/glamour), [Huh](https://github.com/charmbracelet/huh) |
| テスト | testify, testcontainers-go |
| テレメトリ | OpenTelemetry |
| MCP Server | Python (FastMCP) - PyPI: `beads-mcp` |
| パッケージ配布 | Homebrew, npm (`@beads/bd`), go install, install script |
| ビルドタグ | `gms_pure_go`（ICU依存を排除してポータビリティ確保） |

---

## ディレクトリ構成

```
beads/
├── cmd/bd/              # CLIコマンド群（約205ファイル）
│   ├── main.go          # エントリポイント
│   ├── create.go        # bd create
│   ├── list.go          # bd list
│   ├── ready.go         # bd ready
│   ├── show.go          # bd show
│   ├── close.go         # bd close
│   ├── doctor.go        # bd doctor (健康チェック)
│   └── ...
├── internal/
│   ├── types/           # コアデータ型 (Issue, Dependency, Label等)
│   ├── storage/         # ストレージ層
│   │   └── dolt/        # Dolt実装
│   ├── beads/           # コアビジネスロジック
│   ├── ui/              # Visual Design System (lipgloss styles)
│   ├── config/          # 設定管理
│   ├── hooks/           # Git hooks
│   ├── idgen/           # Hash-based ID生成
│   ├── molecules/       # Molecule (swarm coordination)
│   ├── formula/         # Formula (recipe execution)
│   ├── telemetry/       # OpenTelemetry計測
│   └── ...
├── integrations/
│   ├── beads-mcp/       # MCP Server (Python, FastMCP)
│   ├── claude-code/     # Claude Code統合
│   └── junie/           # JetBrains Junie統合
├── plugins/
│   └── beads/           # Claude/Codex プラグイン
├── examples/            # 使用例（14種類）
├── docs/                # ドキュメント群（40+ファイル）
├── scripts/             # ビルド・リリーススクリプト
├── website/             # ドキュメントサイト
├── npm-package/         # npm配布パッケージ
├── tests/               # 統合テスト
└── format/              # フォーマッター
```

---

## 主要コマンド一覧

| コマンド | 説明 |
|----------|------|
| `bd init` | プロジェクトにbeadsを初期化 |
| `bd create "Title" -p 0` | 新規イシュー作成 |
| `bd ready` | ブロッカーなしの作業一覧 |
| `bd show <id>` | イシュー詳細表示 |
| `bd update <id> --claim` | アトミックにタスクをクレーム |
| `bd close <id>` | イシューをクローズ |
| `bd dep add <child> <parent>` | 依存関係リンク |
| `bd prime` | エージェント向けコンテキスト注入 |
| `bd remember "insight"` | プロジェクトメモリ保存 |
| `bd doctor` | 健康チェック＆修復 |
| `bd dolt push/pull` | Doltリモート同期 |
| `bd setup <agent>` | エージェント別セットアップ |

---

## コアデータモデル（Issue構造体）

`internal/types/types.go` で定義される `Issue` 構造体の主要フィールド:

- **Core**: ID, ContentHash, Title, Description, Design, AcceptanceCriteria, Notes
- **Workflow**: Status, Priority, IssueType, Assignee, Owner
- **Timestamps**: CreatedAt, UpdatedAt, StartedAt, ClosedAt, DueAt, DeferUntil
- **External**: ExternalRef, SourceSystem (Federation連携)
- **Metadata**: 任意JSONデータ（拡張ポイント）
- **Compaction**: CompactionLevel, CompactedAt, OriginalSize
- **Messaging**: Sender, Ephemeral, WispType
- **Gate**: AwaitType, AwaitID, Timeout, Waiters (非同期協調)
- **Molecule**: MolType (swarm|patrol|work)

---

## 設計思想・原則

1. **Project Charter に基づくスコープ管理**: beadsはイシュートラッキングのプリミティブに専念し、オーケストレーション層のポリシーをエンコードしない
2. **Storage Boundary**: Doltがストレージを担当し、beads側にストレージエンジンロジックを持ち込まない
3. **Schema Boundary**: メタデータファースト。スキーマ変更は最後の手段
4. **CLI Design**: 認知負荷を最小化。新規コマンドより既存コマンドへのフラグ追加を優先
5. **Visual Design System**: 絵文字禁止、小さなUnicode記号 + セマンティックカラーで視認性確保

---

## 開発ワークフロー

```bash
# ビルド＆インストール
make install

# テスト実行
make test

# リンター
golangci-lint run ./...

# リリース (メンテナー向け)
./scripts/release.sh <version>
```

---

## MCP Server (beads-mcp)

Python製のMCPサーバーが `integrations/beads-mcp/` にあり、Claude DesktopやCopilot等からbeadsのイシュー管理機能をMCPプロトコル経由で利用可能です。

- フレームワーク: FastMCP 3.2.4
- PyPI: `beads-mcp`
- Python >= 3.10

---

## まとめ

Beadsは「AIエージェントのためのイシュートラッカー」として、以下の点で独自の位置づけを持つプロジェクトです:

1. **Dolt-powered**: バージョン管理されたSQLデータベースでgit-likeな分散協調が可能
2. **Agent-first**: JSON出力、依存関係追跡、自動ready検出でAIエージェントに最適化
3. **Zero-conflict**: Hash-based IDsでマルチエージェント/マルチブランチでの衝突を回避
4. **Composable**: MCP Server、プラグイン、CLI等さまざまなインターフェースで利用可能
5. **Production-ready**: v1.0.4、1,146のGoファイル、充実したドキュメントとテスト

Go 1.26 + Dolt + Cobra で構築された、かなり成熟した本格的なOSSプロジェクトです。
