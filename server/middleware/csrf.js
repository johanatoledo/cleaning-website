import crypto from 'crypto';


export function generateCsrfTokenMiddleware(req, res, next) {
    
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    
    
    res.locals.csrfToken = req.session.csrfToken;
    next();
}


export function verifyCsrfToken(req, res, next) {
    const tokenFromHeader = req.get('X-CSRF-Token');
    const tokenInSession = req.session.csrfToken;

    if (!tokenFromHeader || tokenFromHeader !== tokenInSession) {
        return res.status(403).json({ error: 'Invalid or missing CSRF token' });
    }

    
    next();
}