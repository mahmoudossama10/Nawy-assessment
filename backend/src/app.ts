import express from 'express';
import cors from 'cors';
import apartmentRouter from './routes/apartment.routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandlers';

const app = express();

const allowedOrigin = 'http://localhost:3000';

// 2. Configure CORS options
const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/apartments', apartmentRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

