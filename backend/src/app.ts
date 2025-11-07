import express from 'express';
import cors from 'cors';
import apartmentRouter from './routes/apartment.routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandlers';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/apartments', apartmentRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

