require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const app = express();

const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.static('./public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(methodOverride('_method'));

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true })
.then(app.listen(process.env.PORT))
.catch(err => console.log(err));

app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);