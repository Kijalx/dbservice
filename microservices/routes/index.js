// routes/index.js

const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose').Mongoose;
const Schema = require('mongoose').Schema;
const oldMong = new Mongoose();
oldMong.connect('mongodb://mongodb:27017/db', { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new Schema({
  bookId: String,
  title: String,
  image: String,
  author: String,
  description: String
}, { collection: 'books' });

const books = oldMong.model('books', bookSchema);

router.get('/', async function (req, res, next) {
  const booksData = await getBooks();
  res.render('index', { books: booksData.books });
});

router.post('/getBooks', async function (req, res, next) {
  const booksData = await getBooks();
  res.json(booksData);
});

async function getBooks() {
  try {
    const data = await books.find().lean();
    return { books: data };
  } catch (err) {
    console.error('Error fetching books:', err);
    return { books: [], error: 'Failed to fetch books' };
  }
}

router.post('/saveBook', async function (req, res, next) {
  const saveResult = await saveBook(req.body);
  res.json(saveResult);
});

async function saveBook(theBook) {
  try {
    console.log('theBook: ', theBook);
    await books.create(theBook);
    return { saveBookResponse: "success" };
  } catch (err) {
    console.error('Could not insert new book:', err);
    return { saveBookResponse: "fail", error: 'Failed to save book' };
  }
}

module.exports = router;