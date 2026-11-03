import express from 'express';
import { createBook, validateBookInput } from './bookUtils.js';

const PORT = 4000;
const app = express();

const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350, category: 'Fiction' },
  { id: 2, title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', price: 299, category: 'Biography' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', price: 550, category: 'Programming' }
];

app.use(express.json());

app.get('/books', (request, response) => {
  response.json(books);
});

app.get('/books/:id', (request, response) => {
  const book = books.find((item) => String(item.id) === request.params.id);
  if (!book) {
    response.status(404).json({ error: 'Book not found.' });
    return;
  }

  response.json(book);
});

app.post('/books', (request, response) => {
  const validationError = validateBookInput(request.body, { requireId: true });
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  if (books.some((book) => book.id === request.body.id)) {
    response.status(409).json({ error: `A book with id ${request.body.id} already exists.` });
    return;
  }

  const book = createBook(request.body);
  books.push(book);
  response.status(201).json({ message: 'Book added successfully', book });
});

app.put('/books/:id', (request, response) => {
  const index = books.findIndex((book) => String(book.id) === request.params.id);
  if (index === -1) {
    response.status(404).json({ error: 'Book not found.' });
    return;
  }

  const validationError = validateBookInput(request.body);
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  const updates = request.body;
  const editableFields = ['title', 'author', 'price', 'category'];
  if (!editableFields.some((field) => Object.hasOwn(updates, field))) {
    response.status(400).json({ error: 'Provide at least one book field to update.' });
    return;
  }

  books[index] = {
    ...books[index],
    ...(updates.title !== undefined && { title: updates.title.trim() }),
    ...(updates.author !== undefined && { author: updates.author.trim() }),
    ...(updates.price !== undefined && { price: updates.price }),
    ...(updates.category !== undefined && { category: updates.category.trim() })
  };

  response.json({ message: 'Book updated successfully', book: books[index] });
});

app.delete('/books/:id', (request, response) => {
  const index = books.findIndex((book) => String(book.id) === request.params.id);
  if (index === -1) {
    response.status(404).json({ error: 'Book not found.' });
    return;
  }

  const [book] = books.splice(index, 1);
  response.json({ message: 'Book deleted successfully', book });
});

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found.' });
});

app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    response.status(400).json({ error: 'Request body must contain valid JSON.' });
    return;
  }

  console.error('Express request failed:', error);
  response.status(500).json({ error: 'Unable to complete the request.' });
});

const server = app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('Express server failed to start:', error);
  process.exitCode = 1;
});
