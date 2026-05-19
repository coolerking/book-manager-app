/** リポジトリ層: books テーブルに対する CRUD を提供する。 */
const { getDb } = require('../db/database');

const ALLOWED_SORT = new Set([
  'id', 'title', 'author', 'publisher', 'purchase_date', 'price', 'created_at',
]);
const ALLOWED_DIR = new Set(['ASC', 'DESC']);

function normalizeSort(sort) {
  return ALLOWED_SORT.has(sort) ? sort : 'created_at';
}

function normalizeDir(dir) {
  const upper = typeof dir === 'string' ? dir.toUpperCase() : '';
  return ALLOWED_DIR.has(upper) ? upper : 'DESC';
}

function findAll(opts = {}) {
  const page = Number.isInteger(opts.page) && opts.page >= 1 ? opts.page : 1;
  const pageSize = Number.isInteger(opts.page_size) && opts.page_size >= 1 ? opts.page_size : 10;
  const sort = normalizeSort(opts.sort);
  const dir = normalizeDir(opts.dir);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, title, author, isbn, publisher, purchase_date, price, memo, created_at, updated_at
                 FROM books
                ORDER BY ${sort} ${dir}
                LIMIT ? OFFSET ?`;
  return getDb().prepare(sql).all(pageSize, offset);
}

function count() {
  const row = getDb().prepare('SELECT COUNT(*) AS cnt FROM books').get();
  return row.cnt;
}

function findById(id) {
  const row = getDb().prepare(
    `SELECT id, title, author, isbn, publisher, purchase_date, price, memo, created_at, updated_at
       FROM books
      WHERE id = ?`
  ).get(id);
  return row || null;
}

function create(input) {
  const stmt = getDb().prepare(
    `INSERT INTO books (title, author, isbn, publisher, purchase_date, price, memo)
     VALUES (@title, @author, @isbn, @publisher, @purchase_date, @price, @memo)`
  );
  const info = stmt.run(input);
  return Number(info.lastInsertRowid);
}

function update(id, input) {
  const stmt = getDb().prepare(
    `UPDATE books
        SET title         = @title,
            author        = @author,
            isbn          = @isbn,
            publisher     = @publisher,
            purchase_date = @purchase_date,
            price         = @price,
            memo          = @memo
      WHERE id = @id`
  );
  const info = stmt.run({ ...input, id });
  return info.changes > 0;
}

function remove(id) {
  const info = getDb().prepare('DELETE FROM books WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = { findAll, count, findById, create, update, remove };
