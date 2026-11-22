import express from 'express';
import sequelize from './config/db.js';
import Book from './models/book.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to get books' });
  }
});

app.post('/books', async (req, res) => {
  const { title, author, year } = req.body || {};

  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Fields "title", "author" and "year" are required' });
  }

  try {
    const book = await Book.create({ title, author, year });
    res.status(201).json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body || {};

  if (!title && !author && !year) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ error: `Book with id ${id} not found` });
    }

    await Book.update({ title, author, year }, { where: { id } });
    await book.reload();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Book.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: `Book with id ${id} not found` });
    }

    res.json({ message: `Book with id ${id} deleted` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
