/**
 * Express Application Configuration
 * 
 * Architecture & Design Decisions:
 * 1. Security:
 *    - Strict CORS policy (single origin)
 *    - Limited HTTP methods
 *    - JSON parsing with size limits (Express default)
 * 
 * 2. Middleware Order:
 *    - Security middleware first (CORS)
 *    - Request parsing (express.json)
 *    - Routes
 *    - Error handling last (catch-all)
 * 
 * 3. Error Handling:
 *    - Centralized error middleware
 *    - Separate 404 and general error handlers
 *    - Consistent error response format
 */

import express from 'express';
import cors from 'cors';
import apartmentRouter from './routes/apartment.routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandlers';

const app = express();

// Development origin - should be environment variable in production
const allowedOrigin = 'http://localhost:3000';

// Security: Strict CORS configuration with explicit methods
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'] // Explicitly allowed methods only
}));
// Body parsing middleware
app.use(express.json());

/**
 * Health check endpoint for monitoring and load balancers.
 * Simple response to verify service is running and responding.
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API Routes: Modular routing with versioned API path
app.use('/api/apartments', apartmentRouter);

// Error Handling: Must be last in middleware chain
app.use(notFoundHandler);    
app.use(errorHandler);   

export default app;

