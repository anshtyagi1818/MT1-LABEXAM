import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBook, validateBookInput } from './bookUtils.js';

const PORT = 3000;
const homePagePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public', 'index.html');

const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350, category: 'Fiction' },
  { id: 2, title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', price: 299, category: 'Biography' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', price: 550, category: 'Programming' }
];

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function sendText(response, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.end(text);
}

async function readJsonBody(request) {
  if (!request.headers['content-type']?.includes('application/json')) {
    const error = new Error('Content-Type must be application/json.');
    error.statusCode = 415;
    throw error;
  }

  let body = '';
  for await (const chunk of request) {
    body += chunk;
  }

  try {
    return JSON.parse(body);
  } catch {
    const error = new Error('Request body must contain valid JSON.');
    error.statusCode = 400;
    throw error;
  }
}

async function handleRequest(request, response) {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');

  if (request.method === 'GET' && pathname === '/') {
    sendText(
      response,
      200,
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Library Management</title></head><body><h1>Welcome to the Library Book Management Application</h1><p>Visit <a href="/home">the library home page</a> or request <a href="/books">the books API</a>.</p></body></html>',
      'text/html; charset=utf-8'
    );
    return;
  }

  if (request.method === 'GET' && pathname === '/books') {
    sendJson(response, 200, books);
    return;
  }

  if (request.method === 'GET' && pathname === '/about') {
    sendText(
      response,
      200,
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>About the Library</title></head><body><h1>About this library</h1><p>This library management application demonstrates Node.js HTTP routing, file serving, and book management.</p></body></html>',
      'text/html; charset=utf-8'
    );
    return;
  }

  if (request.method === 'GET' && pathname === '/home') {
    const html = await readFile(homePagePath, 'utf8');
    sendText(response, 200, html, 'text/html; charset=utf-8');
    return;
  }

  if (request.method === 'POST' && pathname === '/add-book') {
    const input = await readJsonBody(request);
    const validationError = validateBookInput(input, { requireId: true });

    if (validationError) {
      sendJson(response, 400, { error: validationError });
      return;
    }

    if (books.some((book) => book.id === input.id)) {
      sendJson(response, 409, { error: `A book with id ${input.id} already exists.` });
      return;
    }

    const book = createBook(input);
    books.push(book);
    sendJson(response, 201, { message: 'Book added successfully', book });
    return;
  }

  if (['GET', 'POST'].includes(request.method ?? '') &&
      ['/books', '/add-book', '/', '/about', '/home'].includes(pathname)) {
    sendJson(response, 405, { error: 'Method not allowed for this route.' });
    return;
  }

  sendJson(response, 404, { error: 'Route not found.' });
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    if (response.headersSent) {
      response.destroy(error);
      return;
    }

    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    if (statusCode === 500) {
      console.error('HTTP request failed:', error);
    }
    sendJson(response, statusCode, {
      error: statusCode === 500 ? 'Unable to complete the request.' : error.message
    });
  });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('HTTP server failed to start:', error);
  process.exitCode = 1;
});
