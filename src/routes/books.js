/** ルータ層: 書籍リソースのエンドポイントを BookController に束ねる。 */
const express = require('express');
const c = require('../controllers/bookController');

const router = express.Router();

router.get('/', (req, res) => res.redirect(302, '/books'));
router.get('/books', c.list);
router.get('/books/new', c.newForm);
router.post('/books', c.create);
router.get('/books/:id/edit', c.editForm);
router.post('/books/:id', c.update);
router.post('/books/:id/delete', c.remove);

module.exports = router;
