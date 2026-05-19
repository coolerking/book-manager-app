# お弁当アプリケーション サンプル分析

WebPot SI Docs には「**お弁当アプリケーション構築プロジェクト**」のサンプルが含まれています。

---

## 1. システム概要

お弁当の注文管理Webアプリケーション。ユーザが弁当を予約し、管理者が予約を確定・管理するシステム。

### アクタ

```mermaid
graph TB
    User["ユーザ<br/>(一般利用者)"]
    Admin["管理者"]
    System["お弁当アプリケーション"]

    User -->|弁当予約/予約解除<br/>ユーザ情報変更| System
    Admin -->|日次予約確定<br/>予約可能日設定<br/>お知らせ入力<br/>ユーザ管理| System
```

---

## 2. ユースケース

```mermaid
graph TB
    subgraph "お弁当アプリケーション"
        UC_LOGIN["UCS1.<br/>システムにログインする"]
        UC_RESERVE["UC1.<br/>弁当を予約/予約解除する"]
        UC_USERINFO["UC2.<br/>ユーザ情報を変更する"]
        UC_CONFIRM["UC3.<br/>日次予約を確定する"]
        UC_SETDATE["UC4.<br/>予約可能日を設定する"]
        UC_ANNOUNCE["UC5.<br/>お知らせを入力する"]
        UC_USERMGMT["UC6.<br/>ユーザを管理する"]
    end

    User["ユーザ"] --> UC_LOGIN
    User --> UC_RESERVE
    User --> UC_USERINFO
    Admin["管理者"] --> UC_LOGIN
    Admin --> UC_CONFIRM
    Admin --> UC_SETDATE
    Admin --> UC_ANNOUNCE
    Admin --> UC_USERMGMT
```

### ユースケース記述例: UC1. 弁当を予約・予約解除する

| 項目 | 内容 |
|------|------|
| 概要 | ユーザが弁当の予約内容を変更する |
| アクタ | ユーザ |
| 事前条件 | アクタはユーザとしてシステムにログインしていること |

**基本系列**:
1. アクタは、予約変更したい対象日を選択し、現在の予約内容を変更する
   1. 予約状況タブをクリックし予約状況を表示
   2. 前月/次月ボタンで月を切り替え
   3. 日付をクリックし、予約マーク表示(予約あり)/非表示(予約なし)で予約状況を変更
2. システムは、変更された予約内容を記録し、表示内容を更新
3. 変更したい日の分だけ繰り返す

---

## 3. 画面構成

```mermaid
graph TD
    SC01["SC01<br/>ログイン画面"]
    SC02["SC02<br/>弁当注文システム<br/>(ユーザ画面)"]
    SC02_1["SC02-1<br/>予約状況タブ"]
    SC02_2["SC02-2<br/>ユーザ設定タブ"]
    SC03["SC03<br/>弁当注文システム<br/>(管理者画面)"]
    SC03_1["SC03-1<br/>日次予約確定"]
    SC03_2["SC03-2<br/>予約可能日の設定"]
    SC03_3["SC03-3<br/>お知らせ入力"]
    SC03_4["SC03-4<br/>ユーザ管理"]

    SC01 -->|ユーザ認証| SC02
    SC01 -->|管理者認証| SC03
    SC02 --- SC02_1
    SC02 --- SC02_2
    SC03 --- SC03_1
    SC03 --- SC03_2
    SC03 --- SC03_3
    SC03 --- SC03_4
```

---

## 4. ER図（論理モデル）

以下はサンプルのテーブル定義から推定した論理モデルです。

