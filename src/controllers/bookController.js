/** アプリケーション層: 書籍リソースのコントローラ。 */
const repo = require('../repositories/bookRepository');
const { validateBook } = require('../lib/bookValidator');

const PAGE_SIZE = 10;
const ALLOWED_SORT = new Set([
  'id', 'title', 'author', 'publisher', 'purchase_date', 'price', 'created_at',
]);

function parseListQuery(query) {
  const pageNum = parseInt(query.page, 10);
  const sort = ALLOWED_SORT.has(query.sort) ? query.sort : 'created_at';
  const dirRaw = typeof query.dir === 'string' ? query.dir.toUpperCase() : '';
  const dir = dirRaw === 'ASC' || dirRaw === 'DESC' ? dirRaw : 'DESC';
  const page = Number.isInteger(pageNum) && pageNum >= 1 ? pageNum : 1;
  return { page, page_size: PAGE_SIZE, sort, dir };
}

function trimOrNull(v) {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t === '' ? null : t;
}

function toBookInput(body) {
  const title = trimOrNull(body.title);
  const author = trimOrNull(body.author);
  const isbn = trimOrNull(body.isbn);
  const publisher = trimOrNull(body.publisher);
  const purchase_date = trimOrNull(body.purchase_date);
  const memo = trimOrNull(body.memo);
  const priceRaw = trimOrNull(body.price);
  let price = null;
  if (priceRaw != null) {
    if (/^\d+$/.test(priceRaw)) {
      price = parseInt(priceRaw, 10);
    } else {
      price = NaN;
    }
  }
  return { title, author, isbn, publisher, purchase_date, price, memo };
}

function render(res, view, model) {
  res.render(view, { appVersion: res.app.locals.appVersion, ...model });
}

function parseId(raw) {
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) return null;
  return parseInt(raw, 10);
}

function notFound(res) {
  return res.status(404).render('error', {
    appVersion: res.app.locals.appVersion,
    status: 404,
    message: '対象の書籍が見つかりません。',
  });
}

function list(req, res, next) {
  try {
    const q = parseListQuery(req.query);
    const total = repo.count();
    const page_count = total === 0 ? 1 : Math.ceil(total / q.page_size);
    let page = q.page;
    let flash = typeof req.query.flash === 'string' ? req.query.flash : null;
    if (page > page_count) {
      page = 1;
      flash = 'out_of_range_page';
    }
    const books = repo.findAll({ page, page_size: q.page_size, sort: q.sort, dir: q.dir });
    res.set('Cache-Control', 'no-store');
    render(res, 'index', {
      books,
      page,
      page_count,
      total,
      sort: q.sort,
      dir: q.dir,
      flash,
      errors: {},
    });
  } catch (err) {
    next(err);
  }
}

function newForm(req, res, next) {
  try {
    render(res, 'form', {
      mode: 'new',
      book: {},
      errors: {},
      action_url: '/books',
      submit_label: '登録',
    });
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const input = toBookInput(req.body);
    const result = validateBook(input);
    if (!result.ok) {
      res.status(200).set('Cache-Control', 'no-store');
      return render(res, 'form', {
        mode: 'new',
        book: req.body,
        errors: result.errors,
        action_url: '/books',
        submit_label: '登録',
        flash: 'validation_error',
      });
    }
    repo.create(input);
    return res.redirect(303, '/books?flash=created');
  } catch (err) {
    next(err);
  }
}

function editForm(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return notFound(res);
    const book = repo.findById(id);
    if (!book) return notFound(res);
    render(res, 'form', {
      mode: 'edit',
      book,
      errors: {},
      action_url: `/books/${id}`,
      submit_label: '更新',
    });
  } catch (err) {
    next(err);
  }
}

function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return notFound(res);
    const input = toBookInput(req.body);
    const result = validateBook(input);
    if (!result.ok) {
      res.status(200).set('Cache-Control', 'no-store');
      return render(res, 'form', {
        mode: 'edit',
        book: { ...req.body, id },
        errors: result.errors,
        action_url: `/books/${id}`,
        submit_label: '更新',
        flash: 'validation_error',
      });
    }
    const existing = repo.findById(id);
    if (!existing) return notFound(res);
    repo.update(id, input);
    return res.redirect(303, '/books?flash=updated');
  } catch (err) {
    next(err);
  }
}

function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.redirect(303, '/books?flash=already_deleted');
    }
    const ok = repo.remove(id);
    if (!ok) {
      return res.redirect(303, '/books?flash=already_deleted');
    }
    return res.redirect(303, '/books?flash=deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = { list, newForm, create, editForm, update, remove };
