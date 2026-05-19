# beads セットアップスクリプト

## 概要

WebPot SI Docs の全工程成果物を beads に登録するためのスクリプト案です。

> **注意**: beads の実際のCLI構文は `bd create`, `bd update` 等ですが、
> 一部のオプション（`--metadata`, `--dep` 等）は beads v1.0.4 の実装状況により
> 調整が必要な場合があります。`bd --help` や `bd create --help` で確認してください。

---

## セットアップ手順

### Step 1: プロジェクト初期化

```bash
# プロジェクトディレクトリで初期化
cd /path/to/project
bd init
```

### Step 2: ラベル定義

```bash
# カテゴリラベル
bd label create "GUI" --color "#3498db"
bd label create "振舞い" --color "#2ecc71"
bd label create "データ" --color "#e67e22"
bd label create "アーキテクチャ" --color "#9b59b6"
bd label create "プレゼンテーション" --color "#1abc9c"
bd label create "サービス" --color "#f1c40f"
bd label create "参照" --color "#95a5a6"

# フェーズラベル
bd label create "010-要件定義" --color "#e74c3c"
bd label create "020-外部設計" --color "#3498db"
bd label create "031-基本設計" --color "#2ecc71"
bd label create "032-詳細設計" --color "#9b59b6"

# 必須区分ラベル
bd label create "必須" --color "#e74c3c"
bd label create "推奨" --color "#bdc3c7"
```

### Step 3: 工程成果物の登録（全件）

以下は各フェーズの工程成果物を Issue として登録するコマンド例です。

```bash
#!/bin/bash
# webpot-si-workflow-setup.sh
# WebPot SI Docs ワークフロー一括登録スクリプト

echo "===== プロジェクト Epic 作成 ====="
bd create "WebPot SI Docs 準拠開発プロジェクト" -t epic -p 0

echo "===== 010 要件定義 ====="
bd create "010 要件定義" -t epic -p 0
bd create "G01010 レイアウト共通ルール" -t task -p 0
bd create "G01020 共通CSSファイル" -t task -p 2
bd create "G01030 共通イメージファイル" -t task -p 2
bd create "G01040 共通JavaScriptファイル" -t task -p 2
bd create "G01050 共通画面モックアップ(HTML)" -t task -p 2
bd create "G01060 画面モックアップ用サンプル(HTML)" -t task -p 2
bd create "B01010 システム振舞い共通ルール" -t task -p 0
bd create "B01020 システム化業務一覧" -t task -p 0
bd create "B01030 システム化業務フロー" -t task -p 0
bd create "B01040 システム化業務説明" -t task -p 2
bd create "B01050 システム化業務シナリオ記述" -t task -p 2
bd create "A01010 非機能要件一覧" -t task -p 2

echo "===== 020 外部設計 ====="
bd create "020 外部設計" -t epic -p 0
bd create "G02010 画面一覧" -t task -p 0
bd create "G02020 画面遷移" -t task -p 0
bd create "G02030 画面レイアウト" -t task -p 0
bd create "G02040 画面入出力項目一覧" -t task -p 0
bd create "G02050 画面アクション明細" -t task -p 0
bd create "G02060 画面モックアップ(HTML)" -t task -p 0
bd create "G02070 メッセージ一覧" -t task -p 0
bd create "B02010 システムコンテキストダイアグラム" -t task -p 0
bd create "B02020 アクタ定義/ロール定義" -t task -p 0
bd create "B02030 ユースケース図" -t task -p 0
bd create "B02040 ユースケース記述" -t task -p 0
bd create "B02050 ユースケースシナリオ記述" -t task -p 2
bd create "D02010 データ辞書(論理モデル)" -t task -p 0
bd create "D02020 ER図(論理モデル)" -t task -p 0
bd create "D02030 エンティティ一覧(論理モデル)" -t task -p 0
bd create "D02040 エンティティ定義(論理モデル)" -t task -p 0
bd create "D02050 CRUD図(論理モデル)" -t task -p 2
bd create "D02060 ファイル一覧・定義" -t task -p 0
bd create "A02010 システム構成/ノード配置" -t task -p 0
bd create "A02020 ノード別構成" -t task -p 0
bd create "A02030 アーキテクチャ方針" -t task -p 0

echo "===== 031 基本設計 ====="
bd create "031 基本設計" -t epic -p 0
bd create "P03110 HTML(Velocityテンプレート)" -t task -p 0
bd create "P03120 CSSファイル" -t task -p 0
bd create "P03130 イメージファイル" -t task -p 0
bd create "P03140 JavaScriptファイル" -t task -p 2
bd create "P03150 コンポーネント遷移図(画面・アクション)" -t task -p 0
bd create "A03110 ソフトウェア論理構成" -t task -p 0
bd create "A03120 ソフトウェア物理構成" -t task -p 0
bd create "A03130 ソフトウェア実現方針" -t task -p 0
bd create "R03120 実装成果物ネーミングルール" -t task -p 0

echo "===== 032 詳細設計 ====="
bd create "032 詳細設計" -t epic -p 0
bd create "P03210 JavaScript関数仕様詳細" -t task -p 0
bd create "P03220 アクションクラス仕様詳細" -t task -p 0
bd create "P03230 チェッククラス仕様詳細" -t task -p 0
bd create "P03240 プロパティファイル仕様詳細" -t task -p 0
bd create "S03210 クラス図(サービス・DAO)" -t task -p 0
bd create "S03220 サービスインターフェイス仕様詳細" -t task -p 0
bd create "S03230 サービス実装クラス仕様詳細" -t task -p 0
bd create "S03240 DAOインターフェイス仕様詳細" -t task -p 0
bd create "S03250 DAO実装クラス仕様詳細" -t task -p 0
bd create "S03260 DTOクラス仕様詳細" -t task -p 0
bd create "S03270 共通インターフェイス仕様詳細" -t task -p 0
bd create "S03280 共通クラス仕様詳細" -t task -p 0
bd create "D03210 データベース定義" -t task -p 2
bd create "D03220 表領域一覧/定義" -t task -p 0
bd create "D03230 ユーザ・ロール一覧/定義" -t task -p 0
bd create "D03240 テーブル一覧/定義" -t task -p 0
bd create "D03250 ビュー一覧/定義" -t task -p 0
bd create "D03260 インデックス一覧/定義" -t task -p 0
bd create "D03270 制約一覧/定義" -t task -p 2
bd create "T03210 クラス仕様詳細" -t task -p 0
bd create "T03220 インターフェイス仕様詳細" -t task -p 0

echo "===== 全フェーズ共通 ====="
bd create "R00010 用語集" -t task -p 0

echo "===== 登録完了 ====="
bd list --json | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Total issues: {len(d)}')"
```

