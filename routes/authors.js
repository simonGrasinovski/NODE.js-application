const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

router.get('/', async (req, res) => {
    const searchOptions = {}
    if(req.query.name !== null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    const authors = await Author.find(searchOptions);
    res.render('authors/index', { authors });
});

router.get('/new', (req, res) => {
    res.render('authors/new'); 
});

router.post('/new', (req, res) => {
    if(!req.body.name) {
        req.flash('error', 'Error creating author');
        res.render('authors/new');
    } else {
        const author = new Author({ name: req.body.name });
        author.save()
        .then(res.redirect('/authors'))
        .catch(err => console.log(err));
    }
});

router.get('/:id', async (req,res) => {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author._id }).limit(6).exec();
    res.render('authors/show', { author, books });
});

router.get('/:id/edit', async (req, res) => {
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', { author });
});

router.put('/:id', (req, res) => {
    Author.findByIdAndUpdate( req.params.id, { name: req.body.name })
    .then(() => res.redirect('/authors/' + req.params.id))
    .catch(err => console.log(err));
});

router.delete('/:id', (req, res) => {
    Author.findById(req.params.id)
    .then(result => result.remove())
    .then(() => res.redirect('/authors'))
    .catch(() => res.redirect('/authors/' + req.params.id));
    
});

module.exports = router;