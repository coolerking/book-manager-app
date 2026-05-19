# WebPot SI Docs 分析 & beads ワークフロー化検討レポート

## ファイル一覧

| ファイル | 内容 |
|---------|------|
| [01_WebPot_SI_Docs_概要.md](./01_WebPot_SI_Docs.md) | WebPot SI Docsの全体構造、フェーズ、工程成果物の一覧・分類・採番ルール |
| [02_beads_ワークフロー化検討.md](./02_beads.md) | beads (bd) によるワークフロー化の適合度評価、マッピング設計、運用フロー |
| [03_成果物依存関係マップ.md](./03_docmap.md) | 全工程成果物間の依存関係図（PlantUML/Mermaid）、カテゴリ別ライフサイクル |
| [04_サンプルアプリ分析.md](./04_sampleapp.md) | お弁当アプリケーションのUC図、画面構成、ER図、アーキテクチャ図 |
| [05_beads_セットアップスクリプト.md](./05_beads_setup.md) | beads への全成果物登録スクリプト案、依存関係設定、運用コマンド早見表 |

## 結論サマリ

beads (bd) を使って WebPot SI Docs のワークフローを構築することは **可能** です。

**適合する点:**
- フェーズ → Epic、工程成果物 → Issue の自然なマッピング
- 成果物間のトレーサビリティ → 依存関係 (blocks/relates_to)
- `bd ready` による次タスク自動検出がウォーターフォールの前工程依存と好相性
- Labels によるカテゴリ分類 (G, B, D, A, P, S)
- Metadata による成果物テンプレート情報の格納
- マルチエージェント並行作業対応（同一フェーズ内の独立タスク）

**制約事項:**
- beads はイシュートラッカーであり、ドキュメント管理システムではない
- Excel/Astah ファイル本体の管理は Git + ファイルサーバが必要
- フェーズゲート判定には追加のプロセス設計が必要

## 元データ

- ZIP展開先: `/home/ubuntu/webpot-si-docs/webpot-si-docs-main/`
- 分析レポート: `/home/ubuntu/webpot-si-docs-analysis/`
