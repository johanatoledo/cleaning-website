
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingRoutes from './routes/bookingRoutes.js';
import { generateCsrfTokenMiddleware } from './middleware/csrf.js';
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;



app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret', 
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax', 
        maxAge: 1000 * 60 * 60 * 24
    }
}));


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});
app.use(generateCsrfTokenMiddleware);


app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: res.locals.csrfToken });
});

app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});


app.use((err, req, res) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

app.set('etag', false);

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log('¿CSRF_SECRET cargado?:', process.env.CSRF_SECRET ? 'SÍ' : 'NO');
});
