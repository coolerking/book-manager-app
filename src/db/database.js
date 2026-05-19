/** インフラ層: SQLite データベースの初期化とスキーマ適用を提供する。 */
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DEFAULT_DB_PATH = path.resolve(__dirname, '..', '..', 'data', 'books.db');

const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS books (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT    NOT NULL
                  CHECK (length(trim(title))  BETWEEN 1 AND 200),
    author        TEXT    NOT NULL
                  CHECK (length(trim(author)) BETWEEN 1 AND 100),
    isbn          TEXT
                  CHECK (
                      isbn IS NULL
                   OR (length(isbn) BETWEEN 1 AND 17
                       AND isbn NOT GLOB '*[^0-9-]*')
                  ),
    publisher     TEXT
                  CHECK (publisher IS NULL OR length(publisher) <= 100),
    purchase_date TEXT
                  CHECK (
                      purchase_date IS NULL
                   OR purchase_date GLOB '????-??-??'
                  ),
    price         INTEGER
                  CHECK (price IS NULL OR (price BETWEEN 0 AND 9999999)),
    memo          TEXT
                  CHECK (memo IS NULL OR length(memo) <= 1000),
    created_at    TEXT    NOT NULL
                  DEFAULT (datetime('now', 'localtime'))
                  CHECK (length(created_at) = 19),
    updated_at    TEXT    NOT NULL
                  DEFAULT (datetime('now', 'localtime'))
                  CHECK (length(updated_at) = 19)
);

CREATE INDEX IF NOT EXISTS idx_books_created_at    ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_title         ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author        ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_publisher     ON books(publisher);
CREATE INDEX IF NOT EXISTS idx_books_purchase_date ON books(purchase_date);
CREATE INDEX IF NOT EXISTS idx_books_price         ON books(price);

CREATE TRIGGER IF NOT EXISTS trg_books_set_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
BEGIN
    UPDATE books
       SET updated_at = datetime('now', 'localtime')
     WHERE id = OLD.id;
END;
`;

let dbHandle = null;

function open(dbPath = process.env.BOOK_APP_DB_PATH || DEFAULT_DB_PATH) {
  if (dbHandle) return dbHandle;
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA_DDL);
  dbHandle = db;
  return db;
}

function close() {
  if (dbHandle) {
    dbHandle.close();
    dbHandle = null;
  }
}

function getDb() {
  if (!dbHandle) {
    return open();
  }
  return dbHandle;
}

module.exports = { open, close, getDb };
