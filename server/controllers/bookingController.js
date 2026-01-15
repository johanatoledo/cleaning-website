
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { sendQuoteEmail, sendAdminNotification } from '../services/emailService.js';


/**
 * POST /api/pricing/calculate
 */
export async function calculatePrice(req, res) {
    try {
        const { serviceCode, beds, baths, freq, extras } = req.body;

        
        if (!serviceCode || beds === undefined || baths === undefined || !freq) {
            return res.status(400).json({ error: 'Missing required fields for calculation' });
        }

        
        let base = 5000; 
        let price = base + (Number(beds) * 1000) + (Number(baths) * 1000);

        if (Array.isArray(extras)) {
            price += extras.length * 500;
        }

        const multipliers = {
            'weekly': 0.85,    // 15% descuento
            'biweekly': 0.90,  // 10% descuento
            'monthly': 0.95,   // 5% descuento
            'one-time': 1.0
        };

        const freqKey = freq.toLowerCase();
        if (multipliers[freqKey]) {
            price = Math.round(price * multipliers[freqKey]);
        }

        return res.json({ 
            success: true,
            amount: price,
            currency: 'USD' 
        });

    } catch (error) {
        console.error('Error in calculatePrice:', error);
        return res.status(500).json({ error: 'Calculation failed' });
    }
}

/**
 * POST /api/bookings/quote
 * Recibe una cotización del cliente y la guarda en la BD
 */
