import { createLibraryApp } from './libraryApp.js';

const PORT = Number(process.env.PORT) || 5000;
const app = createLibraryApp({ serveWebsite: true });

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Library website running on port ${PORT}`);
});

server.on('error', (error) => {
  console.error('Library website failed to start:', error);
  process.exitCode = 1;
});
