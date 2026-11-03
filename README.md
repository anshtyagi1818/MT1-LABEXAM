# MT1 Library Book Management

This project contains two independent Node.js applications. Book records are kept in memory, so changes reset when the relevant server restarts.

## Setup

From this project folder, install the dependency:

```powershell
npm install
```

## Run the servers

Open two terminals in the project folder:

```powershell
npm run start:http
```

```powershell
npm run start:api
```

The HTTP server listens on `http://localhost:3000`; the Express API listens on `http://localhost:4000`.

## Public deployment on Render

The Render Blueprint in `render.yaml` deploys the complete website and REST API as one web service. In Render, choose **New → Blueprint**, connect the `anshtyagi1818/MT1-LABEXAM` GitHub repository, and apply the `render.yaml` configuration. Render will provide the public HTTPS URL after the first deployment finishes. The free instance can sleep when idle and take a short time to wake up.

The deployment uses `webApp.js` and the `PORT` provided by Render. The separate `httpServer.js` and `expressApp.js` exam servers remain available through the local commands above.

## HTTP and FS routes

| Method | URL | Result |
| --- | --- | --- |
| GET | `/` | HTML welcome message |
| GET | `/books` | All books as JSON |
| GET | `/about` | Library information |
| GET | `/home` | Reads and serves `public/index.html` using `fs` |
| POST | `/add-book` | Adds a book from a JSON body |

Example request body for `POST http://localhost:3000/add-book`:

```json
{
  "id": 4,
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "price": 499,
  "category": "Programming"
}
```

## Express API routes

| Method | URL | Result |
| --- | --- | --- |
| GET | `/books` | All books |
| GET | `/books/:id` | A book by ID |
| POST | `/books` | Creates a book; responds with status `201` |
| PUT | `/books/:id` | Updates one or more book fields |
| DELETE | `/books/:id` | Deletes a book |

POST requests require `id`, `title`, `author`, and `price`; `category` is optional and defaults to `Uncategorized`. Send JSON with the `Content-Type: application/json` header.

## Quick checks

Use a browser for the GET routes or run these commands in PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/books
Invoke-RestMethod http://localhost:4000/books/1
```

For POST, PUT, and DELETE requests, use EchoAPI or another API client with a JSON request body.
