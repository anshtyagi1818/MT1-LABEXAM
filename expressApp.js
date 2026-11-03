import { createLibraryApp } from './libraryApp.js';

const PORT = 4000;
const app = createLibraryApp();

const server = app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('Express server failed to start:', error);
  process.exitCode = 1;
});