export async function submitQuote(req, res) {
    try {
        const { serviceCode, beds, baths, freq, extras, date, time, address, zip, customer, quoteAmount } = req.body;

        
        if (!serviceCode || !customer || !customer.email || !customer.name || !date || !time || !address || !zip || !customer.phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        
        if (typeof customer.email !== 'string' || !customer.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (typeof customer.phone !== 'string' || customer.phone.length < 10) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        if (!Number.isInteger(beds) || beds <= 0 || beds > 10) {
            return res.status(400).json({ error: 'Beds must be a number between 1 and 10' });
        }

        if (!Number.isInteger(baths) || baths <= 0 || baths > 10) {
            return res.status(400).json({ error: 'Baths must be a number between 1 and 10' });
        }

        if (!Number.isInteger(quoteAmount) || quoteAmount <= 0) {
            return res.status(400).json({ error: 'Quote amount must be a positive number' });
        }

        
        if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        
        if (!time.match(/^\d{2}:\d{2}$/)) {
            return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
        }

        if (typeof address !== 'string' || address.trim().length < 5) {
            return res.status(400).json({ error: 'Address must be at least 5 characters' });
        }

        if (typeof zip !== 'string' || !zip.match(/^[0-9]{5}$/)) {
            return res.status(400).json({ error: 'Invalid zip code format' });
        }

        if (typeof serviceCode !== 'string' || serviceCode.trim().length === 0) {
            return res.status(400).json({ error: 'Service code is required' });
        }

        if (typeof freq !== 'string' || !['one-time', 'weekly', 'biweekly', 'monthly'].includes(freq)) {
            return res.status(400).json({ error: 'Invalid frequency value' });
        }

        
        const connection = await pool.getConnection();

        try {
            
            await connection.beginTransaction();

            
            const [existingCustomer] = await connection.query(
                'SELECT id FROM customers WHERE email = ?',
                [customer.email]
            );

            let customerId;
            if (existingCustomer.length > 0) {
                customerId = existingCustomer[0].id;
                
                //await connection.query(
                  //  'UPDATE customers SET phone = ? WHERE id = ?',
                   // [customer.phone, customerId]
                //);
                // ACTUALIZACIÓN: Ahora actualizamos nombre Y teléfono 
                // para que coincida con lo que el usuario escribió hoy solo pruebas luego borrar y dejar
                //la de arriba si se quiere solo actualizar telefono
                 await connection.query(
                'UPDATE customers SET name = ?, phone = ? WHERE id = ?',
                 [customer.name, customer.phone, customerId]
    );
            } else {
                
                const [result] = await connection.query(
                    'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
                    [customer.name, customer.email, customer.phone]
                );
                customerId = result.insertId;
            }

            
            const quoteId = uuidv4();
            const [quoteResult] = await connection.query(
                `INSERT INTO quotes 
                (quote_id, customer_id, service_code, beds, baths, frequency, address, zip_code, extras, quote_amount, service_date, service_time, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
                [quoteId, customerId, serviceCode, beds, baths, freq, address, zip, JSON.stringify(extras || []), quoteAmount, date, time]
            );

            
            await connection.query(
                `INSERT INTO audit_log (action, entity_type, entity_id, new_value, performed_by)
                VALUES (?, ?, ?, ?, ?)`,
                ['QUOTE_CREATED', 'quotes', quoteResult.insertId, JSON.stringify(req.body), 'system']
            );

            
            await connection.commit();

            
            sendQuoteEmail(customer.email, {
                customerName: customer.name,
                quoteId,
                serviceCode,
                beds,
                baths,
                frequency: freq,
                address,
                date,
                time,
                quoteAmount: (quoteAmount / 100).toFixed(2),
                confirmUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-quote/${quoteId}`
            }).catch(err => console.error('Error sending quote email:', err));

            return res.status(201).json({
                success: true,
                message: 'Quote submitted successfully',
                quoteId,
                customerId
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error in submitQuote:', error);
        return res.status(500).json({
            error: 'Failed to submit quote',
            message: error.message
        });
    }
}

/**
 * GET /api/bookings/quote/:quoteId
 * Obtiene los detalles de una cotización
 */
export async function getQuote(req, res) {
    try {
        const { quoteId } = req.params;

        
        if (!quoteId) {
            return res.status(400).json({ error: 'Quote ID is required' });
        }

        
        if (!quoteId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            return res.status(400).json({ error: 'Invalid quote ID format' });
        }

        const connection = await pool.getConnection();

        try {
            const [quotes] = await connection.query(
                `SELECT q.*, c.name as customer_name, c.email, c.phone
                FROM quotes q
                INNER JOIN customers c ON q.customer_id = c.id
                WHERE q.quote_id = ?`,
                [quoteId]
            );

            if (quotes.length === 0) {
                return res.status(404).json({ error: 'Quote not found' });
            }

            return res.status(200).json({
                success: true,
                quote: quotes[0]
            });

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error in getQuote:', error);
        return res.status(500).json({ error: 'Failed to fetch quote' });
    }
}

/**
 * POST /api/bookings/quote/:quoteId/confirm
 * Confirma una cotización y crea un servicio confirmado
 */
export async function confirmQuote(req, res) {
    try {
        const { quoteId } = req.params;

        
        if (!quoteId) {
            return res.status(400).json({ error: 'Quote ID is required' });
        }

        
        if (!quoteId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            return res.status(400).json({ error: 'Invalid quote ID format' });
        }

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            
           const [quotes] = await connection.query(
             `SELECT q.*, c.name as customer_name, c.phone, c.email 
              FROM quotes q
              INNER JOIN customers c ON q.customer_id = c.id
              WHERE q.quote_id = ?`,
             [quoteId]
            );

            if (quotes.length === 0) {
                await connection.rollback();
                return res.status(404).json({ error: 'Quote not found' });
            }

            const quote = quotes[0];

            // 2. Actualizar estado de la cotización a confirmada
            
            await connection.query(
                'UPDATE quotes SET status = ? WHERE quote_id = ?',
                ['confirmed', quoteId]
            );

            // 3. Crear el servicio confirmado
            const bookingId = uuidv4();
            await connection.query(
                `INSERT INTO confirmed_bookings 
                (booking_id, quote_id, customer_id, confirmation_token, confirmed_at, scheduled_date, scheduled_time, completion_status)
                VALUES (?, ?, ?, ?, NOW(), ?, ?, 'pending')`,
                [bookingId, quote.id, quote.customer_id, uuidv4(), quote.service_date, quote.service_time]
            );

            // 4. Log de auditoría
            await connection.query(
                `INSERT INTO audit_log (action, entity_type, entity_id, old_value, new_value)
                VALUES (?, ?, ?, ?, ?)`,
                ['QUOTE_CONFIRMED', 'quotes', quote.id, JSON.stringify({ status: 'pending' }), JSON.stringify({ status: 'confirmed' })]
            );
            // 5. ENVIAR CORREO AL STAFF
            await sendAdminNotification(quote);

            await connection.commit();

            return res.status(201).json({
                success: true,
                message: 'Service confirmed and staff notified successfully',
                bookingId,
                bookingDetails: {
                    quoteId,
                    bookingId,
                    customerId: quote.customer_id,
                    serviceCode: quote.service_code,
                    scheduledDate: quote.service_date,
                    scheduledTime: quote.service_time
                }
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error in confirmQuote:', error);
        return res.status(500).json({
            error: 'Failed to confirm quote',
            message: error.message
        });
    }
}

/**
 * GET /api/bookings/confirmed/:bookingId
 * Obtiene los detalles de un servicio confirmado
 */
export async function getConfirmedBooking(req, res) {
    try {
        const { bookingId } = req.params;

        
        if (!bookingId) {
            return res.status(400).json({ error: 'Booking ID is required' });
        }

        
        if (!bookingId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            return res.status(400).json({ error: 'Invalid booking ID format' });
        }

        const connection = await pool.getConnection();

        try {
            const [bookings] = await connection.query(
                `SELECT cb.*, q.*, c.name as customer_name, c.email, c.phone
                FROM confirmed_bookings cb
                INNER JOIN quotes q ON cb.quote_id = q.id
                INNER JOIN customers c ON cb.customer_id = c.id
                WHERE cb.booking_id = ?`,
                [bookingId]
            );

            if (bookings.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            return res.status(200).json({
                success: true,
                booking: bookings[0]
            });

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error in getConfirmedBooking:', error);
        return res.status(500).json({ error: 'Failed to fetch booking' });
    }
}

/**
 * GET /api/bookings
 * Lista todas las cotizaciones y servicios (con filtros opcionales)
 */
export async function listBookings(req, res) {
    try {
        const { status, startDate, endDate } = req.query;

        
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        
        if (startDate && !startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD' });
        }

        if (endDate && !endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD' });
        }

        
        if (startDate && endDate && startDate > endDate) {
            return res.status(400).json({ error: 'Start date cannot be greater than end date' });
        }

        let query = `
            SELECT q.*, c.name as customer_name, c.email, c.phone
            FROM quotes q
            INNER JOIN customers c ON q.customer_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND q.status = ?';
            params.push(status);
        }

        if (startDate) {
            query += ' AND q.service_date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND q.service_date <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY q.created_at DESC LIMIT 100';

        const connection = await pool.getConnection();

        try {
            const [bookings] = await connection.query(query, params);

            return res.status(200).json({
                success: true,
                total: bookings.length,
                bookings
            });

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error in listBookings:', error);
        return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}