```mermaid
erDiagram
    USER {
        string user_id PK "ユーザID"
        string password "パスワード"
        string user_name "ユーザ名"
        string email "メールアドレス"
        string role "ロール(user/admin)"
    }

    RESERVATION {
        string reservation_id PK "予約ID"
        string user_id FK "ユーザID"
        date target_date "予約対象日"
        boolean reserved "予約有無"
        datetime created_at "作成日時"
        datetime updated_at "更新日時"
    }

    ORDERABLE_DATE {
        date target_date PK "対象日"
        boolean orderable "注文可能フラグ"
        datetime set_by_admin_at "設定日時"
    }

    ANNOUNCEMENT {
        string announcement_id PK "お知らせID"
        string title "タイトル"
        string content "内容"
        datetime published_at "公開日時"
        string created_by FK "作成者(管理者)"
    }

    ORDER_CONFIRMATION {
        date target_date PK "対象日"
        int total_count "弁当合計数"
        boolean confirmed "確定済みフラグ"
        datetime confirmed_at "確定日時"
    }

    USER ||--o{ RESERVATION : "予約する"
    ORDERABLE_DATE ||--o{ RESERVATION : "予約可能日に"
    USER ||--o{ ANNOUNCEMENT : "作成する"
    ORDERABLE_DATE ||--|| ORDER_CONFIRMATION : "確定する"
```

---

## 5. ソフトウェアアーキテクチャ

```mermaid
graph TB
    subgraph "クライアント"
        Browser["Webブラウザ"]
    end

    subgraph "プレゼンテーション層"
        HTML["HTML<br/>(Velocityテンプレート)"]
        CSS["CSSファイル"]
        JS["JavaScriptファイル"]
        Action["Strutsアクション"]
        Check["チェッククラス"]
    end

    subgraph "サービス層"
        SvcIF["サービスIF"]
        SvcImpl["サービス実装"]
    end

    subgraph "データアクセス層"
        DAOIF["DAO IF"]
        DAOImpl["DAO実装"]
        DTO["DTO"]
        MyBatis["MyBatis定義"]
    end

    subgraph "データ層"
        DB["RDBMS<br/>(Oracle等)"]
    end

    Browser --> HTML
    HTML --> Action
    Action --> Check
    Action --> SvcIF
    SvcIF --> SvcImpl
    SvcImpl --> DAOIF
    DAOIF --> DAOImpl
    DAOImpl --> DTO
    DAOImpl --> MyBatis
    MyBatis --> DB

    subgraph "設定ファイル"
        StrutsConf["Struts定義"]
        SpringConf["Spring定義"]
        Prop["プロパティファイル"]
    end

    Action -.-> StrutsConf
    SvcIF -.-> SpringConf
    SvcImpl -.-> Prop
```

---

## 6. beads でのモデル化

上記のお弁当アプリを beads で管理する場合のイシュー構造例：

```
bd-xxxx          お弁当アプリケーション構築プロジェクト [epic]
├── bd-xxxx.1    010 要件定義 [epic]
│   ├── .1.1     G01010 レイアウト共通ルール [task] ○
│   ├── .1.2     B01010 システム振舞い共通ルール [task] ○
│   ├── .1.3     B01020 システム化業務一覧 [task] ○
│   ├── .1.4     B01030 システム化業務フロー [task] ○
│   └── ...
├── bd-xxxx.2    020 外部設計 [epic]
│   ├── .2.1     G02010 画面一覧 [task] ○
│   ├── .2.2     G02020 画面遷移 [task] ○
│   ├── .2.3     G02030 画面レイアウト: SC01 ログイン画面 [task] ○
│   ├── .2.4     G02030 画面レイアウト: SC02 ユーザ画面 [task] ○
│   ├── .2.5     G02030 画面レイアウト: SC03 管理者画面 [task] ○
│   ├── .2.6     B02030 ユースケース図 [task] ○
│   ├── .2.7     B02040 UC1. 弁当を予約/予約解除する [task] ○
│   ├── .2.8     B02040 UCS1. システムにログインする [task] ○
│   ├── .2.9     D02020 ER図(論理モデル) [task] ○
│   └── ...
├── bd-xxxx.3    031 基本設計 [epic]
│   ├── .3.1     A03110 ソフトウェア論理構成 [task] ○
│   ├── .3.2     A03120 ソフトウェア物理構成 [task] ○
│   ├── .3.3     A03130 ソフトウェア実現方針 [task] ○
│   └── ...
└── bd-xxxx.4    032 詳細設計 [epic]
    ├── .4.1     D03240 テーブル定義 [task] ○
    ├── .4.2     S03210 クラス図(サービス・DAO) [task] ○
    └── ...
```
