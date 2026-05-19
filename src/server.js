/** インフラ層: Node.js プロセスのエントリポイント。 */
const { create } = require('./app');
const db = require('./db/database');

function start() {
  const port = parseInt(process.env.BOOK_APP_PORT, 10) || 3000;
  const host = process.env.BOOK_APP_HOST || '127.0.0.1';

  db.open();
  const app = create();
  const server = app.listen(port, host, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on http://${host}:${port}`);
  });

  const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`[server] received ${signal}, shutting down`);
    server.close(() => {
      db.close();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

if (require.main === module) {
  start();
}

module.exports = { start };
