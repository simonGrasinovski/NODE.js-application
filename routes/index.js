const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (req, res) => {
    const books = await Book.find().sort({ createdAt: 'desc' }).limit(6).exec();
    res.render('index', { books });
});

module.exports = router;