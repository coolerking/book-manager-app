/** アプリケーション層: Express アプリのインスタンス生成と組み立て。 */
const path = require('path');
const express = require('express');
const pkg = require('../package.json');
const booksRouter = require('./routes/books');

function create() {
  const app = express();

  app.disable('x-powered-by');
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, '..', 'views'));
  app.locals.appVersion = pkg.version;

  // 共通レスポンスヘッダ
  app.use((req, res, next) => {
    res.set('Content-Language', 'ja');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'same-origin');
    res.set('X-Frame-Options', 'DENY');
    next();
  });

  // 静的アセット
  app.use('/static', express.static(path.resolve(__dirname, '..', 'public')));

  // body parser
  app.use(express.urlencoded({ extended: false, limit: '64kb' }));

  // ルータ
  app.use('/', booksRouter);

  // 404
  app.use((req, res) => {
    res.status(404).render('error', {
      appVersion: app.locals.appVersion,
      status: 404,
      message: 'ページが見つかりません。',
    });
  });

  // 500 (4 引数のエラーハンドラ)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error('[error]', err && err.stack ? err.stack : err);
    res.status(500).render('error', {
      appVersion: app.locals.appVersion,
      status: 500,
      message: '処理中にエラーが発生しました。時間をおいて再度お試しください。',
    });
  });

  return app;
}

module.exports = { create };
