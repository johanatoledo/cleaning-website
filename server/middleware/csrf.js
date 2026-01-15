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

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

    if (!tokenFromHeader || tokenFromHeader !== tokenInSession) {
        return res.status(403).json({ error: 'Invalid or missing CSRF token' });
    }

    
    next();
}