### Step 4: 依存関係の設定

依存関係は Issue 作成後、実際の beads ID を使って設定します。

```bash
#!/bin/bash
# webpot-si-deps-setup.sh
# 依存関係設定スクリプト（IDは実際の値に置換すること）

# 使用方法:
# 1. bd list --json で全Issueの ID とタイトルを取得
# 2. 以下のコマンドの <ID> を実際の beads ID に置換
# 3. スクリプトを実行

# === 010→020 フェーズ間 ===
# bd dep add <B02010_ID> <B01010_ID>  # コンテキスト図 ← 振舞い共通ルール
# bd dep add <B02030_ID> <B01020_ID>  # UC図 ← 業務一覧
# bd dep add <B02040_ID> <B01030_ID>  # UC記述 ← 業務フロー
# bd dep add <G02010_ID> <G01010_ID>  # 画面一覧 ← レイアウト共通ルール
# bd dep add <A02010_ID> <A01010_ID>  # システム構成 ← 非機能要件

# === 020 フェーズ内 ===
# bd dep add <B02020_ID> <B02010_ID>  # アクタ定義 ← コンテキスト図
# bd dep add <B02030_ID> <B02020_ID>  # UC図 ← アクタ定義
# bd dep add <B02040_ID> <B02030_ID>  # UC記述 ← UC図
# bd dep add <G02010_ID> <B02040_ID>  # 画面一覧 ← UC記述
# bd dep add <G02020_ID> <G02010_ID>  # 画面遷移 ← 画面一覧
# bd dep add <G02030_ID> <G02010_ID>  # 画面レイアウト ← 画面一覧
# bd dep add <G02040_ID> <G02030_ID>  # 入出力項目 ← 画面レイアウト
# bd dep add <G02050_ID> <G02030_ID>  # アクション明細 ← 画面レイアウト
# bd dep add <D02030_ID> <D02020_ID>  # エンティティ一覧 ← ER図
# bd dep add <D02050_ID> <D02020_ID>  # CRUD図 ← ER図
# bd dep add <D02050_ID> <B02040_ID>  # CRUD図 ← UC記述
# bd dep add <A02020_ID> <A02010_ID>  # ノード別構成 ← システム構成

# === 020→031 フェーズ間 ===
# bd dep add <P03110_ID> <G02060_ID>  # HTML ← モックアップ
# bd dep add <P03150_ID> <G02050_ID>  # 遷移図 ← アクション明細
# bd dep add <A03110_ID> <A02030_ID>  # SW論理構成 ← アーキ方針

# === 031 フェーズ内 ===
# bd dep add <A03120_ID> <A03110_ID>  # SW物理構成 ← SW論理構成
# bd dep add <A03130_ID> <A03110_ID>  # SW実現方針 ← SW論理構成

# === 031→032 フェーズ間 ===
# bd dep add <P03210_ID> <P03150_ID>  # JS仕様 ← 遷移図
# bd dep add <S03210_ID> <A03130_ID>  # クラス図 ← SW実現方針
# bd dep add <D03240_ID> <D02020_ID>  # テーブル定義 ← ER図(論理)
# bd dep add <D03210_ID> <A02020_ID>  # DB定義 ← ノード別構成

# === 032 フェーズ内 ===
# bd dep add <S03220_ID> <S03210_ID>  # サービスIF ← クラス図
# bd dep add <T03210_ID> <S03210_ID>  # クラス仕様 ← クラス図
# bd dep add <D03250_ID> <D03240_ID>  # ビュー定義 ← テーブル定義
# bd dep add <D03260_ID> <D03240_ID>  # インデックス定義 ← テーブル定義

echo "依存関係の設定完了"
```

---

## 運用コマンド早見表

| 操作 | コマンド |
|------|---------|
| 着手可能タスク確認 | `bd ready` |
| ワークフローコンテキスト取得 | `bd prime` |
| タスク一覧 | `bd list` |
| タスクの詳細確認 | `bd show <ID>` |
| タスク着手 | `bd update <ID> --claim` |
| タスク完了 | `bd close <ID>` |
| タスク再開 | `bd reopen <ID>` |
| コメント追加 | `bd comment <ID> "レビュー完了"` |
| 依存関係グラフ | `bd graph` |
| JSON出力 | `bd list --json` |
