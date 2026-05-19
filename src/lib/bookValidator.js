/** ライブラリ層: BookInput のバリデーション。 */

const FIELD_LABELS = {
  title: 'タイトル',
  author: '著者',
  isbn: 'ISBN',
  publisher: '出版社',
  purchase_date: '購入日',
  price: '価格',
  memo: 'メモ',
};

const FIELD_MAX = {
  title: 200,
  author: 100,
  isbn: 17,
  publisher: 100,
  memo: 1000,
};

const PRICE_MAX = 9999999;

function msg(id, replacements = {}) {
  const TEMPLATES = {
    'MSG-V-001': '{項目名}は必須です。',
    'MSG-V-002': '{項目名}は{n}文字以内で入力してください。',
    'MSG-V-003': '{項目名}は半角数字とハイフンで入力してください。',
    'MSG-V-004': '{項目名}は0以上{n}以下の整数で入力してください。',
    'MSG-V-005': '{項目名}は正しい日付（YYYY-MM-DD）で入力してください。',
    'MSG-V-006': '{項目名}に未来の日付は指定できません。',
  };
  let text = TEMPLATES[id] || id;
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return text;
}

function isISBNFormat(s) {
  return typeof s === 'string' && /^[0-9-]+$/.test(s) && s.length >= 1 && s.length <= 17;
}

function isYmd(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

function isPositiveIntInRange(n, max) {
  return Number.isInteger(n) && n >= 0 && n <= max;
}

function todayYmd() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function validateBook(input) {
  const errors = {};

  // title 必須・桁数
  if (input.title == null || input.title === '') {
    errors.title = msg('MSG-V-001', { '項目名': FIELD_LABELS.title });
  } else if (input.title.length > FIELD_MAX.title) {
    errors.title = msg('MSG-V-002', { '項目名': FIELD_LABELS.title, n: FIELD_MAX.title });
  }

  // author 必須・桁数
  if (input.author == null || input.author === '') {
    errors.author = msg('MSG-V-001', { '項目名': FIELD_LABELS.author });
  } else if (input.author.length > FIELD_MAX.author) {
    errors.author = msg('MSG-V-002', { '項目名': FIELD_LABELS.author, n: FIELD_MAX.author });
  }

  // isbn 任意・形式・桁数
  if (input.isbn != null) {
    if (input.isbn.length > FIELD_MAX.isbn) {
      errors.isbn = msg('MSG-V-002', { '項目名': FIELD_LABELS.isbn, n: FIELD_MAX.isbn });
    } else if (!isISBNFormat(input.isbn)) {
      errors.isbn = msg('MSG-V-003', { '項目名': FIELD_LABELS.isbn });
    }
  }

  // publisher 任意・桁数
  if (input.publisher != null && input.publisher.length > FIELD_MAX.publisher) {
    errors.publisher = msg('MSG-V-002', { '項目名': FIELD_LABELS.publisher, n: FIELD_MAX.publisher });
  }

  // purchase_date 任意・日付形式・未来日不可
  if (input.purchase_date != null) {
    if (!isYmd(input.purchase_date)) {
      errors.purchase_date = msg('MSG-V-005', { '項目名': FIELD_LABELS.purchase_date });
    } else if (input.purchase_date > todayYmd()) {
      errors.purchase_date = msg('MSG-V-006', { '項目名': FIELD_LABELS.purchase_date });
    }
  }

  // price 任意・整数範囲
  if (input.price != null) {
    if (!isPositiveIntInRange(input.price, PRICE_MAX)) {
      errors.price = msg('MSG-V-004', { '項目名': FIELD_LABELS.price, n: PRICE_MAX });
    }
  }

  // memo 任意・桁数
  if (input.memo != null && input.memo.length > FIELD_MAX.memo) {
    errors.memo = msg('MSG-V-002', { '項目名': FIELD_LABELS.memo, n: FIELD_MAX.memo });
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

module.exports = { validateBook };
