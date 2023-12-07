const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://mongodb:27017/db', { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new Schema({
  title: String,
  image: String,
  author: String,
  description: String,
}, { collection: 'books' });

const Book = mongoose.model('books', bookSchema);

router.get('/', async function (req, res, next) {
  const booksData = await getBooks();
  res.render('index', { books: booksData.books });
});

router.post('/getBooks', async function (req, res, next) {
  const booksData = await getBooks();
  res.json(booksData);
});

router.get('/getBook/:id', async function (req, res, next) {
  const bookId = req.params.id;
  const bookData = await getBookById(bookId);
  res.json(bookData);
});

async function getBookById(id) {
  try {
    const data = await Book.findById(id).lean();
    return { book: data };
  } catch (err) {
    console.error('Error fetching book by ID:', err);
    return { book: null, error: 'Failed to fetch book by ID' };
  }
}

async function getBooks() {
  try {
    const data = await Book.find().lean();
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
    await Book.create(theBook);
    return { saveBookResponse: 'success' };
  } catch (err) {
    console.error('Could not insert new book:', err);
    return { saveBookResponse: 'fail', error: 'Failed to save book' };
  }
}

router.post('/removeBook', async function (req, res, next) {
  const removeResult = await removeBook(req.body._id);
  res.json(removeResult);
});

async function removeBook(id) {
  try {
    await Book.deleteOne({ _id: id });
    return { removeBookResponse: 'success' };
  } catch (err) {
    console.error('Could not remove book:', err);
    return { removeBookResponse: 'fail', error: 'Failed to remove book' };
  }
}

module.exports = router;
