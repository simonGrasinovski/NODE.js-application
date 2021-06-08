const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

router.get('/', async (req, res) => {
    let query = Book.find();
    if(req.query.title !== null && req.query.title !== '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.publishedBefore !== undefined && req.query.publishedBefore !== '') {
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if(req.query.publishedAfter !== undefined && req.query.publishedAfter !== '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    const books = await query.exec();
    res.render('books/index', { books });
});

router.get('/new', async (req, res) => {
    const authors = await Author.find({})
    res.render('books/new', { authors, book: '' });
});

router.post('/new', async (req, res) => {
    const authors = await Author.find({});
    const { title, description, publishDate, pageCount, author, cover} = req.body;
    if(!title || !description || !publishDate || !pageCount || !author || !cover) {
        req.flash('createError', 'Error creating book');
        res.render('books/new', { 
            authors,
            book: '',
            title,
            description,
            publishDate,
            pageCount,
            author,
        });
    } else {
        const book = new Book({
            title: req.body.title,
            description: req.body.description,
            publishDate: new Date(req.body.publishDate),
            pageCount: req.body.pageCount,
            author: req.body.author
        });

        const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if(req.body.cover === null) return;
        const cover = JSON.parse(req.body.cover);
        if(cover !== null && imageMimeTypes.includes(cover.type)) {
            book.coverImage = new Buffer.from(cover.data, 'base64');
            book.coverImageType = cover.type;
        }
        await book.save();
        res.redirect('/books/' + book.id);
    }
});

router.get('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id).populate('author').exec();
    res.render('books/show', { book });
});

router.get('/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id);
    const authors = await Author.find({});
    
    res.render('books/edit', { book, authors });

});

router.put('/:id', async (req, res) => {
    if(req.body.title !== '' && req.body.publishDate !== '' && req.body.pageCount !== '' && req.body.description !== '') {
        await Book.findByIdAndUpdate(req.params.id, { 
            title: req.body.title,
            description: req.body.description,
            publishDate: new Date(req.body.publishDate),
            pageCount: req.body.pageCount,
            author: req.body.author 
    
        });
        res.redirect('/books/' + req.params.id);   
    } else {
        req.flash('updateError', 'Error updating book');
        res.redirect('/books/' + req.params.id + '/edit');
    }
});

router.delete('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect('/books');
});

module.exports = router;