
import express from 'express';
import {
    calculatePrice,
    submitQuote,
    getQuote,
    confirmQuote,
    getConfirmedBooking,
    listBookings
} from '../controllers/bookingController.js';
import {  verifyCsrfToken } from '../middleware/csrf.js';

const router = express.Router();


router.post('/calculate',verifyCsrfToken, calculatePrice);


router.post('/quote',verifyCsrfToken, submitQuote);


router.get('/quote/:quoteId', getQuote);


router.post('/quote/:quoteId/confirm',verifyCsrfToken, confirmQuote);


router.get('/confirmed/:bookingId', getConfirmedBooking);


router.get('/', listBookings);

export default router;
