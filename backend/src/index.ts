import './loadEnv';
import { createServer } from 'http';
import app from './app';

const port = process.env.PORT || 4000;

const server = createServer(app);

server.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

